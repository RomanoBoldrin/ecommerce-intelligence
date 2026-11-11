# Merchant Pulse — Data Model

**Version:** 0.3  
**Database:** PostgreSQL  
**ORM:** Prisma

## 1. Modeling principles

The data model supports four distinct concerns:

1. Dashboard users and authentication.
2. E-commerce catalog, visitor sessions, navigation events, and orders.
3. Data imports and processing traceability.
4. Simulated IoT devices and telemetry.

Merchant Pulse is a single-store application: it analyzes the data of one e-commerce business. The model has no `Store` entity, no `storeId` columns and no tenant concept. Business keys (SKU, external order ID, device code, ...) are globally unique.

The model must distinguish visitor behavior from dashboard authentication. These are different domains and must never share the same session table.

## 2. Entity overview

```mermaid
erDiagram
    USER ||--o{ AUTH_SESSION : opens
    USER ||--o{ PASSWORD_RESET_TOKEN : receives

    CATEGORY ||--o{ PRODUCT : classifies

    DATA_IMPORT ||--o{ VISITOR_SESSION : imports
    DATA_IMPORT ||--o{ NAVIGATION_EVENT : imports
    DATA_IMPORT ||--o{ ORDER : imports

    VISITOR_SESSION ||--o{ NAVIGATION_EVENT : generates
    VISITOR_SESSION ||--o{ ORDER : may_be_attributed_to

    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : appears_in

    IOT_DEVICE ||--o{ IOT_READING : produces

```

The diagram represents logical relationships. Optional relationships, uniqueness rules, and exact foreign-key behavior must be reflected in the Prisma schema.

## 3. Enumerations

Suggested Prisma enums:

```prisma
enum UserRole {
  ADMIN
  MANAGER
  ANALYST
}

enum EventType {
  VISIT
  PRODUCT_VIEW
  CART_ADD
  CHECKOUT_START
  ORDER_COMPLETED
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
  RETURNED
}

enum ImportStatus {
  IN_PROGRESS
  COMPLETED
  ERROR
}

enum DataSourceType {
  SYNTHETIC
  EXTERNAL_EXPORT
  API
}

enum DataFileFormat {
  CSV
  PARQUET
}

enum DeviceStatus {
  ACTIVE
  INACTIVE
}

enum MeasurementType {
  TEMPERATURE
  HUMIDITY
  ENERGY
}

enum RecommendationPriority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}
```

Persisted enum values should be stable. Changes to their names or meanings require migrations and updates to application logic.

## 4. Core entities

### 4.1 Application timezone

There is no store entity. The business timezone is the application constant `America/Sao_Paulo` (configuration, not database state). Timestamps are stored as UTC instants (`timestamptz`); business dates for revenue, funnel cohorts and forecasts are derived in this timezone at query time.

Access control is based on the authenticated user's role. There is no per-store data isolation because there is only one store.

### 4.2 User

Represents a dashboard user.

| Field        | Type     | Notes                           |
| ------------ | -------- | ------------------------------- |
| id           | UUID     | Primary key                     |
| name         | String   | Display name                    |
| email        | String   | Unique login identifier         |
| passwordHash | String   | Never store plaintext passwords |
| role         | UserRole | ADMIN, MANAGER, ANALYST         |
| isActive     | Boolean  | Allows account deactivation     |
| createdAt    | DateTime | Creation timestamp              |
| updatedAt    | DateTime | Last update                     |

The authentication model is adapted from PI-II. Domain-specific fields and relationships from that project must not be carried over.

### 4.3 AuthSession

Represents an authenticated dashboard session.

Suggested fields:

| Field     | Type     | Notes                            |
| --------- | -------- | -------------------------------- |
| sessionId | UUID     | Primary key                      |
| tokenHash | String   | Unique hash of raw session token |
| userId    | UUID     | Dashboard user                   |
| expiresAt | DateTime | Session expiration               |
| createdAt | DateTime | Creation timestamp               |
| updatedAt | DateTime | Last update                      |

Indexes:

- Unique index on `tokenHash`.
- Index on `userId`.
- Index on `expiresAt`.
- Composite index on `userId` and `expiresAt`.

The raw session token must never be persisted. It should be sent to the client only through the configured secure cookie mechanism.

### 4.4 PasswordResetToken

Represents a password-reset request.

Suggested fields:

| Field     | Type      | Notes               |
| --------- | --------- | ------------------- |
| id        | UUID      | Primary key         |
| tokenHash | String    | Unique token hash   |
| userId    | UUID      | User reference      |
| expiresAt | DateTime  | Expiration          |
| usedAt    | DateTime? | Null until consumed |
| createdAt | DateTime  | Creation timestamp  |

The reset token must be single-use and expire. Store a hash rather than the raw token.

### 4.5 Category

Represents a product category.

| Field       | Type     | Notes                |
| ----------- | -------- | -------------------- |
| id          | UUID     | Primary key          |
| name        | String   | Category name        |
| description | String?  | Optional description |
| createdAt   | DateTime | Creation timestamp   |
| updatedAt   | DateTime | Last update          |

Category names are nominal categorical values. They must not be used as numerical measurements.

### 4.6 Product

Represents a product in the analyzed catalog.

| Field         | Type     | Notes                               |
| ------------- | -------- | ----------------------------------- |
| id            | UUID     | Primary key                         |
| categoryId    | UUID     | Category relationship               |
| sku           | String   | Globally unique product code        |
| name          | String   | Product name                        |
| price         | Decimal  | Product price                       |
| isActive      | Boolean  | Product availability in the catalog |
| stockSnapshot | Int?     | Optional read-only imported value   |
| createdAt     | DateTime | Creation timestamp                  |
| updatedAt     | DateTime | Last update                         |

`sku` is unique, preventing duplicate products.

Stock values, if present, are historical or imported snapshots only. Merchant Pulse does not provide inventory operations.

### 4.7 VisitorSession

Represents an anonymous or pseudonymous e-commerce visitor session.

It is not an authentication session.

| Field         | Type     | Notes                                               |
| ------------- | -------- | --------------------------------------------------- |
| id            | UUID     | Internal primary key                                |
| sessionHash   | String   | Pseudonymous external session identifier            |
| customerHash  | String?  | Optional pseudonymous returning-customer identifier |
| startedAt     | DateTime | Session start                                       |
| deviceType    | String?  | Device classification                               |
| trafficSource | String?  | Acquisition source                                  |
| stateCode     | String?  | Optional Brazilian state code                       |
| dataImportId  | UUID?    | Import provenance                                   |
| createdAt     | DateTime | Record creation                                     |

`externalSessionId` (the stable external session identifier) is unique. If multiple source systems are supported, include the source identity in the identifier.

Do not store consumer names, emails, phone numbers, or full addresses.

Hashing is pseudonymization, not proof of anonymization.

### 4.8 NavigationEvent

Represents a navigation or purchase-journey event.

| Field            | Type      | Notes                                   |
| ---------------- | --------- | --------------------------------------- |
| id               | UUID      | Primary key                             |
| visitorSessionId | UUID      | Visitor session                         |
| productId        | UUID?     | Optional product                        |
| eventType        | EventType | Five-stage event taxonomy               |
| occurredAt       | DateTime  | Event timestamp                         |
| sourceEventId    | String?   | External event identifier               |
| fingerprint      | String?   | Deterministic deduplication fingerprint |
| dataImportId     | UUID?     | Import provenance                       |
| createdAt        | DateTime  | Record creation                         |

The event taxonomy is:

- `VISIT`
- `PRODUCT_VIEW`
- `CART_ADD`
- `CHECKOUT_START`
- `ORDER_COMPLETED`

A session may generate multiple events of the same type. Funnel aggregation must count a session only once per stage.

When an external event ID exists, use it for deduplication within its source scope. Otherwise, use a deterministic fingerprint based on the session, event type, timestamp, product, and source context as appropriate.

### 4.9 Order

Represents a transaction recorded by the e-commerce source.

| Field            | Type        | Notes                               |
| ---------------- | ----------- | ----------------------------------- |
| id               | UUID        | Primary key                         |
| visitorSessionId | UUID?       | Optional session attribution        |
| externalOrderId  | String?     | Source order identifier             |
| status           | OrderStatus | Transaction status                  |
| createdAt        | DateTime    | Order creation timestamp            |
| subtotal         | Decimal     | Sum of item values before discounts |
| discountAmount   | Decimal     | Discount amount                     |
| shippingAmount   | Decimal     | Shipping amount                     |
| totalAmount      | Decimal     | Final order total                   |
| dataImportId     | UUID?       | Import provenance                   |

`externalOrderId` is unique. If multiple source systems are supported, include the source identity in the identifier.

The order total must be validated against its components. The permitted relationship is:

`totalAmount = subtotal - discountAmount + shippingAmount`

The database or ingestion layer must reject invalid negative amounts and discounts exceeding the applicable subtotal.

### 4.10 OrderItem

Represents a product line within an order.

| Field          | Type    | Notes                        |
| -------------- | ------- | ---------------------------- |
| id             | UUID    | Primary key                  |
| orderId        | UUID    | Order relationship           |
| productId      | UUID    | Product relationship         |
| quantity       | Int     | Number of units              |
| unitPrice      | Decimal | Price at order time          |
| discountAmount | Decimal | Line-level discount, if used |
| lineTotal      | Decimal | Final line total             |

An explicit primary key is preferred when the source can contain multiple lines for the same product, such as separate variants or distinct discounts.

The unit price should be retained as a transaction snapshot. Product catalog price may change after an order is created.

### 4.11 DataSource

Represents the **logical origin** of imported data: who produced it, not how the file is serialized.

Initial implementation: the database holds one `DataSource`, the reproducible Python synthetic-data generator (`type = SYNTHETIC`). CSV and Parquet are serialization formats of that generator's output; they are **not** separate sources and do not get separate `DataSource` rows.

Fields: `id`, `name` (unique), `type` (`SYNTHETIC`, `EXTERNAL_EXPORT`, `API`), `description`, `isActive`, `createdAt`, `updatedAt`.

`EXTERNAL_EXPORT` (file exports from an external platform) and `API` are reserved for future independent sources and are not implemented. Do not store secrets in `DataSource` metadata.

### 4.12 DataImport

Represents one import batch/execution of a data source, used for provenance and processing counts.

The consolidated synthetic dataset is imported from CSV or Parquet files; `fileName` and `fileFormat` (`CSV` or `PARQUET`) describe the file of that run. Sessions, events and orders reference their batch through the optional `dataImportId` (`SetNull` on delete, so removing an import log never deletes business records).

Suggested fields:

- id
- dataSourceId
- status
- fileName, fileFormat
- startedAt
- completedAt
- recordsRead
- recordsAccepted
- recordsRejected
- recordsCorrected
- duplicatesRemoved
- errorSummary
- metadata

Each import should be traceable to its source and processing result.

Re-running the same import must not create duplicate sessions, events, or orders when stable source identifiers are available.

#### Initial ingestion strategy and future multi-source extension

- **Today:** one consolidated, reproducible synthetic dataset from one generator. External identifiers (`externalSessionId`, `externalOrderId`, `deduplicationKey`, `sku`, `deviceCode`) are **globally unique**, and the generator must guarantee that. Deduplication relies on those unique constraints, not on the import run.
- **Not implemented:** independent external sources (CSV exports from other platforms, API integrations). Two such sources may reuse the same identifiers, so the global constraints would wrongly collapse or reject their records.
- **Required before supporting them:** add source-scoped identity (a `dataSourceId` on the externally identified records and composite unique keys such as `(dataSourceId, externalOrderId)`, or source-prefixed identifiers), define product/category matching across sources, and migrate existing rows to the synthetic source. This needs a migration and is deliberately deferred.

## 5. IoT entities

IoT telemetry is a separate domain. It must not be inserted into the e-commerce `NavigationEvent` table.

### 5.1 IoTDevice

Represents a simulated warehouse monitoring device.

Suggested fields:

- id
- deviceCode
- name
- status
- locationLabel
- createdAt
- updatedAt

`deviceCode` must be unique.

### 5.2 IoTReading

Represents a measurement produced by a device.

Suggested fields:

- id
- deviceId
- measurementType
- measuredAt
- numericValue
- receivedAt
- sourceFingerprint

Measurements:

- `TEMPERATURE`, unit °C.
- `HUMIDITY`, unit %.
- `ENERGY`, unit kW.

For a design with one row per device and timestamp containing all measurements, the schema may instead store temperature, humidity, and energy as separate nullable numeric columns. The implementation must choose one consistent representation and document it.

The normalized measurement-type design is flexible for adding new measurement types. The single-row design may be more convenient for the fixed three-measurement simulator.

Uniqueness should prevent duplicate measurements for the same device, timestamp, and measurement type.

## 6. Analytical configuration entities

### 6.1 IndicatorTarget

Stores configurable targets or thresholds for dashboard indicators.

Suggested fields:

- id
- indicatorKey
- targetValue
- warningThreshold
- criticalThreshold
- createdAt
- updatedAt

The indicator key must identify a documented metric. Thresholds must have a defined comparison direction and unit.

### 6.2 Recommendation

Stores rule-based recommendations shown in the dashboard.

Suggested fields:

- id
- indicatorKey
- title
- description
- priority
- observedValue
- targetValue
- generatedAt
- status or dismissal state, if needed

Recommendations are generated from documented rules and metric deviations. They must not be described as machine-learning predictions unless a model actually generates them.

## 7. Funnel semantics

The funnel is session-based.

For each session:

1. Identify the visit stage.
2. Identify whether the session reached product view.
3. Identify whether the session reached cart addition.
4. Identify whether the session reached checkout initiation.
5. Identify whether the session reached completed order.

Each stage is counted at most once per session.

Events must be ordered chronologically. A session cannot be counted at a later stage without satisfying the required preceding stages under the project's funnel definition.

The primary funnel date is the visitor session start date. This is a cohort attribution rule, not the date of every individual event.

### Conversion caveat

One session may generate multiple orders. A completed order is therefore not automatically equivalent to one converted session.

If an order is explicitly attributed to a visitor session, the funnel can count that session as converted once. If attribution is missing, the system must report order counts and session conversion separately.

## 8. Revenue semantics

Only orders with status:

- `PAID`
- `SHIPPED`
- `DELIVERED`

contribute to recognized revenue.

Exclude:

- `PENDING`
- `CANCELLED`
- `RETURNED`

Revenue is attributed to the order creation date in the application timezone (`America/Sao_Paulo`).

Average order value:

`recognized revenue / eligible order count`

Revenue per product must be calculated from eligible order items, not from product navigation events.

The precise inclusion of shipping and discounts must remain consistent with the documented `totalAmount` definition.

## 9. Demand forecasting dataset

The model-training dataset is derived from eligible order items.

Processing steps:

1. Filter orders to eligible revenue statuses.
2. Join order items to products and categories.
3. Aggregate quantity by business date and category.
4. Build a complete daily category time series where required.
5. Create calendar, promotion, lag, and rolling features.
6. Exclude rows without the required historical information.
7. Split chronologically into training, validation, and test periods.

Target:

`daily_units_sold`

Candidate features:

- category identifier, treated as categorical;
- day of week;
- month;
- weekend indicator;
- promotion indicator;
- sales lags at 1, 7, and 14 days;
- rolling means at 7 and 28 days.

All features must be available at the prediction time. No future sales may contribute to lag or rolling features.

Model artifacts and evaluation metadata should be stored separately from transactional source records. The initial implementation may store model metadata and precomputed forecasts in the database or as versioned artifacts, depending on the integration design.

## 10. Variable classification

| Variable                | Measurement type           | Notes                                    |
| ----------------------- | -------------------------- | ---------------------------------------- |
| Product category        | Qualitative nominal        | Frequencies and proportions              |
| Device type             | Qualitative nominal        | Frequencies and proportions              |
| Traffic source          | Qualitative nominal        | Frequencies and proportions              |
| Order status            | Qualitative nominal        | Frequencies and proportions              |
| User role               | Qualitative nominal        | Frequencies and proportions              |
| Recommendation priority | Qualitative ordinal        | Ordered categories                       |
| Temperature             | Quantitative interval-like | Numeric summaries                        |
| Humidity                | Quantitative ratio         | Numeric summaries                        |
| Energy consumption      | Quantitative ratio         | Numeric summaries                        |
| Units sold              | Quantitative ratio         | Numeric summaries                        |
| Revenue                 | Quantitative ratio         | Numeric summaries                        |
| Session duration        | Quantitative ratio         | Numeric summaries                        |
| Timestamps              | Temporal                   | Time-based grouping and intervals        |
| IDs and hashes          | Identifiers                | Never summarize as continuous quantities |

## 11. Deduplication and integrity

Recommended deduplication keys:

| Entity           | Key                                          |
| ---------------- | -------------------------------------------- |
| Product          | SKU                                          |
| Visitor session  | External session ID                          |
| Navigation event | Source event ID or deterministic fingerprint |
| Order            | External order ID                            |
| IoT device       | Device code                                  |
| IoT reading      | Device + timestamp + measurement type        |

When source identifiers are unavailable, the fingerprint algorithm must be deterministic and documented.

Use database constraints for uniqueness and referential integrity wherever practical. Application-level validation alone is insufficient for critical uniqueness rules.

## 12. Indexing considerations

Initial indexes should support:

- Product and category lookups.
- Visitor sessions by start time.
- Navigation events by session, type, and occurrence time.
- Orders by status and creation time.
- Order items by order and product.
- Imports by creation time and status.
- IoT readings by device and measurement timestamp.
- Authentication sessions by token hash, user, and expiration.

Index design should be revisited using actual query plans and representative data volumes. Avoid creating indexes without a query or integrity requirement.

## 13. Data retention and privacy

- Do not store consumer direct identifiers.
- Use pseudonymous hashes where visitor linkage is required.
- Restrict access to raw visitor-level data.
- Use aggregated results for dashboard presentation whenever possible.
- Exclude consumer personal information from exports.
- Define retention for imports, telemetry, and visitor records.
- Do not claim hashes guarantee anonymization.

## 14. Implementation notes

The collaborator's proposed SQL schema is a starting point, not an immutable contract. The Prisma model must reflect the semantics defined in this document.

The initial implementation should avoid unnecessary dimensional tables or materialized views. A calendar dimension may be introduced if it materially improves the analytical workflow. Otherwise, PostgreSQL date operations are sufficient.

Analytical queries must support the selected date range. Fixed-period views should not be used where the dashboard requires dynamic filters.

## 15. Prisma implementation decisions (schema v2, single store)

`prisma/schema.prisma` implements this model (17 models, 9 enums) with these deliberate deviations from the suggestions above:

| Topic             | Decision                                                                                                                                                                                                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Single store      | No `Store` model and no `storeId`. Natural keys are globally unique: `Category.name`, `Product.sku`, `VisitorSession.externalSessionId`, `NavigationEvent.deduplicationKey`, `Order.externalOrderId`, `DataSource.name`, `IoTDevice.deviceCode`, `IndicatorTarget.indicatorKey`. |
| Timezone          | `America/Sao_Paulo` is an application constant, not a column.                                                                                                                                                                                                                    |
| Event enum        | `NavigationEventType`: `SESSION_START`, `PRODUCT_VIEW`, `ADD_TO_CART`, `CHECKOUT_START`, `ORDER_COMPLETED` (replaces `EventType` `VISIT`/`CART_ADD`). Maps 1:1 to the five funnel stages.                                                                                        |
| Other enum names  | `DataImportStatus` (was `ImportStatus`); `DeviceStatus`/`MeasurementType` replaced by `IoTDevice.isActive` and the single-row IoT reading design.                                                                                                                                |
| Names             | `VisitorSession.externalSessionId`/`visitorHash` (was `sessionHash`/`customerHash`); `Order.discount`/`total`; `NavigationEvent.deduplicationKey` (required, replaces `fingerprint`).                                                                                            |
| Dedup scope       | Global unique keys, without source identity; valid because the initial dataset comes from one generator. Independent external sources need source-scoped identity first (§4.12).                                                                                                 |
| Source vs. format | `DataSourceType` = logical origin (`SYNTHETIC`, `EXTERNAL_EXPORT`, `API`); `DataFileFormat` (`CSV`, `PARQUET`) is stored on `DataImport.fileFormat`.                                                                                                                             |
| IoT reading       | One row per device and `recordedAt` with temperature, humidity and energy. Unique `(deviceId, recordedAt)`. Data is simulated.                                                                                                                                                   |
| Thresholds        | Stored in `IndicatorTarget` (`direction`, `warningThreshold`, `criticalThreshold`), compared at query time. Demonstration parameters, not safety limits.                                                                                                                         |
| Forecasts         | `ForecastRun` and `DemandForecast` persist precomputed forecasts and test-set metrics (`Float`); not live inference.                                                                                                                                                             |
| Order total       | `shippingAmount` retained from §4.9 (default 0).                                                                                                                                                                                                                                 |
| Deferred          | `customerHash`, `stateCode`, `DataImport` counters (`recordsRead/Accepted/...`), `metadata` JSON.                                                                                                                                                                                |

Foreign-key behavior: `AuthSession`, `PasswordResetToken` cascade from `User`; `OrderItem` cascades from `Order`; `NavigationEvent` cascades from `VisitorSession`; `DemandForecast` cascades from `ForecastRun`. `Product`, `Category`, `IoTDevice`, `DataSource` use `Restrict` so history is not silently deleted. Optional links (`Order.visitorSessionId`, `NavigationEvent.productId`, `dataImportId`) use `SetNull`.

### Constraints Prisma cannot express (future raw-SQL migration, after approval)

Add as `CHECK` constraints by editing the generated migration SQL before applying it:

- `products.price >= 0`; `order_items.quantity > 0`; `order_items.unit_price >= 0`; `order_items.discount >= 0`.
- `orders.subtotal/discount/shipping_amount/total >= 0`; `orders.discount <= orders.subtotal`; `orders.total = subtotal - discount + shipping_amount`.
- `iot_readings.relative_humidity BETWEEN 0 AND 100`; `energy_consumption_kw >= 0`.
- `visitor_sessions.ended_at >= started_at`; `password_reset_tokens.expires_at > created_at`.
- Revenue eligibility and funnel ordering are query semantics, not constraints.

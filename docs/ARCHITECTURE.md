# Merchant Pulse — Technical Architecture

## 1. Architectural Overview

Merchant Pulse follows a **modular monolithic architecture**.

The application consists of one Next.js project, one PostgreSQL database, and internally separated modules responsible for data ingestion, analytics, recommendations, and visualization.

The architecture prioritizes simplicity, maintainability, and compatibility with Vercel deployment.

Microservices are not required.

## 2. Technology Decisions

| Concern              | Decision           |
| -------------------- | ------------------ |
| Framework            | Next.js            |
| Router               | Pages Router       |
| Programming language | JavaScript         |
| Frontend             | React              |
| Styling              | Tailwind CSS       |
| Charts               | Recharts           |
| Backend              | Next.js API Routes |
| ORM                  | Prisma             |
| Database             | PostgreSQL         |
| Hosting              | NeonDB             |
| Deployment           | Vercel             |
| Testing              | Jest               |

### Additional libraries

The following libraries are proposed:

- Zod: input and dataset validation.
- Papa Parse: CSV parsing.
- date-fns: date manipulation.
- Recharts: data visualization.

Dependencies must be introduced only when they provide a concrete benefit.

## 3. Logical Architecture

The application is organized into four logical layers.

### 3.1 Data Sources

Responsible for providing information to Merchant Pulse.

Sources include:

- Synthetic e-commerce datasets.
- Authorized CSV exports from the partner's e-commerce platform.
- Simulated IoT telemetry.

Each source must have a clearly defined input format.

### 3.2 Data Processing

Responsible for transforming incoming information into consistent records.

Responsibilities:

- Data ingestion.
- Structural validation.
- Field normalization.
- Duplicate detection.
- Data cleaning.
- Persistence.
- Import history.

The processing layer must be independent of the dashboard interface.

### 3.3 Analytics

Responsible for extracting meaningful information from stored records.

Modules:

- Overview analytics.
- Funnel analytics.
- Product analytics.
- Customer behavior analytics.
- Recommendation engine.
- Machine learning integration.

Analytical calculations must be centralized and reusable.

### 3.4 Visualization

Responsible for presenting analytical information to the user.

Responsibilities:

- Dashboard screens.
- KPI cards.
- Charts.
- Tables.
- Filters.
- Reports.
- Data management interfaces.

The frontend must consume processed results through backend services and API endpoints.

## 4. Application Architecture

The application follows this general request flow:

```text
USER
  |
  v
NEXT.JS FRONTEND
  |
  v
NEXT.JS API ROUTES
  |
  v
APPLICATION SERVICES
  |
  +----------------------+
  |                      |
  v                      v
DATA SERVICES       ANALYTICS SERVICES
  |                      |
  v                      v
PRISMA ORM          BUSINESS CALCULATIONS
  |                      |
  +-----------+----------+
              |
              v
          POSTGRESQL
            NEONDB
```

External data acquisition follows a separate ingestion flow:

```text
CSV DATASET -----------+
                       |
IOT SIMULATOR ---------+----> INGESTION MODULE
                       |             |
AUTHORIZED EXPORT -----+             v
                                VALIDATION
                                     |
                                     v
                                TRANSFORMATION
                                     |
                                     v
                                  PRISMA
                                     |
                                     v
                                POSTGRESQL
```

## 5. Proposed Source Structure

```text
src/
│
├── pages/
│   ├── index.js
│   ├── dashboard/
│   │   ├── index.js
│   │   ├── funnel.js
│   │   ├── products.js
│   │   ├── behavior.js
│   │   └── settings.js
│   │
│   └── api/
│       ├── analytics/
│       │   ├── overview.js
│       │   ├── funnel.js
│       │   ├── products.js
│       │   └── behavior.js
│       │
│       ├── imports/
│       │   ├── index.js
│       │   └── [id].js
│       │
│       └── iot/
│           └── telemetry.js
│
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── charts/
│   ├── metrics/
│   └── ui/
│
├── services/
│   ├── analytics/
│   ├── imports/
│   ├── recommendations/
│   └── iot/
│
├── lib/
│   ├── prisma.js
│   ├── validation/
│   └── constants/
│
├── utils/
│   ├── dates/
│   └── analytics/
│
└── styles/
```

This is the initial target structure. It may evolve as implementation progresses, provided the architectural principles remain intact.

## 6. Backend Responsibilities

### API Routes

API routes are responsible for:

- Receiving requests.
- Validating parameters.
- Calling application services.
- Returning structured responses.
- Handling errors and HTTP status codes.

API routes must not contain complex business calculations.

### Application Services

Services contain the application's business logic.

Examples:

- `overview.service.js`
- `funnel.service.js`
- `products.service.js`
- `behavior.service.js`
- `recommendations.service.js`
- `import.service.js`
- `iot.service.js`

Services should remain independent of React components.

### Prisma Client

The application must use a centralized Prisma client.

Database access should be performed through Prisma unless a justified analytical SQL query is necessary.

Raw SQL is acceptable for optimized aggregations or PostgreSQL-specific operations, but it must be parameterized and tested.

## 7. Data Pipeline Architecture

The ingestion pipeline follows these stages:

1. Receive input.
2. Parse the source format.
3. Validate structure and records.
4. Normalize fields.
5. Detect duplicates.
6. Persist valid records.
7. Record errors and processing statistics.
8. Mark the import as completed, partially completed, or failed.

The pipeline must be deterministic and designed to avoid duplicate persistence.

Large imports must be processed in bounded batches.

Vercel functions must not be treated as permanent background workers.

If processing eventually exceeds execution limits, asynchronous job execution can be introduced as a separate architectural enhancement.

## 8. Analytics Architecture

Each analytical module must expose reusable service functions.

Example:

```javascript
const result = await overviewService.getOverview({
  startDate,
  endDate,
  category,
});
```

The service is responsible for querying and aggregating the necessary records.

The frontend receives structured results rather than raw database entities.

Business calculations must not be duplicated across frontend components and API routes.

## 9. IoT Architecture

IoT is an independent data acquisition module.

A simulator generates timestamped telemetry and transmits measurements through an HTTP endpoint.

```text
IOT SIMULATOR
     |
     v
HTTP POST
     |
     v
NEXT.JS API
     |
     v
IOT SERVICE
     |
     v
VALIDATION
     |
     v
POSTGRESQL
```

IoT telemetry must have its own data model and validation rules.

It must not be mixed with e-commerce navigation events.

The simulator should be independently executable and should not require physical hardware.

## 10. Machine Learning Architecture

Machine learning must remain independent of the core analytics services.

The proposed workflow is:

```text
PUBLIC E-COMMERCE DATASET
          |
          v
    PREPROCESSING
          |
          v
    MODEL TRAINING
          |
          v
      EVALUATION
          |
          v
   MODEL PREDICTIONS
          |
          v
 MERCHANT PULSE INTEGRATION
```

The initial candidate is a classification model for purchase intention or abandonment.

Training should be performed independently of Next.js.

The application may consume precomputed predictions or an exposed inference interface, depending on the final implementation decision.

A trained model must be evaluated before its predictions are presented as useful business intelligence.

## 11. Database Architecture

PostgreSQL is the centralized persistence layer.

Prisma ORM manages:

- Entity definitions.
- Relationships.
- Database migrations.
- Application queries.
- Data persistence.

The database must support indexed filtering and aggregation.

Date, session, event type, product, and relationship fields should be considered when designing indexes.

## 12. Deployment Architecture

The intended deployment is:

- Next.js application: Vercel.
- Database: NeonDB PostgreSQL.
- Source code: GitHub.
- Environment configuration: Vercel environment variables.

Development, testing, and production environments must be isolated.

Database credentials must never be committed to the repository.

## 13. Architectural Restrictions

Agents must not introduce the following without explicit approval:

- Microservices.
- A separate backend framework.
- TypeScript.
- App Router migration.
- Redis or message brokers.
- Permanent background workers.
- Unnecessary state management libraries.
- Complex multi-tenant architecture.

Any architectural change must include its motivation, benefits, and trade-offs in the relevant documentation.

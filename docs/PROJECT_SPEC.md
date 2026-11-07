# Merchant Pulse — Product Specification

## 1. Purpose

Merchant Pulse is an e-commerce intelligence application designed to help small businesses understand customer behavior, identify purchasing funnel bottlenecks, and make better business decisions through data analysis.

The application consolidates navigation events, product information, and sales records into a centralized analytical environment.

## 2. Target User

The primary user is the manager or owner of a small e-commerce business.

The intended user:

- Has limited time for analyzing business reports.
- May have limited technical knowledge.
- Needs to understand sales performance quickly.
- Wants to identify problems in the purchasing journey.
- Needs practical recommendations rather than raw data.

The interface must prioritize clarity, usability, and understandable indicators.

## 3. Functional Requirements

### FR01 — Data Import

The application must allow importing authorized e-commerce datasets.

Initial supported format: CSV.

Imported datasets may contain:

- Navigation events.
- Product catalog information.
- Orders and sales records.

The import process must validate the structure and contents before persisting records.

### FR02 — Data Processing

The system must:

- Validate required fields.
- Normalize dates and identifiers.
- Handle missing and invalid values.
- Detect duplicate records.
- Associate events with products when possible.
- Record import execution results.

### FR03 — Overview Dashboard

The dashboard must display:

- Total visits.
- Completed orders.
- Gross revenue.
- Average order value.
- Conversion rate.
- Checkout abandonment rate.
- Comparison with a previous period.
- Daily traffic and order evolution.
- Purchasing funnel overview.
- Recommended actions.

### FR04 — Sales Funnel

The application must visualize the following five stages:

1. Store visit.
2. Product view.
3. Add to cart.
4. Checkout initiation.
5. Completed purchase.

The visualization must present:

- Volume of sessions at each stage.
- Conversion between consecutive stages.
- Proportional losses between stages.
- Identification of the largest proportional drop.

Funnel calculations must use a consistent session-counting methodology.

### FR05 — Product Performance

The application must provide:

- Product rankings.
- Category performance.
- Product views.
- Cart additions.
- Completed orders.
- Conversion rates.
- Revenue per product or category.

The system should identify products with high interest but low conversion.

This module analyzes product performance and does not implement inventory management.

### FR06 — Customer Behavior

The application must provide analytical information about:

- Browsing frequency.
- Most active days.
- Most active hours.
- Product interest.
- Session behavior patterns.

Customer analysis must use anonymized identifiers or aggregated data.

### FR07 — Filters

The dashboard must support:

- Date range selection.
- Product category filtering.

All applicable dashboard indicators and visualizations must respect the selected filters.

### FR08 — Recommendations

The system must generate automatic recommendations based on analytical rules.

Each recommendation should contain:

- A description of the observed condition.
- The metric or evidence supporting it.
- A suggested business action.
- An indication of priority.

Recommendations must not present correlation or observed patterns as proven causes.

### FR09 — Data Management

The system must provide:

- Dataset import interface.
- Import history.
- Import status.
- Total processed records.
- Failed record counts.
- Pipeline execution information.

### FR10 — Export

The system should support exporting analytical summaries in CSV and, if feasible, PDF.

## 4. IoT Requirements

The project incorporates an independent simulated IoT acquisition component.

Physical hardware is not required.

The IoT component must demonstrate:

1. Generation of simulated sensor readings.
2. Transmission of telemetry through an HTTP API.
3. Validation of incoming measurements.
4. Persistence in PostgreSQL.
5. Availability of telemetry for analytical queries.

IoT telemetry must remain logically separate from e-commerce navigation events and sales records.

Its purpose is to demonstrate an additional data acquisition source and its integration into the data pipeline.

The exact sensor type, telemetry fields, generation frequency, and analytical use remain subject to technical specification.

## 5. Machine Learning Requirements

The project theme includes machine learning.

The proposed implementation is a modest predictive model for e-commerce purchase intention or abandonment.

A possible approach is:

- Use a suitable public e-commerce dataset.
- Prepare and explore the dataset.
- Train a classification baseline.
- Evaluate the model using appropriate metrics.
- Document its limitations.
- Make predictions available to the application if integration is feasible.

The partner's synthetic or aggregated operational data must not be represented as sufficient training data without evidence.

Machine learning predictions must be clearly distinguished from rule-based recommendations.

The exact dataset, algorithm, evaluation criteria, and deployment approach remain pending.

## 6. Non-Functional Requirements

### NFR01 — Privacy

The application must not expose personally identifiable customer information.

### NFR02 — Usability

The interface must be understandable to users without technical expertise.

### NFR03 — Data Consistency

The same inputs and calculation rules must produce consistent analytical results.

### NFR04 — Maintainability

The application must use modular and clearly separated business logic.

### NFR05 — Performance

Analytical queries must avoid unnecessary retrieval of raw event records.

The backend should return aggregated results whenever possible.

### NFR06 — Responsiveness

The dashboard must adapt to desktop and mobile screen sizes.

### NFR07 — Reliability

Invalid imports and failed processing operations must be handled without corrupting existing data.

## 7. Explicitly Out of Scope

The following features are not part of the initial project:

- Building an e-commerce storefront.
- Payment processing.
- Customer registration and authentication.
- Customer relationship management.
- Complete inventory management.
- Order fulfillment.
- WhatsApp or email marketing automation.
- Complex multi-tenant infrastructure.
- Distributed microservices.
- Real-time production-scale streaming infrastructure.

These features must not be implemented unless the project scope is explicitly revised.

## 8. MVP Definition

The minimum viable prototype must demonstrate:

1. Successful dataset import.
2. Data validation and normalization.
3. Persistent PostgreSQL storage.
4. Correct KPI calculations.
5. Five-stage purchasing funnel.
6. Product and category analysis.
7. Customer behavior analysis.
8. Date and category filters.
9. Rule-based recommendations.
10. Independent simulated IoT data acquisition.

Machine learning should be treated as a planned academic deliverable, with the specific implementation agreed upon before that phase.

## 9. Acceptance Criteria

The prototype is considered functionally complete when:

- Valid datasets can be imported.
- Invalid datasets produce understandable errors.
- Duplicate imports do not duplicate records.
- Dashboard values correspond to the underlying database records.
- Filters produce consistent results across applicable screens.
- The funnel correctly identifies the largest proportional loss.
- Product rankings are calculated correctly.
- Recommendations are supported by actual metrics.
- Simulated IoT telemetry can be transmitted, validated, and persisted.
- Automated tests cover the principal business calculations.
- The application can be deployed to Vercel.

## 10. Requirements Traceability

The academic requirements are derived from `Relatorio_Final_PI_IV.docx`.

This specification translates them into software requirements.

If an academic requirement changes, this document must be reviewed before implementation changes are made.

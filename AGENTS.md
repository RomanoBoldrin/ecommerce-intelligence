# AGENTS.md — Merchant Pulse

Instructions for AI coding agents and contributors working on Merchant Pulse.

**Documentation version:** 0.3

## 1. Project context

Merchant Pulse is an e-commerce analytics and decision-support application developed for UNIVESP Projeto Integrador IV.

Its purpose is to help small e-commerce businesses understand the purchase journey, identify conversion bottlenecks, analyze product performance, and make better decisions through data.

The application includes:

- An interactive e-commerce analytics dashboard.
- A reproducible synthetic e-commerce data generator.
- A data preprocessing and statistical analysis pipeline.
- A supervised demand-forecasting model.
- A simulated warehouse IoT telemetry pipeline.
- An interactive IoT monitoring module.

This is not an e-commerce storefront, payment system, inventory-management application, or general-purpose ERP.

## 2. Source of truth and documentation hierarchy

Before making substantial changes, consult:

1. `docs/PROJECT_SPEC.md` — scope, requirements, and analytical definitions.
2. `docs/ARCHITECTURE.md` — architecture, technology choices, and data flows.
3. `docs/DATA_MODEL.md` — entities, relationships, and data semantics.
4. `docs/ROADMAP.md` — implementation order and completion criteria.
5. `README.md` — project overview and development setup.

The uploaded final PI-IV report establishes the academic problem context and central objectives. These engineering documents define the current implementation baseline.

If a technical proposal conflicts with the academic report, identify the conflict rather than silently changing the project's purpose.

If a requirement is unclear, inspect the existing implementation and documentation before proposing a change. Do not invent requirements or assume that an unimplemented feature already exists.

## 3. Technology constraints

### Web application

- JavaScript.
- Next.js Pages Router.
- React.
- Tailwind CSS.
- Recharts.
- Prisma ORM.
- PostgreSQL.
- NeonDB.
- Vercel.
- Jest.

### Data science

- Python.
- Pandas.
- NumPy.
- scikit-learn.
- CSV and optionally Parquet.

### Important constraints

- Use JavaScript, not TypeScript, unless explicitly requested.
- Keep the Next.js Pages Router. Do not migrate to the App Router.
- Do not introduce Express as a separate server.
- Do not introduce microservices by default.
- Do not add Redis, Kafka, MQTT infrastructure, or permanent workers without a documented requirement.
- Avoid unnecessary dependencies.
- Prefer existing project utilities and libraries when they are sufficient.
- Use exact package versions when adding npm dependencies, following the project's package-management convention.
- Do not introduce a new state-management library without a concrete need.

## 4. General engineering principles

- Prefer simple, readable, maintainable implementations.
- Keep responsibilities separated by feature and domain.
- Avoid unnecessary abstractions and premature generalization.
- Do not duplicate business rules across pages or API routes.
- Validate data at system boundaries.
- Use explicit names for variables, functions, and database fields.
- Handle errors deliberately.
- Keep functions focused.
- Avoid hidden side effects.
- Do not silently ignore failed operations.
- Preserve existing behavior unless a change is required and documented.

Before modifying a large area, inspect the relevant files and their dependencies. Do not rewrite working modules merely to impose a preferred style.

## 5. Data provenance and academic integrity

The e-commerce generator produces synthetic records. The IoT simulator produces simulated telemetry.

Never:

- Describe generated transactions as real company transactions.
- Claim simulated readings came from physical sensors.
- Fabricate validation results or model metrics.
- Claim that the application increased revenue or conversion without measured evidence.
- Present a demonstration forecast as a verified business outcome.
- Conceal the synthetic or simulated origin of data.

Use clear provenance labels in code, documentation, reports, and the interface wherever relevant.

The synthetic dataset must be reproducible and internally consistent. The IoT simulator must produce plausible, documented values rather than arbitrary unrelated numbers.

## 6. E-commerce data rules

### 6.1 Purchase journey

The funnel has five stages:

1. `VISIT`
2. `PRODUCT_VIEW`
3. `CART_ADD`
4. `CHECKOUT_START`
5. `ORDER_COMPLETED`

Count distinct visitor sessions, not raw event rows.

Each stage is counted at most once per session. Stage progression must be chronologically valid.

The main funnel is attributed to the session start date.

Do not confuse a session with an order. A session can generate more than one order.

### 6.2 Revenue

Only the following statuses contribute to recognized revenue:

- `PAID`
- `SHIPPED`
- `DELIVERED`

Exclude:

- `PENDING`
- `CANCELLED`
- `RETURNED`

Revenue is attributed to order creation date in the store timezone.

Do not count pending orders as revenue.

Do not use order count as an exact substitute for converted-session count unless session-to-order attribution supports that calculation.

### 6.3 Product performance

- Views and cart additions come from navigation events.
- Sales and product revenue come from eligible order items.
- Product queries must respect store scope and date filters.
- Stock is read-only and optional.
- Do not implement inventory movements or stock-management workflows.

### 6.4 Privacy

- Do not introduce consumer names, emails, phone numbers, or full addresses.
- Use pseudonymous visitor/customer hashes where necessary.
- Treat hashes as pseudonymous, not automatically anonymous.
- Do not expose raw visitor identifiers in the dashboard.
- Exports must not contain consumer personal information.

## 7. Authentication rules

Dashboard authentication and visitor tracking are separate domains.

Use the adapted PI-II authentication design:

- `User`
- `AuthSession`
- `PasswordResetToken`

Roles:

- `ADMIN`
- `MANAGER`
- `ANALYST`

Security requirements:

- Never store plaintext passwords.
- Store password hashes.
- Generate secure session tokens.
- Persist only hashes of session tokens.
- Enforce session expiration.
- Make password-reset tokens expiring and single-use.
- Check user activity state.
- Enforce role permissions on the server.
- Enforce store scope in protected operations.
- Do not trust client-provided store IDs or role values.

Do not copy PI-II-specific entities, relations, or role values into Merchant Pulse.

## 8. Database and Prisma rules

- Prisma is the primary ORM.
- PostgreSQL is the relational database.
- Keep schema changes in Prisma migrations.
- Do not edit production data or run destructive commands without explicit authorization.
- Do not reset a database as a routine debugging technique.
- Use separate development and test database configurations.
- Preserve referential integrity.
- Use database constraints for critical uniqueness rules.
- Add indexes based on actual query patterns.
- Use parameterized SQL for analytical queries when Prisma's ordinary query interface is insufficient.
- Never construct unsafe SQL from untrusted user input.

The initial store relationship must remain simple. Do not build subscription management, tenant provisioning, or complex SaaS isolation unless the scope changes explicitly.

## 9. Python data-science rules

Keep Python data-science code inside `data-science/`.

### 9.1 Generation

- Use a fixed random seed by default.
- Support configurable dates and volumes.
- Generate records in batches.
- Preserve referential integrity.
- Keep the event journey plausible.
- Keep order statuses and item totals consistent.
- Record generator configuration and output counts.
- Do not generate unrelated, disconnected collections merely to inflate record counts.

### 9.2 Preprocessing

Follow this sequence:

1. Ingestion.
2. Structural validation.
3. Missing-value analysis.
4. Duplicate detection.
5. Inconsistency and impossible-value checks.
6. Variable classification.
7. Transformation and feature engineering.
8. Quality validation.

Record read, accepted, rejected, corrected, and deduplicated counts.

Do not silently drop records or replace missing values without a documented rule.

### 9.3 Statistical analysis

Classify variables before selecting statistical methods.

- Nominal categories: frequencies, proportions, mode.
- Ordinal categories: frequencies and meaningful ordinal summaries.
- Quantitative interval/ratio variables: appropriate numerical summaries.
- IDs and hashes: identifiers, not continuous quantities.

Never calculate a mean or standard deviation of arbitrary numeric IDs, category codes, or nominal labels.

Use visualizations that support the analytical question. Appropriate examples include:

- Histograms and box plots.
- Scatter plots.
- Time-series charts.
- Correlation heatmaps where meaningful.
- Day/hour heatmaps.
- Multivariate comparisons.

Do not add charts only for decoration.

### 9.4 Large-data processing

- Generate and process in batches or chunks.
- Avoid unnecessary full-dataset DataFrame copies.
- Select only needed columns.
- Use appropriate dtypes.
- Consider Parquet for intermediate datasets.
- Measure representative memory and execution costs.
- Document any sampling and its limitations.

## 10. Machine-learning rules

The selected task is supervised regression for daily units sold by product category.

Main model candidate:

`HistGradientBoostingRegressor`

Baseline:

Seasonal-naive prediction using the corresponding day from the previous week.

Candidate features:

- Category.
- Day of week.
- Month.
- Weekend indicator.
- Promotion indicator.
- Sales lags of 1, 7, and 14 days.
- Rolling means of 7 and 28 days.

Critical rules:

- Do not leak future information into features.
- Generate lag and rolling features using only past observations.
- Do not randomly split time-series data.
- Use chronological training, validation, and test partitions.
- Tune using validation data only.
- Evaluate on the held-out test set.
- Compare against the baseline.
- Report MAE, RMSE, and R².
- Inspect overfitting and underfitting.
- Do not invent model performance.
- Preserve model metadata and training-data date range.

If the selected model performs worse than the baseline, report that result honestly and investigate it rather than hiding it.

## 11. IoT rules

The initial IoT context is simulated warehouse monitoring.

Measurements:

- Temperature in °C.
- Relative humidity in %.
- Energy consumption in kW.

Initial target:

- 10 devices.
- Five-minute intervals.
- 180 days.
- 518,400 readings.

The Python simulator sends telemetry to a Next.js API route over HTTP.

The ingestion endpoint must:

- Validate device identity.
- Validate timestamps.
- Validate measurement types and values.
- Reject malformed payloads.
- Prevent duplicate readings.
- Enforce payload-size limits.
- Return clear accepted/rejected results.

Store telemetry separately from navigation events.

Thresholds are configurable demonstration parameters, not certified safety limits.

## 12. API and security rules

- Validate all request bodies.
- Validate query parameters.
- Authenticate protected endpoints.
- Authorize by role.
- Enforce store scope.
- Return consistent error responses.
- Avoid exposing internal stack traces.
- Do not log credentials, raw tokens, or sensitive identifiers.
- Use secure cookie settings in production.
- Do not assume that hiding a UI element enforces permission.

## 13. Frontend rules

- Build reusable components when there is genuine reuse.
- Keep feature-specific logic grouped by feature.
- Use Recharts for analytical charts.
- Ensure filters update the displayed data.
- Keep chart labels, units, and time ranges explicit.
- Distinguish zero values from missing values.
- Provide loading, empty, and error states.
- Use responsive layouts for desktop and mobile.
- Do not present precomputed forecasts as live model execution.
- Identify synthetic and simulated data where appropriate.

The interface is intended for non-technical business users. Avoid unexplained statistical terminology in primary dashboard views; provide clear labels and supporting explanations.

## 14. Testing rules

Use Jest for JavaScript tests and Python tests for data-science workflows.

Prioritize tests for:

- Funnel stage counting.
- Session conversion semantics.
- Eligible revenue statuses.
- Average order value.
- Store scoping.
- Authentication and authorization.
- Import validation.
- Deduplication.
- IoT payload validation.
- Telemetry uniqueness.
- Data preprocessing.
- Feature generation and leakage prevention.
- Chronological data splitting.
- Model metric calculations.

Use small deterministic fixtures for unit tests. Large-volume tests should be separate performance or integration tests.

## 15. Working procedure for AI agents

Before implementing a task:

1. Read the relevant documentation.
2. Inspect the existing code.
3. Identify the affected features and dependencies.
4. Check whether the task changes data semantics or schema.
5. Propose the smallest maintainable implementation.
6. Identify migrations or environment changes.
7. Implement incrementally.
8. Add or update tests.
9. Run relevant checks.
10. Update documentation when behavior or decisions change.

Before running commands that delete data, reset databases, overwrite files, or change production resources, explain the impact and obtain explicit authorization.

Do not silently install packages or infrastructure.

## 16. Definition of done

A task is complete only when:

- The implementation satisfies its documented requirement.
- Relevant tests pass.
- Data semantics remain consistent.
- Security and store scope are respected.
- Errors are handled.
- Documentation is updated when necessary.
- No synthetic or simulated result is misrepresented as real.
- No unnecessary infrastructure or dependencies have been introduced.

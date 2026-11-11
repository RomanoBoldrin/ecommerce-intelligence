# Merchant Pulse — Development Roadmap

**Version:** 0.3  
**Approach:** Incremental implementation  
**Architecture:** Modular monolith with a separate Python data-science workspace

## 1. Roadmap principles

The implementation should follow the dependency order of the project rather than beginning with dashboard screens.

The most important dependencies are:

- A stable relational model before large-scale ingestion.
- A reproducible dataset before analytical validation.
- Correct metric definitions before chart implementation.
- Validated features before model training.
- A working ingestion path before IoT visualization.
- Documented model outputs before dashboard integration.

Each phase should produce a verifiable result before the next phase introduces additional complexity.

## 2. Phase overview

| Phase | Focus                       | Main deliverable                         |
| ----- | --------------------------- | ---------------------------------------- |
| 1     | Foundation                  | Repository and development environment   |
| 2     | Data model                  | Prisma schema and migrations             |
| 3     | E-commerce generator        | Reproducible synthetic dataset           |
| 4     | IoT simulator               | Simulated telemetry dataset              |
| 5     | Ingestion and preprocessing | Validated data pipeline                  |
| 6     | Statistical analysis        | Exploratory analysis and quality reports |
| 7     | Machine learning            | Evaluated demand-forecasting model       |
| 8     | Application foundation      | Authentication, API, and dashboard shell |
| 9     | Analytics modules           | Interactive e-commerce dashboard         |
| 10    | IoT and forecasting UI      | Interactive analytical modules           |
| 11    | Validation and delivery     | Tests, deployment, and academic evidence |

## 3. Phase 1 — Repository and development foundation

### Objectives

Establish a clean development environment and project organization.

### Tasks

- Create or review the GitHub repository.
- Establish the Next.js Pages Router application.
- Configure JavaScript and Tailwind CSS.
- Configure Prisma.
- Connect the development PostgreSQL database.
- Configure the test database.
- Configure Jest.
- Create the Python data-science workspace.
- Add the initial documentation structure.
- Configure environment variables and `.gitignore`.
- Verify local development and build commands.

### Deliverables

- Working Next.js application.
- Working PostgreSQL connection.
- Prisma initialized.
- Jest initialized.
- Python workspace initialized.
- Repository documentation committed.

### Completion criteria

The application can run locally, connect to the development database, execute a basic test, and build successfully.

## 4. Phase 2 — Relational data model

### Objectives

Implement the core database structure before generating large datasets.

### Tasks

- Define `User`.
- Define `AuthSession`.
- Define `PasswordResetToken`.
- Define `Category`.
- Define `Product`.
- Define `VisitorSession`.
- Define `NavigationEvent`.
- Define `Order`.
- Define `OrderItem`.
- Define `DataSource`.
- Define `DataImport`.
- Define `IoTDevice`.
- Define `IoTReading`.
- Define `IndicatorTarget`.
- Define `Recommendation`.
- Define enums and indexes.
- Define uniqueness and referential-integrity constraints.
- Create and test Prisma migrations.

### Important decisions

- Visitor sessions and authentication sessions must remain separate.
- The application is single-store; there is no `Store` model.
- Revenue eligibility is defined by order status.
- Stock information is optional and read-only.
- IoT telemetry remains separate from e-commerce navigation events.

### Deliverables

- Prisma schema.
- Database migrations.
- Seed for the dashboard administrator.
- Model-level tests or validation scripts.

### Completion criteria

All core entities can be created and queried. Relationships, uniqueness constraints, and authentication-domain separation are verified.

## 5. Phase 3 — E-commerce synthetic data generator

### Objectives

Create a reproducible dataset with sufficient scale and realistic internal relationships.

### Tasks

- Define generator configuration.
- Implement category and product generation.
- Implement visitor-session generation.
- Implement navigation-event sequences.
- Implement order and order-item generation.
- Add device and traffic-source distributions.
- Add promotion and seasonal effects.
- Add configurable dates and volume.
- Add a fixed random seed.
- Implement batch generation.
- Write output to CSV and optionally Parquet.
- Validate referential integrity and business consistency.
- Benchmark generation time and memory use.

### Initial target

- Approximately two years of activity.
- 100–200 products.
- 300,000–500,000 sessions.
- 2–5 million navigation events.
- 50,000–100,000 orders.

These are indicative targets. The generator must preserve plausible relationships and must not force unrelated record counts.

### Deliverables

- `ecommerce_generator.py`.
- `generation_config.py`.
- Documented generator parameters.
- Reproducible dataset files.
- Generation summary and consistency report.

### Completion criteria

The same seed and configuration produce reproducible output. Generated sessions, events, orders, and items are internally consistent.

## 6. Phase 4 — IoT simulator

### Objectives

Implement the software-based IoT component required by the project.

### Tasks

- Define simulated device configuration.
- Generate device identities.
- Generate timestamped temperature readings.
- Generate timestamped humidity readings.
- Generate timestamped energy readings.
- Introduce plausible variation and occasional abnormal readings.
- Support configurable simulation periods and intervals.
- Add batch output.
- Validate measurement ranges and timestamps.
- Benchmark generation and storage volume.

### Initial configuration

- 10 devices.
- One reading every five minutes.
- 180 days.
- 518,400 readings.

### Deliverables

- `warehouse_iot_simulator.py`.
- `telemetry_config.py`.
- Simulated telemetry dataset.
- Device and measurement documentation.
- Simulation summary.

### Completion criteria

The simulator produces reproducible, timestamped readings associated with valid device identities. The output is explicitly labeled simulated.

## 7. Phase 5 — Ingestion and preprocessing pipeline

### Objectives

Implement reliable data validation, cleaning, deduplication, and persistence.

### Tasks

- Define import contracts.
- Validate file structure and required fields.
- Validate data types.
- Inspect missing values.
- Define missing-value treatment rules.
- Detect duplicates.
- Detect inconsistent and impossible values.
- Implement stable deduplication.
- Record import and preprocessing statistics.
- Load validated records into PostgreSQL in batches.
- Make imports idempotent.
- Add error and quality reports.
- Implement the HTTP telemetry ingestion API.
- Validate and persist IoT batches.

### Required processing report

Every processing run should record:

- Records read.
- Records accepted.
- Records rejected.
- Records corrected.
- Duplicates removed.
- Errors and warnings.

### Deliverables

- Python preprocessing modules.
- Import validation.
- Data-quality reports.
- E-commerce ingestion.
- IoT ingestion API.
- Deduplication and idempotency tests.

### Completion criteria

Invalid data is handled according to documented rules. Valid records are persisted without duplicate creation on re-import. Processing results are traceable.

## 8. Phase 6 — Statistical and exploratory analysis

### Objectives

Demonstrate rigorous analysis of the generated datasets.

### Tasks

- Classify variables by measurement scale.
- Analyze categorical distributions.
- Analyze quantitative distributions.
- Identify missingness and anomalies.
- Analyze navigation behavior.
- Analyze funnel progression.
- Analyze sales and product performance.
- Analyze seasonal and temporal patterns.
- Analyze IoT measurements and abnormal readings.
- Generate relevant visualizations.
- Document processing and analytical limitations.

### Required statistical discipline

Nominal variables must use frequency-based summaries rather than numerical averages.

Examples of appropriate analyses:

- Frequency tables for category and traffic source.
- Histograms and box plots for quantitative variables.
- Time-series plots for sales and telemetry.
- Day/hour heatmaps for navigation.
- Scatter plots for relationships between quantitative variables.
- Correlation analysis only where variable types and assumptions justify it.

### Deliverables

- Reproducible analysis scripts or notebooks.
- Statistical summaries.
- Visualization outputs.
- Variable-classification documentation.
- Data-quality and anomaly reports.

### Completion criteria

Analyses can be reproduced and are supported by appropriate statistical methods. Sampling, if used, is justified and documented.

## 9. Phase 7 — Demand-forecasting model

### Objectives

Implement and evaluate a supervised machine-learning model.

### Tasks

- Aggregate eligible order items into daily category sales.
- Build calendar features.
- Build lag features.
- Build rolling features.
- Check for leakage.
- Create chronological training, validation, and test partitions.
- Implement seasonal-naive baseline.
- Train `HistGradientBoostingRegressor`.
- Tune model parameters using validation data.
- Evaluate using MAE, RMSE, and R².
- Compare against the baseline.
- Inspect overfitting and underfitting.
- Persist model artifacts and metadata.
- Generate documented forecast outputs.

### Initial split

- 70% training.
- 15% validation.
- 15% test.

### Deliverables

- Feature-engineering module.
- Baseline model.
- Trained model.
- Evaluation report.
- Model metadata.
- Forecast output suitable for application integration.

### Completion criteria

The model has been evaluated chronologically, compared with the baseline, and documented honestly. No test-set leakage is present.

If the model does not outperform the baseline, that result must be documented and investigated.

## 10. Phase 8 — Application foundation

### Objectives

Establish the application shell and secure dashboard access.

### Tasks

- Implement the main layout.
- Implement navigation.
- Implement login and logout.
- Implement user retrieval and session validation.
- Implement password hashing.
- Implement hashed-token sessions.
- Implement password-reset token handling.
- Implement role-based authorization.
- Enforce role permissions in protected queries.
- Implement common API validation and error handling.
- Add initial dashboard components.
- Add global date and category filter foundations.

### Roles

- ADMIN.
- MANAGER.
- ANALYST.

Administrative settings are initially restricted to ADMIN.

### Deliverables

- Authentication flow.
- Authorization helpers.
- Protected API routes.
- Dashboard layout.
- Navigation and shared filters.
- Authentication and permission tests.

### Completion criteria

Dashboard users can authenticate securely. Protected operations enforce role permissions server-side.

## 11. Phase 9 — E-commerce analytics modules

### Objectives

Implement the main business dashboard.

### Implementation order

1. Overview.
2. Sales Funnel.
3. Products & Performance.
4. Product Detail.
5. Customer Behavior.
6. Data Sources & Pipeline.
7. Settings.

### Tasks

- Centralize metric definitions.
- Implement date and category filtering.
- Implement session-based funnel aggregation.
- Implement eligible-revenue calculations.
- Implement daily sales and traffic trends.
- Implement product and category rankings.
- Implement navigation behavior analysis.
- Implement import and quality-report screens.
- Implement rule-based recommendations.
- Implement CSV and PDF exports.
- Ensure export filters match the visible dashboard filters.

### Deliverables

A functional interactive e-commerce dashboard with consistent calculations and useful visualizations.

### Completion criteria

Filters change the displayed results. Funnel and revenue calculations match their documented semantics. Exports respect the selected filters and exclude consumer personal information.

## 12. Phase 10 — IoT Monitoring and Demand Forecasting modules

### Objectives

Expose the IoT and machine-learning outputs through the web interface.

### IoT Monitoring tasks

- Implement device selection.
- Display latest measurements.
- Display temperature time series.
- Display humidity time series.
- Display energy time series.
- Implement date-range filtering.
- Implement device comparisons.
- Display abnormal readings.
- Display measurement units and simulation provenance.

### Demand Forecasting tasks

- Implement category selection.
- Implement forecast-horizon selection.
- Display historical sales.
- Display forecast values.
- Display model evaluation metrics.
- Display baseline comparison.
- Display training-data cutoff and model version.
- Clearly distinguish actual observations from predicted values.

### Deliverables

- Interactive IoT Monitoring module.
- Interactive Demand Forecasting module.
- API integration for stored telemetry and forecast outputs.
- Tests for filters and data interpretation.

### Completion criteria

Both modules display validated data and clearly identify simulated or predicted values. The interface does not claim real-time behavior where only stored outputs are available.

## 13. Phase 11 — Testing, validation, and delivery

### Objectives

Validate the complete application and prepare the academic demonstration.

### Technical tests

- Unit tests for business calculations.
- API tests.
- Authentication and authorization tests.
- Database integrity tests.
- Import and deduplication tests.
- Python preprocessing tests.
- Generator consistency tests.
- IoT ingestion tests.
- ML feature and leakage tests.
- Model evaluation tests.
- Representative performance tests.

### Performance validation

Measure representative workloads:

- E-commerce generation.
- Large-file preprocessing.
- Database ingestion.
- Funnel aggregation.
- Product-performance queries.
- IoT ingestion.
- Time-series queries.

Record data volume, execution time, and memory use where relevant.

### User validation

Use the project report's validation approach with the partner's manager.

Possible evaluation tasks:

- Select an analytical period.
- Identify the number of eligible orders.
- Locate the funnel stage with the greatest proportional loss.
- Identify a product or category with high interest and low conversion.
- Interpret a demand forecast.
- Locate abnormal IoT readings.
- Explain whether the dashboard supports a business decision.

Record actual feedback and scores. Do not invent evaluation outcomes.

### Deployment

- Configure production environment variables.
- Apply reviewed database migrations.
- Deploy the Next.js application to Vercel.
- Configure NeonDB production access.
- Verify authentication and protected routes.
- Verify dashboard filters and exports.
- Verify IoT ingestion.
- Verify forecast output availability.
- Document deployment limitations.

### Academic documentation

The final report should accurately describe:

- The project problem and objectives.
- The four-layer conceptual architecture.
- The e-commerce dataset's synthetic provenance.
- The IoT simulator and its simulated provenance.
- The preprocessing methodology.
- Variable classification and statistical methods.
- The machine-learning task and evaluation.
- The implemented interface modules.
- Technical and analytical limitations.
- Actual validation evidence.

### Completion criteria

The application is deployed and demonstrable. The technical implementation, model evaluation, and academic report are consistent with each other.

## 14. Priority guidance

If time becomes constrained, preserve the following order:

1. Correct data model and data semantics.
2. Reproducible e-commerce and IoT data generation.
3. Validated ingestion and preprocessing.
4. Statistically correct analysis.
5. A genuinely evaluated machine-learning model.
6. Working interactive dashboard.
7. IoT and forecasting visualizations.
8. Additional polish and optional features.

Do not sacrifice data correctness or model evaluation to add decorative interface features.

## 15. Deferred improvements

The following are not part of the initial implementation unless a concrete requirement emerges:

- Physical IoT sensors.
- MQTT brokers.
- Kafka or other event-streaming platforms.
- Redis.
- Permanent background workers.
- Microservices.
- A separate Python inference API.
- Complex multi-tenant SaaS infrastructure.
- Inventory management.
- Automated marketing messages.
- Real-time model retraining.
- Advanced model ensembles.

These may be reconsidered after the core project is complete and measured requirements justify them.

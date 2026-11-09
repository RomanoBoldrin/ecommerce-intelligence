# Merchant Pulse — Implementation Roadmap

**Version:** 0.2

## Guiding Principle

Do not begin full implementation until the most important dataset, data-model, IoT, and machine-learning decisions have been resolved.

The project must be developed in an order that produces a demonstrable end-to-end pipeline rather than a collection of disconnected screens.

## Phase 0 — Requirements and Research

### Tasks

- Review the PI-IV academic report.
- Review the project specification and architecture.
- Select candidate e-commerce datasets.
- Evaluate dataset provenance, licensing, variables, size, and time coverage.
- Select candidate IoT datasets or define a simulator.
- Define the intended machine-learning problem.
- Resolve session and order attribution semantics.
- Define initial store and role permissions.

### Deliverables

- Finalized requirements.
- Dataset evaluation document.
- Initial data dictionary.
- IoT acquisition specification.
- Machine-learning problem statement.
- Approved data-model decisions.

### Completion criteria

The team can explain what data will be processed, why it is appropriate, how IoT will be ingested, and what the ML model is intended to predict or discover.

## Phase 1 — Repository and Development Foundation

### Tasks

- Initialize the Next.js Pages Router application.
- Configure JavaScript.
- Configure Tailwind CSS.
- Configure Prisma.
- Connect PostgreSQL/NeonDB.
- Configure Jest.
- Configure environment files.
- Establish Git conventions.
- Create the Python data-science workspace.
- Document Node.js and Python setup.

### Deliverables

- Working application shell.
- Database connection.
- Test setup.
- Python environment.
- Initial repository documentation.

### Completion criteria

The web application runs locally, database connectivity works, and JavaScript and Python test workflows can execute.

## Phase 2 — Database Design and Authentication

### Tasks

- Convert the approved relational model into Prisma.
- Define enums and constraints.
- Implement Store, User, AuthSession, and PasswordResetToken.
- Implement Category and Product.
- Implement DataSource and ImportJob.
- Implement VisitorSession, Event, Order, and OrderItem.
- Implement initial IoT entities.
- Implement Recommendation and IndicatorTarget.
- Add experiment metadata if needed.
- Create and validate migrations.
- Implement authentication and role-based access.
- Test store-level access isolation.

### Deliverables

- Prisma schema.
- Database migrations.
- Authentication module.
- Initial database tests.

### Completion criteria

The schema represents the approved model and the application can securely authenticate dashboard users.

## Phase 3 — Dataset Acquisition and Data Dictionary

### Tasks

- Obtain the selected e-commerce dataset.
- Obtain or generate the IoT dataset.
- Record provenance and licensing.
- Document dataset volume, format, variables, and time coverage.
- Classify variables by measurement scale.
- Define raw, interim, processed, and feature dataset conventions.
- Define quality rules.
- Establish representative test fixtures.

### Deliverables

- Dataset documentation.
- Data dictionary.
- Variable classification.
- Data-quality specification.
- Reproducible acquisition instructions.

### Completion criteria

The team can reproduce dataset acquisition and explain the semantics and measurement scale of each relevant variable.

## Phase 4 — Data Ingestion and Preprocessing

### Tasks

- Implement CSV parsing.
- Implement source schema validation.
- Implement type conversion.
- Normalize categories, timestamps, and units.
- Handle missing and invalid values.
- Detect duplicates.
- Define rejection and quarantine behavior.
- Implement idempotent ingestion.
- Persist valid records in bounded batches.
- Record import history and quality statistics.
- Implement Python chunk processing or incremental reading where justified.
- Record processing time and memory considerations where relevant.

### Deliverables

- E-commerce ingestion pipeline.
- IoT ingestion pipeline.
- Preprocessing scripts.
- Import history.
- Data-quality report.

### Completion criteria

The pipeline can process the selected data reproducibly, explain rejected records, and demonstrate its strategy for handling the chosen data volume.

## Phase 5 — Exploratory and Statistical Analysis

### Tasks

- Analyze distributions and missingness.
- Evaluate duplicates and outliers.
- Calculate descriptive statistics using valid measurement scales.
- Analyze temporal patterns.
- Analyze customer and product behavior.
- Analyze telemetry trends.
- Produce correlation and multivariate analysis where appropriate.
- Document limitations and potential bias.

### Deliverables

- Exploratory analysis notebooks.
- Repeatable analysis scripts.
- Statistical findings.
- Visualizations for academic evidence.

### Completion criteria

The team can explain the dataset's structure, quality, important patterns, and the statistical methods used.

## Phase 6 — Machine-Learning Modeling

### Tasks

- Finalize the ML problem and target.
- Define the observation unit and prediction horizon.
- Prepare features.
- Prevent target leakage.
- Establish a baseline.
- Split training, validation, and test data appropriately.
- Train candidate models.
- Compare generalization performance.
- Investigate overfitting and underfitting.
- Select appropriate evaluation metrics.
- Record model configuration and results.
- Save reproducible model artifacts.

### Deliverables

- ML problem specification.
- Training and evaluation scripts.
- Baseline results.
- Final model and evaluation report.
- Versioned experiment metadata.

### Completion criteria

At least one model has been trained and evaluated with a defensible methodology and documented limitations.

## Phase 7 — Analytics Engine

### Tasks

- Implement centralized KPI calculations.
- Implement session-based funnel calculations.
- Implement order and revenue calculations.
- Implement product/category aggregations.
- Implement customer behavior aggregations.
- Implement IoT aggregations.
- Implement rule-based recommendations.
- Implement indicator-target comparisons.
- Test calculations against known fixtures.

### Deliverables

- Analytics services.
- Recommendation engine.
- Tested database queries.
- Documented metric definitions.

### Completion criteria

The application returns consistent analytical results with explicit date, store, and attribution semantics.

## Phase 8 — Interactive Dashboard

### Tasks

- Implement global application layout.
- Implement login and role-aware navigation.
- Implement Overview.
- Implement Sales Funnel.
- Implement Products & Stock Indicators.
- Implement Product Details.
- Implement Customer Behavior.
- Implement IoT Analytics.
- Implement Machine Learning.
- Implement Settings.
- Add global store and date filters.
- Add category and page-specific filters.
- Add CSV export.
- Add PDF export if time permits.
- Implement loading, empty, and error states.

### Deliverables

- Functional interactive dashboard.
- Dynamic charts.
- Filtered analytics.
- Model and telemetry visualization.

### Completion criteria

An evaluator can interact with the application, change filters, select sources or devices, and observe updated results rather than static outputs.

## Phase 9 — Recommendations, Validation, and Performance

### Tasks

- Validate recommendations against indicator targets.
- Validate dashboard results against independent calculations.
- Test role permissions.
- Test store isolation.
- Test import retries and duplicates.
- Evaluate query performance with representative data volume.
- Evaluate large-scale processing behavior.
- Review visualizations and accessibility.
- Validate the complete pipeline from source to interface.
- Conduct a demonstration using realistic data.

### Deliverables

- Test reports.
- Validation evidence.
- Performance observations.
- End-to-end demonstration dataset.

### Completion criteria

The team can demonstrate the complete system and provide evidence that its outputs are correct and its data processing is reproducible.

## Phase 10 — Deployment and Academic Documentation

### Tasks

- Deploy the Next.js application to Vercel.
- Configure NeonDB production connection.
- Configure environment variables.
- Define how Python processing and model artifacts are executed and accessed.
- Prepare a reproducible demonstration.
- Document architecture and data flow.
- Document preprocessing decisions.
- Document statistical analysis.
- Document IoT ingestion.
- Document ML methodology and metrics.
- Document dashboard functionality.
- Record limitations and future work.
- Prepare final academic presentation and report.

### Deliverables

- Deployed application.
- Reproducibility instructions.
- Final technical documentation.
- Academic evidence and presentation.

### Completion criteria

The final submission demonstrates the mandatory academic requirements and provides a working interactive application.

## Priority Guidance

The most important risk is postponing data and methodology decisions until after the dashboard has been built.

Prioritize:

1. Dataset selection and scale.
2. Variable classification and data-quality rules.
3. IoT data acquisition.
4. ML problem definition.
5. Data model and metric semantics.
6. Ingestion and preprocessing.
7. Analytics.
8. Interactive dashboard.
9. Validation and academic evidence.

Do not spend disproportionate time polishing dashboard screens before confirming that the underlying data pipeline and analytical methods are valid.

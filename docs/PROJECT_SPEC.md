# Merchant Pulse — Project Specification

**Version:** 0.2  
**Project:** Projeto Integrador IV — UNIVESP

## 1. Purpose

Merchant Pulse is an e-commerce intelligence application that processes large-scale e-commerce and IoT data, performs statistical and machine-learning analysis, and presents the resulting information through an interactive web interface.

The application supports business decisions by identifying customer behavior patterns, sales-funnel losses, product performance, and relevant operational indicators.

## 2. Academic Requirements

The following requirements are mandatory for the project.

### AR01 — End-to-end data pipeline

Demonstrate the complete flow:

1. Data acquisition.
2. Data ingestion.
3. Data validation.
4. Data cleaning and preprocessing.
5. Data transformation and feature preparation.
6. Storage and analytical processing.
7. Statistical analysis.
8. Machine-learning modeling.
9. Interactive visualization.

The pipeline must be documented and reproducible.

### AR02 — Data at scale

Use datasets with sufficient volume and complexity to demonstrate large-scale data handling.

Requirements:

- Document dataset origin and characteristics.
- Record the number of records, variables, and relevant time coverage.
- Explain why the selected data is appropriate for the analytical objective.
- Document memory and processing constraints.
- Use chunk processing, sampling, or incremental processing when justified.
- Distinguish the complete dataset from any sampled or reduced dataset used in experiments.

Do not claim that a dataset is large-scale merely because it contains many artificially duplicated rows. Generated data must represent plausible events or telemetry.

The final dataset and volume target remain to be selected.

### AR03 — Methodical preprocessing

The project must document each preprocessing step, including:

- Missing values.
- Duplicate records.
- Invalid or corrupted records.
- Inconsistent categories and labels.
- Incorrect timestamps and time zones.
- Invalid numeric values.
- Outliers and their treatment.
- Data type conversion.
- Normalization and transformation.
- Data validation after cleaning.

Every transformation must have a documented reason. Do not remove outliers or missing values automatically without evaluating their meaning.

### AR04 — Variable classification

Before statistical analysis or machine learning, classify variables according to their measurement scale.

| Variable type | Subtype    | Examples                                     | Valid treatment                            |
| ------------- | ---------- | -------------------------------------------- | ------------------------------------------ |
| Qualitative   | Nominal    | Device, traffic source, category, event type | Frequency, proportions, mode               |
| Qualitative   | Ordinal    | Priority, rating level, ordered status       | Frequency, proportions, ordinal methods    |
| Quantitative  | Discrete   | Number of sessions, orders, items            | Mean, median, variance, standard deviation |
| Quantitative  | Continuous | Revenue, duration, sensor measurement        | Mean, median, variance, standard deviation |

Use the correct measurement scale. A nominal category represented by an integer code does not become quantitative.

Examples of invalid operations:

- Calculating the mean of product IDs.
- Calculating the standard deviation of device codes.
- Treating encoded traffic-source categories as continuous measurements.

For qualitative variables, use frequency distributions, proportions, and mode where appropriate. For ordinal variables, preserve their ordering and select methods accordingly.

### AR05 — Machine learning

At least one machine-learning model must be implemented and evaluated.

The project must:

- Define an analytical problem and target variable.
- Explain why the selected algorithm is appropriate.
- Document features and preprocessing.
- Separate training and evaluation data.
- Prevent data leakage.
- Evaluate generalization.
- Investigate overfitting and underfitting.
- Compare against a simple baseline.
- Report suitable performance metrics.
- Document limitations and interpretation.

The exact model and target remain open until the dataset is selected.

For regression, appropriate metrics include:

- MAE — Mean Absolute Error.
- RMSE — Root Mean Squared Error.
- Optionally R².

For classification, appropriate metrics include:

- Precision.
- Recall.
- F1-score.
- Confusion matrix.
- ROC-AUC or PR-AUC when appropriate.

RMSE and MAE are not universal metrics; they must not be used as substitutes for classification evaluation.

### AR06 — IoT data acquisition

The project must ingest IoT data through at least one of the following:

- A software-based telemetry simulator.
- A suitable public IoT dataset.

The IoT data source must be independent of e-commerce navigation events and orders.

The implementation must document:

- The simulated device or data source.
- Measurement types and units.
- Timestamp semantics.
- Acquisition frequency or generation strategy.
- Payload structure.
- Validation and quality checks.
- Storage strategy.
- Analytical purpose.

A chart containing manually fabricated values is not sufficient evidence of IoT ingestion.

### AR07 — Interactive software interface

The project must provide an executable, interactive application.

The Next.js web application is the primary GUI.

Users must be able to interact with the data, for example by:

- Selecting a store.
- Changing date ranges.
- Filtering by product category.
- Selecting a device or telemetry source.
- Adjusting a model parameter where appropriate.
- Viewing charts that update based on selected filters.
- Inspecting model evaluation results.
- Obtaining predictions through an implemented model workflow.

Static PDFs, slides, or notebook outputs alone are not acceptable as the final interface.

The dashboard should include multivariate visualizations where appropriate, such as:

- Box plots.
- Scatter plots.
- Heatmaps.
- Time-series comparisons.
- Correlation visualizations.
- Other justified multivariate plots.

## 3. Functional Requirements

### Authentication and access

- **FR01:** Users must authenticate before accessing the dashboard.
- **FR02:** The application must support role-based access.
- **FR03:** Administrative configuration must be restricted to authorized administrators.
- **FR04:** Authentication sessions and password-reset tokens must be stored securely.

Initial roles:

- `ADMIN`
- `MANAGER`
- `ANALYST`

The exact permissions for each role must be documented before implementation. The initial proposal restricts store, user, data-source, and target configuration to `ADMIN`.

### Stores and product catalog

- **FR05:** The system must support multiple stores in its data model.
- **FR06:** Products must belong to a store and may belong to a category.
- **FR07:** Product performance must be analyzable by store, category, and period.
- **FR08:** Product stock quantity and minimum-stock threshold may be displayed as indicators and used for alerts.
- **FR09:** The system must not become a full inventory-management application.

### Data sources and ingestion

- **FR10:** Users with appropriate permissions must be able to register or manage data sources.
- **FR11:** The system must support CSV imports.
- **FR12:** Import execution and results must be recorded.
- **FR13:** Imports must report read, valid, and rejected row counts.
- **FR14:** Data must be validated, normalized, and deduplicated before persistence.
- **FR15:** The system must support synthetic data for development and demonstration.
- **FR16:** IoT telemetry must be ingested independently.

### E-commerce analytics

- **FR17:** The Overview page must display key performance indicators.
- **FR18:** The Sales Funnel page must display five journey stages.
- **FR19:** Funnel counts must use distinct visitor sessions reaching each stage, not raw event counts.
- **FR20:** Product analytics must display views, cart additions, orders, revenue, and conversion indicators.
- **FR21:** Customer behavior analytics must display time, device, and traffic-source patterns.
- **FR22:** The system must support period and category filters.
- **FR23:** Comparisons must use clearly defined and consistent date intervals.

### Business recommendations

- **FR24:** The system must generate rule-based recommendations from defined business conditions.
- **FR25:** Recommendations must include a title, explanation, priority, and relevant store or product.
- **FR26:** Recommendations must be traceable to the metric or target that triggered them.
- **FR27:** Users must be able to distinguish rule-based recommendations from machine-learning predictions.

### IoT and machine learning

- **FR28:** The system must store timestamped IoT measurements with source/device identification.
- **FR29:** The system must provide telemetry analysis and interactive visualizations.
- **FR30:** The project must implement and evaluate at least one machine-learning model.
- **FR31:** Model results must include the selected algorithm, target, evaluation method, and performance metrics.
- **FR32:** Where supported by the chosen model, the dashboard must expose interactive predictions or parameterized analysis.

### Export and configuration

- **FR33:** Users must be able to export relevant dashboard data to CSV.
- **FR34:** PDF export may be implemented for reporting, but it cannot replace the interactive application.
- **FR35:** Administrators must be able to configure stores, users, data sources, and indicator targets.

## 4. Business Metrics

The following metrics are proposed for the e-commerce dashboard.

| Metric               | Proposed definition                                      |
| -------------------- | -------------------------------------------------------- |
| Visits               | Distinct visitor sessions in the selected cohort         |
| Product views        | Distinct sessions with at least one product-view event   |
| Cart additions       | Distinct sessions with at least one add-to-cart event    |
| Checkout starts      | Distinct sessions with at least one checkout-start event |
| Conversion rate      | Converted sessions / eligible sessions                   |
| Checkout abandonment | 1 − converted checkouts / initiated checkouts            |
| Average order value  | Eligible order revenue / eligible order count            |
| Product conversion   | Product-attributed orders / product-viewing sessions     |

The final definitions must specify attribution, time windows, denominator eligibility, and treatment of multiple orders or events.

## 5. Proposed Sales Funnel

The funnel has five stages:

1. Visit.
2. Product view.
3. Add to cart.
4. Checkout started.
5. Purchase completed.

A visit is represented by a visitor session. It does not need to be duplicated as an event if session creation already represents the visit.

A session counts once at each stage, regardless of how many repeated events it generated.

The funnel should be monotonic when stages are defined as cumulative session reach. If a query produces a later stage count greater than an earlier stage count, investigate the data or attribution logic rather than hiding the discrepancy.

## 6. Revenue Rules

The proposed order statuses are:

- `PENDING`
- `PAID`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`
- `RETURNED`

For revenue and average order value, the proposed eligible statuses are `PAID`, `SHIPPED`, and `DELIVERED`.

`PENDING`, `CANCELLED`, and `RETURNED` must not automatically contribute to recognized revenue.

The exact policy for partial returns, discounts, shipping, and taxes remains to be finalized. The order model should preserve the individual monetary components so that the analytical calculation can be explicit.

## 7. Privacy Requirements

- Do not ingest consumer direct identifiers.
- Use pseudonymous session and customer identifiers where necessary.
- Do not treat SHA-256 hashes as fully anonymous data.
- Protect any keyed-hash secret.
- Keep dashboard-user authentication separate from visitor tracking.
- Restrict geographic information to state-level granularity when used.
- Do not store credentials or API secrets in plain-text configuration JSON.

## 8. Non-Functional Requirements

- Maintainable modular architecture.
- Reproducible data-processing scripts.
- Deterministic preprocessing where feasible.
- Traceable import errors.
- Consistent timezone handling.
- Parameterized database queries.
- Appropriate database indexes.
- Automated tests for core calculations and transformations.
- Separate development, test, and production environments.
- No production database reset or destructive operation as part of routine testing.
- Responsive and accessible dashboard controls.
- No claims of causation based solely on observational correlations.

## 9. Acceptance Criteria

The project is ready for final academic evaluation when it can demonstrate:

1. A documented dataset with meaningful volume and complexity.
2. A reproducible end-to-end pipeline.
3. Preprocessing with documented quality decisions.
4. A variable-classification inventory and statistically valid analysis.
5. At least one trained and evaluated machine-learning model.
6. Evidence of generalization checks and baseline comparison.
7. Independent IoT data ingestion and analysis.
8. A functional interactive web application.
9. Dynamic filtering and advanced visualizations.
10. Traceable business recommendations.
11. Documented limitations, results, and methodology.

## 10. Open Decisions

The following must be resolved before implementation:

- Final e-commerce dataset and its licensing/provenance.
- Final dataset size and scale demonstration.
- IoT source, measurement types, units, and acquisition frequency.
- Machine-learning target, algorithm, and evaluation protocol.
- Event attribution and sessionization rules.
- Revenue treatment for partial returns, taxes, shipping, and discounts.
- Import deduplication keys and update behavior.
- Store access and role-permission rules.
- Whether the dashboard will persist model predictions or calculate them on demand.

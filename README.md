# Merchant Pulse

**E-commerce Intelligence Dashboard for Small Businesses**

> Version 0.3 — Project documentation and implementation baseline

Merchant Pulse is a data analytics application designed to help small e-commerce businesses understand their customers' purchase journeys, identify conversion bottlenecks, monitor operational conditions, and make more informed decisions.

The application consolidates e-commerce navigation and sales data into an interactive dashboard. It also includes a simulated IoT telemetry pipeline and a machine-learning module for product-category demand forecasting.

## Project objectives

The project aims to:

- Consolidate e-commerce navigation events, products, and orders into an analytical data structure.
- Present the five main stages of the purchase journey: store visit, product view, cart addition, checkout initiation, and completed order.
- Calculate meaningful indicators such as conversion, checkout abandonment, revenue, and average order value.
- Identify product and category performance patterns.
- Apply reproducible data preprocessing and exploratory statistical analysis.
- Train and evaluate a supervised machine-learning model for demand forecasting.
- Ingest and analyze simulated IoT telemetry.
- Provide an interactive web interface suitable for non-technical business users.

## Project scope

Merchant Pulse is an **analytics and decision-support application**, not an e-commerce platform.

It does not replace the partner's sales platform, process payments, manage orders operationally, or provide inventory management.

The initial demonstration uses one store. The underlying data model retains a simple store relationship so the application can represent additional stores without introducing a complex SaaS or multi-tenant architecture.

### Main application modules

| Module                  | Purpose                                                                     |
| ----------------------- | --------------------------------------------------------------------------- |
| Overview                | Main business indicators, trends, funnel summary, and recommendations       |
| Sales Funnel            | Five-stage purchase journey and conversion losses                           |
| Products & Performance  | Product and category performance, with optional read-only stock information |
| Product Detail          | Detailed navigation and sales indicators for a selected product             |
| Customer Behavior       | Navigation patterns by day, hour, device, and traffic source                |
| Data Sources & Pipeline | Data imports, processing status, and data-quality reports                   |
| IoT Monitoring          | Warehouse temperature, humidity, and energy telemetry                       |
| Demand Forecasting      | Category-level daily demand predictions and model evaluation                |
| Settings                | Store configuration, dashboard users, targets, and data-source settings     |

Global filters include date range and product category where applicable. Exports must respect the active filters and must not expose consumer personal information.

## Data strategy

### E-commerce data

The initial dataset is generated programmatically using Python. It represents a coherent, simulated e-commerce operation and is intended for reproducible development, analysis, testing, and demonstration.

The generator should produce related records for:

- Products and categories
- Visitor sessions
- Navigation events
- Orders and order items
- Devices and traffic sources
- Promotions and seasonal demand patterns

The initial planning target is approximately two years of activity, with indicative volumes of:

- 300,000–500,000 visitor sessions
- 2–5 million navigation events
- 50,000–100,000 orders
- 100–200 products

These are engineering targets, not guaranteed record counts. Final volumes must remain internally consistent and should be adjusted after performance benchmarking.

The generator must use a fixed random seed by default, support configurable generation parameters, preserve relationships between records, and write data in batches.

**Data provenance:** generated e-commerce records are synthetic. They must not be described as real transactions or as data collected from the partner company.

### IoT telemetry

The project uses a software simulator for warehouse environmental and operational monitoring. No physical sensor is required.

The initial simulation covers:

- Temperature, in degrees Celsius
- Relative humidity, in percent
- Energy consumption, in kilowatts

The baseline configuration is 10 simulated devices, one reading every five minutes, over 180 days:

\[
10 \times 12 \times 24 \times 180 = 518{,}400
\]

This provides a substantial telemetry dataset while keeping the first implementation manageable. The simulator must generate timestamps, device identifiers, plausible variations, and occasional abnormal readings.

**Data provenance:** IoT readings are simulated and do not represent measurements from a physical warehouse.

## Machine learning

Machine learning is part of the project's analytical scope.

The selected task is **supervised regression for daily demand forecasting by product category**.

The target is the number of units sold in a category on a given day. The model will use historical sales and calendar information to forecast future demand.

The proposed main model is `HistGradientBoostingRegressor` from scikit-learn. Its results must be compared with a seasonal-naive baseline that uses the corresponding day from the previous week.

Evaluation uses a chronological training, validation, and test split, with MAE, RMSE, and R². Model performance must be interpreted alongside the baseline and checked for overfitting and underfitting.

Predictions must be generated from the documented model pipeline. The dashboard must not present precomputed results as live predictions.

## Data science requirements

The data-science workflow must include:

1. Data ingestion and structural validation.
2. Missing-value inspection and treatment.
3. Duplicate detection and removal.
4. Detection of inconsistent and impossible values.
5. Classification of variables by measurement scale.
6. Transformation and feature engineering.
7. Quality validation and reproducible analysis.

Variables must be classified before applying statistical methods:

- **Qualitative nominal:** categories without an intrinsic order. Use frequencies, proportions, and mode.
- **Qualitative ordinal:** categories with a meaningful order. Use frequencies and appropriate ordinal summaries.
- **Quantitative interval or ratio:** numerical measurements for which numerical summaries are meaningful.

Nominal identifiers and category labels must never be treated as continuous measurements merely because they are stored as numbers.

Large datasets must be generated and processed in batches or chunks where appropriate. The project should document memory-management decisions, processing volumes, and any justified sampling.

## Technology stack

### Web application

- JavaScript
- Next.js — Pages Router
- React
- Tailwind CSS
- Recharts
- Prisma ORM
- PostgreSQL
- NeonDB
- Vercel

### Data science

- Python
- Pandas
- NumPy
- scikit-learn
- CSV and/or Parquet for intermediate datasets

### Testing

- Jest for JavaScript application and API tests
- Python tests for generators, preprocessing, feature engineering, and model evaluation

The Python workspace is responsible for data generation, preprocessing, analysis, model training, and evaluation. The Next.js application provides the interactive interface and application API.

## Architecture

The solution is organized as a modular monolith:

1. Data sources and generation
2. Data processing and ingestion
3. Analytics and machine-learning outputs
4. Interactive visualization

The web application and its API routes are deployed through Vercel. PostgreSQL is the persistent data store. Python scripts run as explicit data-science and simulation workflows rather than as permanent background services.

The initial IoT ingestion path uses HTTP requests to a Next.js API route. A message broker or streaming platform is not required for the first implementation.

## Privacy and security

- Do not store or display consumer names, emails, telephone numbers, or addresses.
- Use pseudonymous hashes for visitor and customer identifiers where needed.
- Treat hashes as pseudonymous data, not as a guarantee of anonymization.
- Keep dashboard authentication separate from visitor tracking.
- Store only hashed authentication tokens.
- Apply store scoping to application queries.
- Restrict administrative settings to authorized roles.
- Ensure exports exclude consumer personal information.

## Repository structure

```text
merchant-pulse/
├── src/
│   ├── components/
│   ├── features/
│   ├── pages/
│   │   └── api/
│   ├── lib/
│   └── styles/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── data-science/
│   ├── generators/
│   ├── simulators/
│   ├── preprocessing/
│   ├── analysis/
│   ├── features/
│   ├── models/
│   ├── evaluation/
│   ├── notebooks/
│   └── tests/
├── docs/
│   ├── PROJECT_SPEC.md
│   ├── ARCHITECTURE.md
│   ├── DATA_MODEL.md
│   └── ROADMAP.md
├── tests/
├── AGENTS.md
├── README.md
└── package.json
```

The structure is a target organization. It may evolve as implementation reveals better boundaries, provided the architecture and project scope remain consistent.

## Development principles

- Prefer simple, maintainable solutions over unnecessary infrastructure.
- Use JavaScript rather than introducing TypeScript without a clear need.
- Keep the Next.js Pages Router.
- Avoid microservices and permanent workers for the initial version.
- Keep the Python data-science workflow separate from the web application code.
- Make data generation and preprocessing reproducible.
- Validate analytical definitions before implementing visualizations.
- Do not fabricate model metrics, validation results, or business outcomes.
- Keep documentation aligned with the actual implementation.

## Academic context

Merchant Pulse is developed as a UNIVESP Projeto Integrador IV project for the Data Science and Computer Engineering tracks.

The academic report establishes the problem context, the five-stage purchase journey, the small-business decision-support objective, and the importance of privacy and usability. The expanded technical implementation described in this repository adds reproducible large-scale data processing, supervised machine learning, and simulated IoT telemetry.

The use of synthetic and simulated data must be disclosed in technical documentation and academic reporting. Results obtained from these datasets demonstrate the system's analytical workflow; they do not establish real-world improvements in a partner company's revenue or conversion.

## Documentation

- [`docs/PROJECT_SPEC.md`](docs/PROJECT_SPEC.md) — Functional scope, requirements, and analytical definitions.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Application architecture and data flows.
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — Data entities, relationships, and metric semantics.
- [`AGENTS.md`](AGENTS.md) — Instructions for AI coding agents.
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — Implementation phases and completion criteria.

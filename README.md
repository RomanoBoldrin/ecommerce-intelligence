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

Merchant Pulse is a single-store application: it analyzes the data of one e-commerce business. The data model has no store or tenant entity.

### Main application modules

| Module                  | Purpose                                                                       |
| ----------------------- | ----------------------------------------------------------------------------- |
| Overview                | Main business indicators, trends, funnel summary, and recommendations         |
| Sales Funnel            | Five-stage purchase journey and conversion losses                             |
| Products & Performance  | Product and category performance, with optional read-only stock information   |
| Product Detail          | Detailed navigation and sales indicators for a selected product               |
| Customer Behavior       | Navigation patterns by day, hour, device, and traffic source                  |
| Data Sources & Pipeline | Data imports, processing status, and data-quality reports                     |
| IoT Monitoring          | Warehouse temperature, humidity, and energy telemetry                         |
| Demand Forecasting      | Category-level daily demand predictions and model evaluation                  |
| Settings                | Application configuration, dashboard users, targets, and data-source settings |

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
- Enforce role-based authorization in application queries.
- Restrict administrative settings to authorized roles.
- Ensure exports exclude consumer personal information.

## Repository structure

```text
merchant-pulse/
├── scripts/
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

## Development setup

### Prerequisites

- Node.js (see `.nvmrc`)
- Docker and Docker Compose (for the local PostgreSQL container)

### 1. Database setup

Start the local development PostgreSQL container:

```bash
npm run docker:dev:up
```

Run database migrations against the local development database:

```bash
npm run db:migrate
```

### 2. Administrator seed

The initial administrator account is created through an explicit, idempotent seed script.

Required environment variables:

- `ADMIN_NAME`: Full name of the administrator (at least 2 characters).
- `ADMIN_EMAIL`: Valid email address for administrator login.
- `ADMIN_PASSWORD`: Strong password (minimum 8 characters, containing letters and numbers/symbols).

You can supply these variables inline or define them in `.env.local` (recommended for local development):

```bash
ADMIN_NAME="System Administrator" ADMIN_EMAIL="admin@merchantpulse.com" ADMIN_PASSWORD="ChooseAStrongPassword123!" npm run db:seed
```

Alternatively, use the targeted alias:

```bash
npm run db:seed:admin
```

> **Note:** The seed is idempotent. If an account with `ADMIN_EMAIL` already exists, the script will skip creation and leave existing credentials, roles, and settings untouched. The seed never runs automatically on application startup, migration, or build.

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


```
ecommerce-intelligence
├─ .agents
│  └─ skills
│     ├─ frontend-developer
│     │  └─ skill.md
│     ├─ prisma-cli
│     │  ├─ SKILL.md
│     │  └─ references
│     │     ├─ agent-safety.md
│     │     ├─ complete.md
│     │     ├─ db-execute.md
│     │     ├─ db-pull.md
│     │     ├─ db-push.md
│     │     ├─ db-seed.md
│     │     ├─ debug.md
│     │     ├─ dev.md
│     │     ├─ format.md
│     │     ├─ generate.md
│     │     ├─ init.md
│     │     ├─ mcp.md
│     │     ├─ migrate-deploy.md
│     │     ├─ migrate-dev.md
│     │     ├─ migrate-diff.md
│     │     ├─ migrate-reset.md
│     │     ├─ migrate-resolve.md
│     │     ├─ migrate-status.md
│     │     ├─ studio.md
│     │     └─ validate.md
│     ├─ prisma-client-api
│     │  ├─ SKILL.md
│     │  └─ references
│     │     ├─ client-methods.md
│     │     ├─ constructor.md
│     │     ├─ filters.md
│     │     ├─ model-queries.md
│     │     ├─ query-options.md
│     │     ├─ raw-queries.md
│     │     ├─ relations.md
│     │     └─ transactions.md
│     ├─ prisma-compute
│     │  ├─ SKILL.md
│     │  └─ references
│     │     ├─ app-composer-setup.md
│     │     ├─ app-framework-builds.md
│     │     ├─ automation-create-prisma.md
│     │     ├─ automation-rest-api.md
│     │     ├─ cli-command-map.md
│     │     ├─ debug-deploy-failures.md
│     │     ├─ deploy-cli-and-ci.md
│     │     ├─ deploy-existing-app.md
│     │     ├─ deploy-on-push.md
│     │     ├─ ops-services-and-config.md
│     │     └─ runtime-requirements.md
│     ├─ prisma-database-setup
│     │  └─ SKILL.md
│     ├─ prisma-driver-adapter-implementation
│     │  └─ SKILL.md
│     ├─ prisma-orm-setup
│     │  ├─ SKILL.md
│     │  └─ references
│     │     ├─ v6-mongodb.md
│     │     ├─ v7-client-setup.md
│     │     ├─ v7-cockroachdb.md
│     │     ├─ v7-mysql.md
│     │     ├─ v7-postgresql.md
│     │     ├─ v7-prisma-postgres.md
│     │     ├─ v7-sqlite.md
│     │     └─ v7-sqlserver.md
│     ├─ prisma-postgres
│     │  └─ SKILL.md
│     ├─ prisma-postgres-setup
│     │  ├─ SKILL.md
│     │  └─ references
│     │     ├─ operations.md
│     │     ├─ provisioning.md
│     │     └─ vercel-marketplace.md
│     ├─ prisma-postgres-upgrade
│     │  ├─ SKILL.md
│     │  └─ references
│     │     ├─ adopt-schema-and-migrations.md
│     │     ├─ client-api-mapping.md
│     │     └─ verify-upgrade-checklist.md
│     └─ prisma-upgrade-v7
│        ├─ SKILL.md
│        └─ references
│           ├─ accelerate-users.md
│           ├─ driver-adapters.md
│           ├─ env-variables.md
│           ├─ esm-support.md
│           ├─ prisma-config.md
│           ├─ removed-features.md
│           └─ schema-changes.md
├─ .claude
│  └─ skills
│     ├─ prisma-cli
│     │  ├─ SKILL.md
│     │  └─ references
│     │     ├─ agent-safety.md
│     │     ├─ complete.md
│     │     ├─ db-execute.md
│     │     ├─ db-pull.md
│     │     ├─ db-push.md
│     │     ├─ db-seed.md
│     │     ├─ debug.md
│     │     ├─ dev.md
│     │     ├─ format.md
│     │     ├─ generate.md
│     │     ├─ init.md
│     │     ├─ mcp.md
│     │     ├─ migrate-deploy.md
│     │     ├─ migrate-dev.md
│     │     ├─ migrate-diff.md
│     │     ├─ migrate-reset.md
│     │     ├─ migrate-resolve.md
│     │     ├─ migrate-status.md
│     │     ├─ studio.md
│     │     └─ validate.md
│     ├─ prisma-client-api
│     │  ├─ SKILL.md
│     │  └─ references
│     │     ├─ client-methods.md
│     │     ├─ constructor.md
│     │     ├─ filters.md
│     │     ├─ model-queries.md
│     │     ├─ query-options.md
│     │     ├─ raw-queries.md
│     │     ├─ relations.md
│     │     └─ transactions.md
│     ├─ prisma-compute
│     │  ├─ SKILL.md
│     │  └─ references
│     │     ├─ app-composer-setup.md
│     │     ├─ app-framework-builds.md
│     │     ├─ automation-create-prisma.md
│     │     ├─ automation-rest-api.md
│     │     ├─ cli-command-map.md
│     │     ├─ debug-deploy-failures.md
│     │     ├─ deploy-cli-and-ci.md
│     │     ├─ deploy-existing-app.md
│     │     ├─ deploy-on-push.md
│     │     ├─ ops-services-and-config.md
│     │     └─ runtime-requirements.md
│     ├─ prisma-database-setup
│     │  └─ SKILL.md
│     ├─ prisma-driver-adapter-implementation
│     │  └─ SKILL.md
│     ├─ prisma-orm-setup
│     │  ├─ SKILL.md
│     │  └─ references
│     │     ├─ v6-mongodb.md
│     │     ├─ v7-client-setup.md
│     │     ├─ v7-cockroachdb.md
│     │     ├─ v7-mysql.md
│     │     ├─ v7-postgresql.md
│     │     ├─ v7-prisma-postgres.md
│     │     ├─ v7-sqlite.md
│     │     └─ v7-sqlserver.md
│     ├─ prisma-postgres
│     │  └─ SKILL.md
│     ├─ prisma-postgres-setup
│     │  ├─ SKILL.md
│     │  └─ references
│     │     ├─ operations.md
│     │     ├─ provisioning.md
│     │     └─ vercel-marketplace.md
│     ├─ prisma-postgres-upgrade
│     │  ├─ SKILL.md
│     │  └─ references
│     │     ├─ adopt-schema-and-migrations.md
│     │     ├─ client-api-mapping.md
│     │     └─ verify-upgrade-checklist.md
│     └─ prisma-upgrade-v7
│        ├─ SKILL.md
│        └─ references
│           ├─ accelerate-users.md
│           ├─ driver-adapters.md
│           ├─ env-variables.md
│           ├─ esm-support.md
│           ├─ prisma-config.md
│           ├─ removed-features.md
│           └─ schema-changes.md
├─ .editorconfig
├─ .nvmrc
├─ .prettierignore
├─ .swc
│  └─ plugins
│     └─ linux_x86_64_34.0.0
├─ AGENTS.md
├─ CLAUDE.md
├─ README.md
├─ commitlint.config.mjs
├─ docs
│  ├─ ARCHITECTURE.md
│  ├─ DATA_MODEL.md
│  ├─ DESIGN.md
│  ├─ PROJECT_SPEC.md
│  └─ ROADMAP.md
├─ eslint.config.mjs
├─ jest.config.js
├─ jest.globalSetup.js
├─ jest.resolver.js
├─ jest.setup.js
├─ jsconfig.json
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ prisma
│  ├─ migrations
│  │  ├─ 20261110223139_init
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ prisma.config.js
├─ public
├─ scripts
│  ├─ seed-admin.js
│  └─ seed.js
├─ skills-lock.json
└─ src
   ├─ components
   │  ├─ auth
   │  │  ├─ AuthLayout.jsx
   │  │  ├─ ForgotPasswordForm.jsx
   │  │  ├─ LoginForm.jsx
   │  │  ├─ ProtectedRoute.jsx
   │  │  └─ ResetPasswordForm.jsx
   │  └─ dashboard
   │     ├─ ActionableInsights.jsx
   │     ├─ ConversionFunnel.jsx
   │     ├─ Header.jsx
   │     ├─ KpiCard.jsx
   │     ├─ KpiGrid.jsx
   │     ├─ PerformanceBanner.jsx
   │     ├─ ProductTable.jsx
   │     ├─ Sidebar.jsx
   │     ├─ TemporalTrendChart.jsx
   │     └─ dashboardData.jsx
   ├─ context
   │  └─ AuthContext.js
   ├─ infra
   │  ├─ authentication.js
   │  ├─ authorization.js
   │  ├─ compose.yaml
   │  ├─ controller.js
   │  ├─ cookie.js
   │  ├─ errors.js
   │  ├─ password.js
   │  ├─ passwordReset.js
   │  ├─ prisma.cjs
   │  ├─ prisma.js
   │  ├─ session.js
   │  └─ webserver.mjs
   ├─ pages
   │  ├─ _app.js
   │  ├─ _document.js
   │  ├─ api
   │  │  └─ v1
   │  │     ├─ auth
   │  │     │  ├─ forgot-password
   │  │     │  │  └─ index.js
   │  │     │  ├─ reset-password
   │  │     │  │  └─ index.js
   │  │     │  └─ sessions
   │  │     │     └─ index.js
   │  │     └─ status
   │  │        └─ index.js
   │  ├─ dashboard
   │  │  └─ index.jsx
   │  ├─ forgot-password
   │  │  └─ index.jsx
   │  ├─ index.js
   │  ├─ login
   │  │  └─ index.jsx
   │  └─ reset-password
   │     └─ index.jsx
   ├─ styles
   │  └─ globals.css
   └─ tests
      ├─ integration
      │  └─ api
      │     └─ v1
      │        └─ auth
      │           ├─ forgot-password.test.js
      │           ├─ reset-password.test.js
      │           └─ sessions.test.js
      ├─ orchestrator
      │  └─ orchestrator.mjs
      ├─ testHelpers.js
      └─ unit
         ├─ authorization.test.js
         ├─ components
         │  ├─ authContext.test.jsx
         │  ├─ forgotPasswordForm.test.jsx
         │  ├─ loginForm.test.jsx
         │  ├─ protectedRoute.test.jsx
         │  └─ resetPasswordForm.test.jsx
         ├─ password.test.js
         └─ session.test.js

```
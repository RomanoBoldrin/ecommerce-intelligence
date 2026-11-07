# Merchant Pulse — Development Roadmap

## Project Status

Current stage: Planning and technical specification.

The roadmap defines the intended implementation sequence.

Phases should be completed incrementally, with testing and documentation updates before moving to dependent phases.

---

## Phase 1 — Project Foundation

**Objective:** Establish the development environment and application foundation.

Tasks:

- [ ] Create Next.js application using JavaScript.
- [ ] Configure Next.js Pages Router.
- [ ] Configure Tailwind CSS.
- [ ] Configure Jest.
- [ ] Configure Prisma ORM.
- [ ] Connect development PostgreSQL database through NeonDB.
- [ ] Configure environment files.
- [ ] Establish Git repository.
- [ ] Create initial project documentation.
- [ ] Establish development and test database environments.

**Deliverable:** A running Next.js application connected to PostgreSQL.

**Completion criteria:** Application builds, Prisma connects, and Jest executes successfully.

---

## Phase 2 — Database Design

**Objective:** Implement the initial relational data model.

Tasks:

- [ ] Finalize entity definitions.
- [ ] Define Product.
- [ ] Define NavigationEvent.
- [ ] Define Order.
- [ ] Define OrderItem.
- [ ] Define ImportJob.
- [ ] Define IoTTelemetry.
- [ ] Establish relationships.
- [ ] Establish unique constraints.
- [ ] Establish indexes.
- [ ] Implement Prisma migrations.
- [ ] Validate the schema using representative records.

**Deliverable:** Initial functional database schema.

**Completion criteria:** Migrations execute successfully and entity relationships behave as expected.

---

## Phase 3 — Synthetic Data and Data Ingestion

**Objective:** Establish a reliable data acquisition and processing pipeline.

Tasks:

- [ ] Define CSV import formats.
- [ ] Prepare synthetic e-commerce dataset.
- [ ] Implement CSV parsing.
- [ ] Implement structural validation.
- [ ] Implement record validation.
- [ ] Implement data normalization.
- [ ] Implement duplicate detection.
- [ ] Implement transactional persistence.
- [ ] Implement bounded batch processing.
- [ ] Implement import history.
- [ ] Implement import error reporting.
- [ ] Create Jest tests for the pipeline.

**Deliverable:** Functional e-commerce data ingestion.

**Completion criteria:** Valid datasets are imported, invalid records are handled, and repeated imports do not duplicate data.

---

## Phase 4 — Analytics Engine

**Objective:** Implement reliable business intelligence calculations.

Tasks:

- [ ] Implement visits calculation.
- [ ] Implement product view calculation.
- [ ] Implement add-to-cart calculation.
- [ ] Implement checkout initiation calculation.
- [ ] Implement completed order calculation.
- [ ] Implement conversion rate.
- [ ] Implement checkout abandonment rate.
- [ ] Implement average order value.
- [ ] Implement gross revenue aggregation.
- [ ] Implement daily aggregations.
- [ ] Implement product performance aggregation.
- [ ] Implement category aggregation.
- [ ] Implement date filtering.
- [ ] Implement category filtering.
- [ ] Create comprehensive Jest tests.

**Deliverable:** Reusable analytical services.

**Completion criteria:** All indicators match independently verified expected results.

---

## Phase 5 — Dashboard Development

**Objective:** Build the user-facing analytical application.

Tasks:

- [ ] Establish dashboard layout.
- [ ] Implement navigation.
- [ ] Implement reusable KPI cards.
- [ ] Implement Overview.
- [ ] Implement Sales Funnel.
- [ ] Implement Products & Performance.
- [ ] Implement Customer Behavior.
- [ ] Implement Settings & Data Management.
- [ ] Integrate API endpoints.
- [ ] Implement date filters.
- [ ] Implement category filters.
- [ ] Add loading and error states.
- [ ] Ensure responsive behavior.

**Deliverable:** Functional dashboard connected to real analytical queries.

**Completion criteria:** All principal dashboard screens display consistent database-derived information.

---

## Phase 6 — Business Intelligence

**Objective:** Transform analytical results into useful business recommendations.

Tasks:

- [ ] Define recommendation rules.
- [ ] Identify high-interest, low-conversion products.
- [ ] Detect funnel bottlenecks.
- [ ] Identify unusual conversion changes.
- [ ] Generate contextual recommendations.
- [ ] Establish recommendation priorities.
- [ ] Add supporting metrics to each recommendation.
- [ ] Implement previous-period comparisons.
- [ ] Implement store health indicator, if justified by defined criteria.

**Deliverable:** Rule-based recommendation engine.

**Completion criteria:** Recommendations are generated from measurable conditions and can be independently tested.

---

## Phase 7 — Simulated IoT Integration

**Objective:** Demonstrate an independent IoT data acquisition source.

Tasks:

- [ ] Define the simulated device.
- [ ] Define telemetry types and units.
- [ ] Define the payload contract.
- [ ] Implement telemetry generator.
- [ ] Implement HTTP transmission.
- [ ] Implement telemetry API endpoint.
- [ ] Validate incoming payloads.
- [ ] Persist telemetry through Prisma.
- [ ] Test invalid and valid measurements.
- [ ] Demonstrate telemetry integration with the data layer.

**Deliverable:** Functional simulated IoT ingestion component.

**Completion criteria:** The simulator generates and transmits telemetry, and valid records are stored in PostgreSQL.

---

## Phase 8 — Machine Learning Experimentation

**Objective:** Evaluate a predictive model relevant to e-commerce behavior.

Tasks:

- [ ] Research suitable public e-commerce datasets.
- [ ] Select and document the dataset.
- [ ] Perform exploratory data analysis.
- [ ] Define prediction target.
- [ ] Prepare features.
- [ ] Establish a baseline classifier.
- [ ] Train the selected model.
- [ ] Evaluate classification performance.
- [ ] Document limitations and potential biases.
- [ ] Define integration strategy.
- [ ] Integrate predictions if feasible.

**Deliverable:** Documented and evaluated predictive model.

**Completion criteria:** The model has a reproducible evaluation and its limitations are clearly explained.

---

## Phase 9 — Testing and Validation

**Objective:** Validate the prototype technically and with the external community.

Tasks:

- [ ] Run all unit tests.
- [ ] Run integration tests.
- [ ] Test data ingestion.
- [ ] Test KPI consistency.
- [ ] Test funnel calculations.
- [ ] Test dashboard filters.
- [ ] Test API error handling.
- [ ] Test simulated IoT ingestion.
- [ ] Test responsive layouts.
- [ ] Perform end-to-end workflow checks.
- [ ] Present the prototype to the partner business.
- [ ] Collect evaluation feedback.
- [ ] Incorporate relevant improvements.

**Deliverable:** Validated prototype with recorded test evidence and user feedback.

**Completion criteria:** Core requirements are functional and the validation activities are documented.

---

## Phase 10 — Deployment and Final Documentation

**Objective:** Deliver the final working prototype.

Tasks:

- [ ] Configure production NeonDB.
- [ ] Configure Vercel environment variables.
- [ ] Deploy application.
- [ ] Execute production migrations.
- [ ] Load demonstration data.
- [ ] Verify production functionality.
- [ ] Prepare application screenshots.
- [ ] Document architecture.
- [ ] Document data pipeline.
- [ ] Document machine learning experimentation.
- [ ] Document IoT acquisition.
- [ ] Record final limitations.
- [ ] Update README.

**Deliverable:** Deployed Merchant Pulse prototype and completed technical documentation.

**Completion criteria:** The application is accessible through Vercel and the final implementation is documented.

---

## Development Rules

1. Complete prerequisite phases before dependent implementation.
2. Every business calculation must have automated tests.
3. Database schema changes must use Prisma migrations.
4. Every new data source must have a documented input contract.
5. Architecture changes require project owner approval.
6. Documentation must reflect actual implementation.
7. Do not mark tasks complete without verification.

## Priority

The initial development priority is:

1. Project foundation.
2. Database design.
3. Data ingestion.
4. Analytics engine.
5. Dashboard.
6. Business intelligence.

IoT and machine learning are additional project deliverables and should be implemented after the core data architecture is stable.

Testing and documentation must accompany every phase rather than being postponed until the end.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Merchant Pulse — AI Agent Instructions

## 1. Role and Responsibilities

You are an AI software engineering agent working on Merchant Pulse.

Your responsibility is to implement, improve, test, or document the application while respecting its established requirements and architecture.

You must prioritize correctness, maintainability, simplicity, and consistency.

Do not independently redefine the project scope or introduce architectural changes without authorization.

## 2. Mandatory Documentation

Before implementing any feature, review the relevant documentation:

- `README.md`: project overview.
- `docs/PROJECT_SPEC.md`: functional requirements and scope.
- `docs/ARCHITECTURE.md`: technical architecture.
- `docs/DATA_MODEL.md`: database and analytical semantics.
- `docs/ROADMAP.md`: implementation priorities.

The academic source of truth is:

`Relatorio_Final_PI_IV.docx`

If documentation is incomplete or contradictory, identify the conflict before proceeding.

Never invent an established requirement.

## 3. Technology Restrictions

The project uses:

- JavaScript.
- Next.js Pages Router.
- React.
- Tailwind CSS.
- Recharts.
- Next.js API Routes.
- Prisma ORM.
- PostgreSQL.
- NeonDB.
- Jest.
- Vercel.

### Do not introduce without explicit approval:

- TypeScript.
- Next.js App Router.
- Express or another backend framework.
- Microservices.
- Redis.
- Message brokers.
- Unnecessary external services.
- Unnecessary state management libraries.
- Unnecessary dependencies.

Prefer the simplest implementation that satisfies the requirements.

## 4. Coding Standards

### JavaScript

- Use JavaScript throughout the application.
- Prefer clear and descriptive variable and function names.
- Prefer small, focused functions.
- Avoid unnecessary abstractions.
- Handle errors explicitly.
- Avoid duplicated business logic.
- Use consistent formatting.

### React and Next.js

- Follow the Pages Router architecture.
- Keep page components focused on presentation and orchestration.
- Extract reusable UI components when appropriate.
- Avoid placing complex analytical calculations inside React components.
- Use API Routes for backend operations.
- Validate incoming API parameters.

### Backend

- Keep API routes thin.
- Put business logic in services.
- Keep database access centralized through Prisma.
- Return consistent API responses.
- Handle invalid input and database errors.
- Never expose internal database details unnecessarily.

### Database

- Use Prisma migrations for schema changes.
- Never silently modify production database structures.
- Preserve data integrity.
- Define relationships and constraints explicitly.
- Use Decimal for monetary values.
- Avoid floating-point calculations for financial amounts.
- Consider indexes based on real query patterns.
- Keep development, testing, and production databases isolated.

### Environment Configuration

- Use environment files for local configuration.
- Never commit secrets.
- Never hardcode database credentials.
- Keep `.env.example` updated.
- Use the appropriate environment-specific database.

## 5. Business Logic and Analytics

Analytical calculations are central to Merchant Pulse.

All business metrics must be implemented in reusable services or utility functions.

Never duplicate the same calculation across multiple pages or API endpoints.

All formulas must follow `docs/DATA_MODEL.md`.

Pay particular attention to:

- Zero denominators.
- Empty datasets.
- Duplicate events.
- Distinct session counting.
- Date filtering.
- Category filtering.
- Cancelled orders.
- Monetary precision.

Never invent business metrics or modify established formulas without documenting the change.

Rule-based recommendations must be supported by measurable evidence.

Machine learning predictions must remain distinct from rule-based recommendations.

## 6. Data Processing

Data ingestion must prioritize reliability and integrity.

Every import implementation must consider:

- Input validation.
- Missing fields.
- Invalid values.
- Duplicate records.
- Identifier consistency.
- Batch processing.
- Database transaction boundaries.
- Error reporting.
- Import history.

An unsuccessful import must not silently leave inconsistent records.

Repeated imports must not duplicate previously processed records.

## 7. IoT Development

The IoT module is an independent data acquisition component.

The physical device is simulated.

Agents must not mix IoT telemetry with e-commerce navigation events.

The simulator and ingestion endpoint must use a documented payload structure.

Telemetry must be validated before persistence.

Do not introduce MQTT brokers or additional infrastructure unless explicitly approved.

## 8. Machine Learning

Machine learning experimentation must remain separate from the Next.js application.

Before integrating a model:

1. Identify the dataset.
2. Inspect its structure and limitations.
3. Define the prediction target.
4. Prepare the data.
5. Establish a baseline.
6. Evaluate model performance.
7. Document limitations.
8. Define the application integration method.

Do not present unvalidated predictions as reliable business insights.

Do not use synthetic partner data to claim real-world predictive performance.

## 9. Testing Requirements

Use Jest.

Tests must cover business-critical behavior, especially:

- KPI calculations.
- Funnel calculations.
- Product aggregations.
- Date filtering.
- Category filtering.
- Recommendation rules.
- Data validation.
- Duplicate detection.
- Import processing.
- API behavior.

Use deterministic test fixtures.

Unit tests should not require a live production database.

Integration tests must use an isolated test database.

Never execute destructive database commands against production.

## 10. Implementation Workflow

Before starting a task:

1. Read the relevant documentation.
2. Understand the existing implementation.
3. Identify affected modules.
4. Check existing conventions.
5. Identify dependencies and risks.
6. Propose a small implementation plan when the task is substantial.

During implementation:

- Make focused changes.
- Avoid unrelated refactoring.
- Preserve existing functionality.
- Follow established architecture.
- Add tests for new business logic.
- Update documentation when behavior or architecture changes.

After implementation:

1. Run relevant Jest tests.
2. Run applicable linting or build checks.
3. Review the modified files.
4. Report any unresolved issues.
5. Summarize what changed.
6. Identify any required database migrations.

Do not claim that a feature is complete if it has not been tested.

## 11. Scope Control

The following are outside the initial scope:

- Complete e-commerce platform.
- Payment processing.
- Customer account management.
- Inventory management.
- Multi-tenant SaaS infrastructure.
- Marketing automation.
- Distributed infrastructure.

Do not implement these features unless the project owner explicitly changes the scope.

## 12. Decision Management

The project owner has final authority over architectural and product decisions.

When a requirement is ambiguous:

- Do not guess when the decision materially affects architecture or data integrity.
- Explain the ambiguity.
- Present the available alternatives.
- Recommend a solution.
- Wait for approval when necessary.

If a technical improvement is identified:

- Explain the problem it solves.
- Describe the proposed change.
- Identify trade-offs.
- Update the relevant documentation after approval.

## 13. Communication

At the end of each task, report:

- What was implemented.
- Which files were modified.
- Which tests were executed.
- Whether the tests passed.
- Whether database migrations are required.
- Any remaining limitations or decisions.

Keep explanations clear and direct.

The goal is a functional, maintainable university prototype, not unnecessary enterprise-level complexity.

## 14. Core Principle

**Preserve architectural consistency and analytical correctness over implementation speed.**

Every feature must contribute to the established purpose of Merchant Pulse.

# Merchant Pulse

**E-Commerce Intelligence — Dashboard para Decisões de Pequenos Negócios**

Merchant Pulse is an academic software project developed as part of Projeto Integrador IV (PI-IV) at Universidade Virtual do Estado de São Paulo (UNIVESP).

Its purpose is to provide small e-commerce businesses with an accessible analytical dashboard capable of transforming raw navigation and sales data into actionable business insights.

## 1. Project Overview

Small e-commerce businesses often generate valuable data about website traffic, product views, shopping carts, and completed purchases. However, this information is frequently scattered across different platforms and reports, making it difficult to identify bottlenecks and make informed decisions.

Merchant Pulse addresses this problem by providing a centralized analytical solution that:

- Consolidates e-commerce navigation and sales data.
- Processes and normalizes datasets.
- Calculates key business performance indicators.
- Visualizes the customer purchasing journey.
- Identifies product and category performance patterns.
- Generates automatic business recommendations.
- Supports data-driven decision-making.

## 2. Main Objectives

The project focuses on five analytical objectives:

1. Understand website traffic and customer interest.
2. Identify bottlenecks in the purchasing funnel.
3. Analyze product and category performance.
4. Understand customer browsing behavior.
5. Provide actionable recommendations based on analytical findings.

The system also incorporates an independent simulated IoT data acquisition component to demonstrate the integration of additional data sources into the processing pipeline.

Machine learning is considered an additional analytical capability, with an emphasis on evaluating purchase-intention or abandonment prediction.

## 3. Technology Stack

| Component           | Technology           |
| ------------------- | -------------------- |
| Frontend            | Next.js              |
| Routing             | Next.js Pages Router |
| Language            | JavaScript           |
| Styling             | Tailwind CSS         |
| Data visualization  | Recharts             |
| Backend             | Next.js API Routes   |
| ORM                 | Prisma ORM           |
| Database            | PostgreSQL           |
| Database hosting    | NeonDB               |
| Application hosting | Vercel               |
| Testing             | Jest                 |
| Version control     | Git and GitHub       |

Additional libraries may be introduced when justified by a concrete requirement.

## 4. Architecture

Merchant Pulse follows a modular monolithic architecture.

The application is organized into four logical layers:

1. **Data Sources:** synthetic datasets, authorized e-commerce exports, and simulated IoT telemetry.
2. **Data Processing:** ingestion, validation, cleaning, normalization, and storage.
3. **Analytics:** KPI calculations, statistical analysis, recommendations, and machine learning.
4. **Visualization:** dashboard screens, charts, filters, and reports.

The application uses a centralized PostgreSQL database accessed through Prisma ORM.

## 5. Main Application Modules

- Overview: business indicators and general performance.
- Sales Funnel: five-stage customer purchasing journey.
- Products & Performance: product and category analysis.
- Customer Behavior: browsing patterns and behavioral indicators.
- Settings & Data Management: data imports, import history, and pipeline status.

## 6. Project Scope

Merchant Pulse is an analytical prototype, not an e-commerce platform.

It does not aim to replace the partner's existing sales platform, process payments, manage customer accounts, or operate as a complete inventory management system.

The initial implementation prioritizes a functional data pipeline, reliable analytical calculations, and an accessible dashboard.

## 7. Development Principles

- Keep the architecture simple and maintainable.
- Prefer JavaScript over TypeScript.
- Use the Next.js Pages Router.
- Separate business logic from presentation.
- Centralize analytical calculations.
- Validate incoming data before persistence.
- Prevent duplicate imports.
- Use anonymized or aggregated customer information.
- Test analytical calculations with Jest.
- Avoid unnecessary infrastructure and dependencies.

## 8. Academic Reference

The project's primary academic documentation is:

`Relatorio_Final_PI_IV.docx`

This document is the source of truth for the project's academic objectives, methodology, problem definition, and established requirements.

Engineering documentation under `/docs` complements the academic report and specifies the implementation.

## 9. Current Development Status

**Status:** Planning and technical specification.

No implementation decisions should be considered completed until the corresponding code has been developed and tested.

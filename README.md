# Merchant Pulse

**E-Commerce Intelligence and Data Analytics Platform**

Projeto Integrador IV — UNIVESP  
Turma 002

## 1. Project Overview

Merchant Pulse is an e-commerce intelligence platform designed to transform large-scale e-commerce and IoT data into useful information for business decision-making.

The project implements an end-to-end data pipeline, covering data acquisition, ingestion, preprocessing, storage, analytical processing, machine learning, and interactive visualization.

The platform is intended to help small e-commerce businesses understand customer behavior, evaluate product performance, identify weaknesses in the sales funnel, and discover patterns that can support better business decisions.

Merchant Pulse is an analytical and decision-support application. It is not intended to replace an e-commerce platform or operate a complete online store.

## 2. Academic Objective

The project addresses the PI-IV academic objective:

> Desenvolver análise de dados em escala utilizando algum conjunto de dados existentes ou capturados por IoT e aprendizagem de máquina. Preparar uma interface para visualização dos resultados.

The project must satisfy the technical requirements of both participating academic tracks:

- **Data Science:** large-scale data analysis, systematic preprocessing, machine learning implementation, and model evaluation.
- **Computer Engineering:** IoT data capture or ingestion, software integration, data storage, and a functional application interface.

Physical IoT devices are not mandatory. Software-simulated telemetry or suitable public IoT datasets are valid acquisition sources.

## 3. Core Deliverables

The project must demonstrate all of the following:

1. **Data acquisition:** obtain e-commerce datasets and IoT telemetry through documented sources or a simulator.
2. **Data at scale:** process datasets with sufficient volume and complexity to demonstrate meaningful data-engineering and analytical techniques.
3. **Data preprocessing:** clean, validate, normalize, deduplicate, and document the treatment of data.
4. **Statistical analysis:** classify variables correctly and apply statistically valid methods.
5. **Machine learning:** train and evaluate at least one model suitable for a clearly defined analytical objective.
6. **IoT integration:** ingest telemetry independently from e-commerce navigation and transaction data.
7. **Interactive visualization:** provide a functional web application through which users can explore results dynamically.
8. **Academic evidence:** document methodology, experiments, metrics, limitations, and results.

Static reports or notebook outputs alone do not satisfy the software-interface requirement.

## 4. Main Functional Areas

- **Overview:** business KPIs, period comparisons, sales funnel, revenue trends, product performance, and recommendations.
- **Sales Funnel:** customer journey stages, conversion losses, and breakdowns by device and traffic source.
- **Products & Stock Indicators:** product and category performance, sales, views, cart additions, and minimum-stock alerts.
- **Product Details:** individual product performance and related recommendations.
- **Customer Behavior:** session patterns, time-of-day and day-of-week distributions, devices, traffic sources, and new versus returning visitors.
- **IoT Analytics:** telemetry trends, device or source selection, sensor measurements, and data-quality indicators.
- **Machine Learning:** model performance, experiment results, and interactive predictions where supported by the selected model.
- **Settings:** stores, users, data sources, imports, targets, and alerts.

## 5. Technology Stack

### Web application

- Next.js — Pages Router
- JavaScript
- React
- Tailwind CSS
- Recharts
- Next.js API Routes

### Database and persistence

- PostgreSQL
- NeonDB
- Prisma ORM

### Data science and processing

- Python
- Pandas or another justified tabular-processing library
- Scikit-learn or another justified machine-learning framework
- Jupyter notebooks for experimentation and academic evidence
- Reproducible Python scripts for repeatable processing

### Testing and deployment

- Jest
- Vercel
- Git and GitHub

Additional libraries must be introduced only when they solve a concrete project requirement.

## 6. Logical Architecture

Merchant Pulse is organized into four main layers:

1. **Data Sources:** e-commerce exports, synthetic e-commerce datasets, APIs where available, and simulated or public IoT telemetry.
2. **Data Processing:** ingestion, validation, cleaning, normalization, deduplication, transformation, and feature preparation.
3. **Analytics and Intelligence:** statistical analysis, business indicators, recommendations, and machine-learning models.
4. **Visualization:** interactive dashboards, charts, filters, alerts, and model results.

The web application and Python data-science tooling have distinct responsibilities but belong to one coherent project.

## 7. Data Sources

The project may use:

- Public or authorized e-commerce datasets.
- Synthetic e-commerce data for development and demonstration.
- Simulated IoT telemetry generated by a software component.
- Public IoT time-series datasets, if appropriate.

The final academic dataset must be sufficiently large and complex. A small development fixture is not a substitute for the dataset used to demonstrate the final pipeline.

Dataset selection, volume, provenance, licensing, and processing strategy must be documented before final implementation.

## 8. Data Privacy

Consumer information must be anonymized or pseudonymized before entering the analytical pipeline.

The application must not store consumer names, email addresses, telephone numbers, CPF numbers, or full addresses as part of its analytical dataset.

Hashed identifiers may be used to associate sessions and identify returning visitors, but hashes are pseudonymous identifiers—not a guarantee of irreversible anonymization. The implementation must avoid storing raw identifiers and must protect any secret used to generate keyed hashes.

Dashboard users are authenticated separately from e-commerce visitors.

## 9. Project Scope

Included:

- Multi-store-capable analytical data model.
- Dashboard authentication and access profiles.
- CSV ingestion and import history.
- E-commerce event and order analysis.
- Product and category performance.
- Limited stock-level indicators and alerts.
- Independent IoT telemetry ingestion and analysis.
- Statistical analysis and preprocessing.
- Machine-learning experimentation and evaluation.
- Rule-based business recommendations.
- Interactive visualization and data export.

Excluded unless explicitly approved later:

- Building a complete e-commerce storefront.
- Payment processing.
- Consumer accounts and consumer authentication.
- Full inventory operations, purchasing, or warehouse management.
- Physical IoT hardware as a mandatory dependency.
- Microservices and distributed infrastructure without a demonstrated need.

## 10. Project Status

This documentation defines the Version 0.2 planning baseline.

The architecture and data model are proposed engineering decisions informed by the academic requirements and the collaborator's initial relational model. They are not a claim that implementation is complete.

Dataset selection, exact data volumes, event attribution rules, IoT measurement definitions, and machine-learning objectives remain decisions to be finalized before implementation.

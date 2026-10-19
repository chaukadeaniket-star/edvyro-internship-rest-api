# EdVyro REST API: architecture

## Overview

The service is an Express application with a layered request path. PostgreSQL is accessed through the `pg` connection pool and parameterized SQL in the repository layer.

```text
Client
  |
  v
Express application
  |-- Request ID, Helmet, JSON parsing, rate limiting
  |-- Routes and Zod validation
  |-- Controllers (HTTP status and response envelopes)
  |-- Services (pagination/query normalization)
  |-- Repositories (parameterized PostgreSQL statements)
  |-- PostgreSQL pool
        |
        +-- internships table (UUID primary key, constraints, timestamps, indexes)
```

## Runtime components

- `src/app.js` configures middleware and health/API routes. `src/server.js` loads `.env`, checks the database connection, and starts listening.
- `src/routes/` maps versioned endpoints to controllers and their request schemas.
- `src/controllers/` preserves the API's success messages, request IDs, and response envelopes.
- `src/services/` normalizes list options and pagination metadata.
- `src/repositories/internship.repository.js` owns SQL statements, filtering, ordering, and missing-record behavior. All data values are bound as query parameters. Sorting uses a fixed JavaScript allowlist before a column identifier is included in SQL.
- `src/models/internship.model.js` maps PostgreSQL `snake_case` rows to the established resource shape, retaining `_id` as a UUID and exposing timestamps in `camelCase`.
- `src/config/database.js` creates a shared PostgreSQL connection pool from `DATABASE_URL`; `DB_SSL=true` enables TLS with certificate verification.
- `src/validators/` enforces the request contract, including UUID IDs, required fields, numeric non-negative stipends, statuses, and bounded pagination.
- `src/middleware/` adds request IDs, rate limiting, validation, not-found handling, and structured errors.

## PostgreSQL schema

`migrations/001_create_internships.sql` creates `internships` with:

- UUID `id` primary key
- Required bounded text columns for title, company, domain, location, duration, and description
- Non-negative `NUMERIC` stipend
- `active` / `closed` status constraint, defaulting to `active`
- `TIMESTAMPTZ` `created_at` and `updated_at`, both defaulting to the current time
- Indexes for domain/status filtering, location filtering, and newest-first ordering

`npm run db:migrate` executes the migration transactionally and serializes concurrent runs with a PostgreSQL advisory lock. DDL and index creation use `IF NOT EXISTS` so rerunning the migration is safe. The seed script inserts stable sample UUIDs with `ON CONFLICT DO NOTHING`.

## Configuration and operations

Copy `.env.example` to `.env` and configure `DATABASE_URL`, `PORT`, and optional `DB_SSL`. Do not commit `.env`. Create the PostgreSQL database before applying the migration. Run `npm run db:migrate`, optionally `npm run db:seed`, then `npm start`.

Integration tests use `TEST_DATABASE_URL` and refuse to connect if it equals `DATABASE_URL`. They migrate the isolated test database and clean only IDs they created. Unit tests do not require a database.

## Repository layout

```text
edvyro-rest-api/
|-- docs/                 # API examples, OpenAPI contract, this document
|-- migrations/           # Repeatable PostgreSQL SQL migrations
|-- scripts/              # Migration and seed entry points
|-- src/
|   |-- config/           # Environment, logger, and PostgreSQL pool
|   |-- controllers/
|   |-- middleware/
|   |-- models/           # PostgreSQL row mapping
|   |-- repositories/     # Parameterized SQL
|   |-- routes/
|   |-- services/
|   |-- utils/
|   |-- validators/
|-- tests/
|   |-- integration/      # PostgreSQL-backed API tests
|   |-- unit/
|-- .env.example
|-- package.json
```

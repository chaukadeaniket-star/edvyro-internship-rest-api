# EdVyro Internship REST API

A Node.js and Express REST API for internship listings, backed by PostgreSQL. The application keeps a layered routes/controllers/services/repositories design, validates requests with Zod, and returns structured JSON responses with a request ID.

## Features

- Create, read, replace, partially update, and delete internships
- PostgreSQL persistence with UUID identifiers and repeatable SQL migrations
- Pagination, text search, case-insensitive domain/location filters, and allowlisted sorting
- Request validation, structured errors, request IDs, Helmet security headers, and rate limiting
- Unit tests and PostgreSQL-backed integration tests

## Technology

- Node.js (ES modules) and Express
- PostgreSQL and `pg` connection pooling
- Zod, Pino, Helmet, and express-rate-limit
- Vitest and Supertest

## Requirements

- Node.js 20 or newer and npm
- PostgreSQL 13 or newer

On Windows, install PostgreSQL using the installer at [postgresql.org/download/windows](https://www.postgresql.org/download/windows/). The installer can include the `psql` command-line client.

## Install and configure

From the project directory:

```powershell
npm install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
notepad .env
```

Set `DATABASE_URL` in `.env` to the database used by the API. For a local PostgreSQL installation, create the database first:

```powershell
psql -U postgres -c "CREATE DATABASE edvyro_internships;"
```

Set the connection URL in `.env` (replace the username/password as appropriate):

```dotenv
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/edvyro_internships
DB_SSL=false
PORT=5000
NODE_ENV=development
```

If the password contains URL-reserved characters, percent-encode them in the connection URL. For a hosted PostgreSQL provider that requires TLS, set `DB_SSL=true`; TLS certificate verification remains enabled.

### Migrate and seed

Apply the schema, then insert the example records:

```powershell
npm run db:migrate
npm run db:seed
```

The migration creates the `internships` table and indexes inside a transaction and can be run repeatedly. The seed script uses stable UUIDs and leaves existing records unchanged on reruns.

### Start the API

```powershell
npm start
```

The API listens on `http://localhost:5000` by default. Check it with:

```powershell
Invoke-RestMethod http://localhost:5000/api/v1/health
```

Use `npm run dev` to start the server with Nodemon.

## API

All routes are under `/api/v1`. See [docs/api-examples.md](./docs/api-examples.md) for request and response examples and [docs/openapi.yaml](./docs/openapi.yaml) for the OpenAPI 3.1 contract.

| Method | Path               | Description                    |
| ------ | ------------------ | ------------------------------ |
| GET    | `/health`          | API health check               |
| POST   | `/internships`     | Create an internship           |
| GET    | `/internships`     | List internships               |
| GET    | `/internships/:id` | Retrieve an internship by UUID |
| PATCH  | `/internships/:id` | Update supplied fields         |
| PUT    | `/internships/:id` | Replace all internship fields  |
| DELETE | `/internships/:id` | Delete an internship           |

List options include `page`, `limit` (1–100), `search`, `domain`, `location`, `status`, `sortBy` (`createdAt`, `title`, or `stipend`), and `order` (`asc` or `desc`). Unknown query or body fields are rejected. `PUT` requires all internship fields; `PATCH` requires at least one valid field.

Successful responses include `success`, `message`, and `requestId`; resource responses include `data`, and list responses also include `pagination`. Errors include `success: false`, a stable error `code`, a message, and the request ID. Invalid input/UUIDs return 400, missing resources return 404, and unexpected database failures return 500.

## Tests, lint, and format

Unit tests run without PostgreSQL:

```powershell
npm test
```

Integration tests require a dedicated database that is separate from the development/production database. Create it:

```powershell
psql -U postgres -c "CREATE DATABASE edvyro_internships_test;"
```

Add the test URL to `.env` (with the same credentials as appropriate), then run the integration suite:

```dotenv
TEST_DATABASE_URL=postgresql://postgres:your_password@localhost:5432/edvyro_internships_test
```

```powershell
npm run test:integration
```

The integration tests refuse to use a URL identical to `DATABASE_URL`, migrate only the test database, and remove only records created by the test run. If `TEST_DATABASE_URL` is not set, the full `npm test` run reports the PostgreSQL integration tests as skipped; configure it before treating integration behavior as verified.

Run static checks:

```powershell
npm run lint
npx prettier --check .
```

## Configuration

| Variable            | Required              | Default       | Description                                                       |
| ------------------- | --------------------- | ------------- | ----------------------------------------------------------------- |
| `DATABASE_URL`      | Yes                   | —             | PostgreSQL connection URL used by the server and database scripts |
| `DB_SSL`            | No                    | `false`       | Set to `true` to require TLS with certificate verification        |
| `TEST_DATABASE_URL` | For integration tests | —             | Dedicated PostgreSQL test database URL                            |
| `PORT`              | No                    | `5000`        | HTTP server port                                                  |
| `NODE_ENV`          | No                    | `development` | `development`, `test`, or `production`                            |

Keep `.env` private. It is ignored by Git; commit only `.env.example`.

## Architecture

The request path and PostgreSQL schema are described in [docs/architecture.md](./docs/architecture.md).

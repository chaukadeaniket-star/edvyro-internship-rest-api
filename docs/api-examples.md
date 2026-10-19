# EdVyro REST API: API examples

Base URL: `http://localhost:5000/api/v1`

Every response includes a `requestId` in the JSON body and the `X-Request-ID` response header. Internship IDs are PostgreSQL UUIDs.
The resource response preserves the existing `_id` field name, whose value is now a UUID.

## Health

```powershell
Invoke-RestMethod http://localhost:5000/api/v1/health
```

```json
{
  "success": true,
  "message": "EdVyro REST API is running",
  "requestId": "generated-request-uuid",
  "timestamp": "2026-10-19T12:00:00.000Z"
}
```

## Create

`POST /internships` requires all fields below. `stipend` must be a non-negative JSON number; `status` must be `active` or `closed`.

```powershell
$body = @{
  title = "React Developer Intern"
  company = "Tech Solutions"
  domain = "Web Development"
  location = "Pune"
  duration = "3 months"
  stipend = 12000
  description = "Work on React-based web applications with the product team."
  status = "active"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri http://localhost:5000/api/v1/internships `
  -ContentType "application/json" `
  -Body $body
```

Successful creation returns HTTP 201:

```json
{
  "success": true,
  "message": "Internship created successfully",
  "data": {
    "_id": "8ed17a91-373a-45d2-8727-951a9b421c0a",
    "title": "React Developer Intern",
    "company": "Tech Solutions",
    "domain": "Web Development",
    "location": "Pune",
    "duration": "3 months",
    "stipend": 12000,
    "description": "Work on React-based web applications with the product team.",
    "status": "active",
    "createdAt": "2026-10-19T12:00:00.000Z",
    "updatedAt": "2026-10-19T12:00:00.000Z"
  },
  "requestId": "generated-request-uuid"
}
```

## List, search, filter, sort, paginate

`GET /internships` accepts:

- `page`: positive integer, default `1`
- `limit`: integer from `1` to `100`, default `10`
- `search`: substring search in title, company, domain, and description
- `domain`, `location`: case-insensitive exact-match filters
- `status`: `active` or `closed`
- `sortBy`: `createdAt`, `title`, or `stipend`
- `order`: `asc` or `desc`

Examples:

```powershell
Invoke-RestMethod "http://localhost:5000/api/v1/internships?page=1&limit=5"
Invoke-RestMethod "http://localhost:5000/api/v1/internships?search=React"
Invoke-RestMethod "http://localhost:5000/api/v1/internships?location=Pune&domain=Web%20Development"
Invoke-RestMethod "http://localhost:5000/api/v1/internships?sortBy=stipend&order=desc"
```

The list response has `data` as an array and pagination metadata:

```json
{
  "success": true,
  "message": "Internships retrieved successfully",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalRecords": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  },
  "requestId": "generated-request-uuid"
}
```

Sort column names are selected from a fixed allowlist; query parameters are never used as raw SQL identifiers.

## Read by UUID

```powershell
Invoke-RestMethod "http://localhost:5000/api/v1/internships/8ed17a91-373a-45d2-8727-951a9b421c0a"
```

An invalid UUID returns 400. A well-formed UUID that does not exist returns 404.

## Patch selected fields

`PATCH /internships/:id` updates only fields supplied in the request. At least one valid field is required.

```powershell
$body = @{ stipend = 15000 } | ConvertTo-Json
Invoke-RestMethod -Method Patch `
  -Uri "http://localhost:5000/api/v1/internships/8ed17a91-373a-45d2-8727-951a9b421c0a" `
  -ContentType "application/json" `
  -Body $body
```

## Replace

`PUT /internships/:id` replaces the internship's writable fields. Supply all required fields in the body; its UUID and `createdAt` remain unchanged, while `updatedAt` is refreshed.

## Delete

`DELETE /internships/:id` returns HTTP 200 with:

```json
{
  "success": true,
  "message": "Internship deleted successfully",
  "requestId": "generated-request-uuid"
}
```

Deleting a well-formed UUID that does not exist returns 404.

## Errors

Validation failures return 400 and list individual fields in `error.details`:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "stipend",
        "message": "Invalid input: expected number, received string"
      }
    ]
  },
  "requestId": "generated-request-uuid"
}
```

Missing routes or records return 404. Unexpected server or database errors return 500 with a generic client-facing message and are logged by the server.

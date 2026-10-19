# EdVyro REST API - API Examples

This document contains example requests and responses for the Internship REST API.

## Base URL

http://localhost:5000/api/v1

## 1. Health Check

**Endpoint:** `GET /health`

**Full URL:** `http://localhost:5000/api/v1/health`

**Description:** Checks whether the API is running.

## 2. Create an Internship

**Endpoint:** `POST /internships`

**Full URL:** `http://localhost:5000/api/v1/internships`

**Headers:**
`Content-Type: application/json`

**Request Body:**

\`\`\`json
{
  "title": "React Developer Intern",
  "company": "Tech Solutions",
  "location": "Pune",
  "domain": "Web Development",
  "description": "Work on React-based web applications.",
  "stipend": 12000,
  "duration": "3 months",
  "applyLink": "https://example.com/apply"
}
\`\`\`

**Description:** Creates a new internship record.

## 3. Get All Internships

**Endpoint:** `GET /internships`

**Full URL:** `http://localhost:5000/api/v1/internships`

**Description:** Retrieves the list of internships.

### Pagination

**Request:**

\`\`\`http
GET /api/v1/internships?page=1&limit=5
\`\`\`

Returns the first five internships.

### Search

**Request:**

\`\`\`http
GET /api/v1/internships?search=React
\`\`\`

Searches internships using the search term.

### Filter by Location

**Request:**

\`\`\`http
GET /api/v1/internships?location=Pune
\`\`\`

Returns internships matching the specified location.

### Filter by Domain

**Request:**

\`\`\`http
GET /api/v1/internships?domain=Web%20Development
\`\`\`

Returns internships matching the specified domain.

### Sort Results

**Request:**

\`\`\`http
GET /api/v1/internships?sortBy=stipend&order=desc
\`\`\`

Sorts internships by stipend in descending order.

## 4. Get an Internship by ID

**Endpoint:** `GET /internships/:id`

**Example:**

\`\`\`http
GET /api/v1/internships/REPLACE_WITH_VALID_ID
\`\`\`

**Description:** Retrieves one internship using its MongoDB ID.

Replace `REPLACE_WITH_VALID_ID` with an actual internship ID.

## 5. Update an Internship

**Endpoint:** `PATCH /internships/:id`

**Example Request:**

\`\`\`http
PATCH /api/v1/internships/REPLACE_WITH_VALID_ID
\`\`\`

**Request Body:**

\`\`\`json
{
  "stipend": 15000
}
\`\`\`

**Description:** Updates selected fields of an internship.

## 6. Replace an Internship

**Endpoint:** `PUT /internships/:id`

**Description:** Replaces an internship record with the supplied data.

Provide all required fields in the request body.

## 7. Delete an Internship

**Endpoint:** `DELETE /internships/:id`

**Description:** Deletes the internship identified by the supplied ID.

## 8. Error Handling

The API returns structured error responses for invalid requests.

Examples of errors include:

- Required fields are missing.
- The internship ID is invalid.
- The requested internship does not exist.
- Pagination parameters are invalid.
- The requested endpoint does not exist.

The exact response structure depends on the error handled by the API.

## Notes

- Start the API server before sending requests.
- The server uses port `5000` by default.
- Use Postman or another HTTP client to test the endpoints.
- Replace example IDs with valid MongoDB document IDs.
- Ensure MongoDB is running and the environment variables are configured.# EdVyro REST API - API Examples

This document contains example requests and responses for the Internship REST API.

## Base URL

http://localhost:5000/api/v1

## 1. Health Check

**Endpoint:** `GET /health`

**Full URL:** `http://localhost:5000/api/v1/health`

**Description:** Checks whether the API is running.

## 2. Create an Internship

**Endpoint:** `POST /internships`

**Full URL:** `http://localhost:5000/api/v1/internships`

**Headers:**
`Content-Type: application/json`

**Request Body:**

\`\`\`json
{
  "title": "React Developer Intern",
  "company": "Tech Solutions",
  "location": "Pune",
  "domain": "Web Development",
  "description": "Work on React-based web applications.",
  "stipend": 12000,
  "duration": "3 months",
  "applyLink": "https://example.com/apply"
}
\`\`\`

**Description:** Creates a new internship record.

## 3. Get All Internships

**Endpoint:** `GET /internships`

**Full URL:** `http://localhost:5000/api/v1/internships`

**Description:** Retrieves the list of internships.

### Pagination

**Request:**

\`\`\`http
GET /api/v1/internships?page=1&limit=5
\`\`\`

Returns the first five internships.

### Search

**Request:**

\`\`\`http
GET /api/v1/internships?search=React
\`\`\`

Searches internships using the search term.

### Filter by Location

**Request:**

\`\`\`http
GET /api/v1/internships?location=Pune
\`\`\`

Returns internships matching the specified location.

### Filter by Domain

**Request:**

\`\`\`http
GET /api/v1/internships?domain=Web%20Development
\`\`\`

Returns internships matching the specified domain.

### Sort Results

**Request:**

\`\`\`http
GET /api/v1/internships?sortBy=stipend&order=desc
\`\`\`

Sorts internships by stipend in descending order.

## 4. Get an Internship by ID

**Endpoint:** `GET /internships/:id`

**Example:**

\`\`\`http
GET /api/v1/internships/REPLACE_WITH_VALID_ID
\`\`\`

**Description:** Retrieves one internship using its MongoDB ID.

Replace `REPLACE_WITH_VALID_ID` with an actual internship ID.

## 5. Update an Internship

**Endpoint:** `PATCH /internships/:id`

**Example Request:**

\`\`\`http
PATCH /api/v1/internships/REPLACE_WITH_VALID_ID
\`\`\`

**Request Body:**

\`\`\`json
{
  "stipend": 15000
}
\`\`\`

**Description:** Updates selected fields of an internship.

## 6. Replace an Internship

**Endpoint:** `PUT /internships/:id`

**Description:** Replaces an internship record with the supplied data.

Provide all required fields in the request body.

## 7. Delete an Internship

**Endpoint:** `DELETE /internships/:id`

**Description:** Deletes the internship identified by the supplied ID.

## 8. Error Handling

The API returns structured error responses for invalid requests.

Examples of errors include:

- Required fields are missing.
- The internship ID is invalid.
- The requested internship does not exist.
- Pagination parameters are invalid.
- The requested endpoint does not exist.

The exact response structure depends on the error handled by the API.

## Notes

- Start the API server before sending requests.
- The server uses port `5000` by default.
- Use Postman or another HTTP client to test the endpoints.
- Replace example IDs with valid MongoDB document IDs.
- Ensure MongoDB is running and the environment variables are configured.
# EdVyro REST API - Architecture

## 1. Overview

The EdVyro REST API is a backend application built using Node.js, Express.js, and MongoDB. It provides RESTful endpoints to create, retrieve, update, and delete internship records.

The application follows a layered architecture to separate responsibilities, improve maintainability, and make testing easier.

## 2. Technology Stack

- **Node.js:** JavaScript runtime for the backend.
- **Express.js:** Framework for building REST API endpoints.
- **MongoDB:** NoSQL database for storing internship records.
- **Mongoose:** ODM for interacting with MongoDB.
- **Vitest:** Testing framework for unit and integration tests.

## 3. Architecture Diagram

```text
                 Client
             (Postman / Frontend)
                     |
                     v
              Express Server
                     |
                     v
                Middleware
          (Request ID, Validation,
           Rate Limiting, Errors)
                     |
                     v
                  Routes
                     |
                     v
                Controllers
                     |
                     v
                  Services
                     |
                     v
                Repositories
                     |
                     v
              Mongoose Models
                     |
                     v
                  MongoDB



                  edvyro-rest-api/
|
|-- docs/
|   |-- api-examples.md
|   |-- architecture.md
|   |-- openapi.yaml
|
|-- src/
|   |-- app.js
|   |-- server.js
|   |
|   |-- config/
|   |   |-- database.js
|   |   |-- env.js
|   |   |-- logger.js
|   |
|   |-- constants/
|   |   |-- httpStatus.js
|   |
|   |-- controllers/
|   |   |-- internship.controller.js
|   |
|   |-- middleware/
|   |   |-- errorHandler.middleware.js
|   |   |-- notFound.middleware.js
|   |   |-- rateLimiter.middleware.js
|   |   |-- requestId.middleware.js
|   |   |-- validate.middleware.js
|   |
|   |-- models/
|   |   |-- internship.model.js
|   |
|   |-- repositories/
|   |   |-- internship.repository.js
|   |
|   |-- routes/
|   |   |-- index.js
|   |   |-- internship.routes.js
|   |
|   |-- services/
|   |   |-- internship.service.js
|   |
|   |-- utils/
|   |   |-- ApiError.js
|   |   |-- asyncHandler.js
|   |   |-- pagination.js
|   |
|   |-- validators/
|       |-- internship.validator.js
|
|-- tests/
|   |-- fixtures/
|   |-- integration/
|   |-- unit/
|
|-- .env.example
|-- .gitignore
|-- package.json
|-- README.md
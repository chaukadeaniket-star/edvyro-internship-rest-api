// terminal command 
npm install -D nodemon vitest supertest eslint prettier

# EdVyro REST API

A RESTful API for managing internship listings, built using Node.js, Express.js, MongoDB, and Mongoose.

## Features

- Create, retrieve, update, and delete internships
- Retrieve an internship by ID
- Pagination
- Search internships
- Filter by domain, location, and status
- Sort results
- Request validation using Zod
- Centralized error handling
- Security headers using Helmet
- Rate limiting
- Request ID tracking
- Unit and integration tests using Vitest and Supertest

## Technology Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Zod
- Helmet
- Express Rate Limit
- Pino
- Vitest
- Supertest

## Prerequisites

- Node.js and npm
- MongoDB running locally or a MongoDB connection URI

## Installation

Clone the repository and enter the project directory:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd edvyro-rest-api
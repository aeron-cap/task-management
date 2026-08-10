# Task Management App

A full-stack project register for digital agencies. Project managers can view,
create, edit, and delete client engagements while tracking delivery status,
priority, and dates.

## Technology

- React 19, React Router, TypeScript, and Vite for the SPA
- NestJS and class-validator for the REST API
- PostgreSQL 17 with Drizzle ORM and versioned migrations
- npm workspaces for the web/API monorepo
- Docker Compose for the local PostgreSQL service

The application deliberately uses React state and the native Fetch API. The
scope does not require a server-state library, and keeping the dependency set
small makes the data flow easy to follow.

## Prerequisites

- Node.js 22 or newer
- npm
- Docker with Docker Compose

## Setup Instructions

1. Install dependencies.

   ```bash
   npm install
   ```

2. Create the local environment file.

   ```bash
   cp .env.example .env
   ```

3. Start PostgreSQL and wait for it to become healthy.

   ```bash
   docker compose up -d pg-db
   docker compose ps
   ```

4. Apply the database migration.

   ```bash
   npm run db:migrate
   ```

5. Optionally load the assessment's sample projects. The seed uses stable UUIDs
   and can safely be run more than once.

   ```bash
   npm run db:seed
   ```

6. Start the API and SPA together.

   ```bash
   npm run dev
   ```

The SPA is available at <http://localhost:5173> and proxies API requests to
<http://localhost:3000>. The API base URL is <http://localhost:3000/api>.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API and SPA in watch mode |
| `npm run db:migrate` | Apply pending Drizzle migrations |
| `npm run db:seed` | Insert the supplied sample projects |
| `npm run build` | Build both workspaces for production |
| `npm run lint` | Lint both workspaces |
| `npm test` | Run API unit tests |
| `npm run test:e2e` | Run API HTTP/validation tests |

## API

| Method | Endpoint | Result |
| --- | --- | --- |
| `GET` | `/api/projects` | List all projects |
| `GET` | `/api/projects/:id` | Get one project |
| `POST` | `/api/projects` | Create a project |
| `PUT` | `/api/projects/:id` | Replace a project's editable fields |
| `DELETE` | `/api/projects/:id` | Delete a project (`204 No Content`) |

Project IDs must be UUIDs so I changed the test_data a bit to fit the format. Client name, project name, status, priority, start date, and due date are required. Dates use `YYYY-MM-DD`, and the due date cannot be earlier than the start date. Invalid data returns a `400` response with field-level messages; operations on an unknown project return `404`.

## Structure

```text
apps/
  api/                  NestJS application, Drizzle schema, migrations, tests
  web/                  React SPA and project feature components
docker-compose.yml      Local PostgreSQL service
```

The API keeps transport concerns in `ProjectsController`, persistence and
not-found behavior in `ProjectsService`, and request validation in DTOs. The SPA
uses one page-level component to own remote state while the form and list remain
focused presentation components.

## Features Implemented
- All the Main requirements.
- Dockerized Postgresql.
- SPA mode for React frontend.
- Search Functionality.
- Some tests.

## Assumptions

- This is a shared internal register, so authentication and project ownership
  are outside the required scope.
- `PUT` is a full update: all required project fields must be supplied.
- Deletion is permanent rather than archival.
- Description is optional and stored as `null` when omitted.
- Status transitions are unrestricted because the assessment defines valid
  values but no workflow rules.
- PostgreSQL is containerized; the API and SPA run locally for a fast assessment
  setup.

## Technical Reflection

### Why this approach?

Nest modules and DTOs provide a clear boundary around the project feature,
while Drizzle keeps database queries explicit and strongly typed. A small React
component tree with native Fetch is sufficient for one CRUD resource and avoids
hiding behavior behind unnecessary abstractions. I used NestJS since it was the most familiar framework to me, but a similar approach could be taken with Express or Fastify, and React for frontend since I have an experience with it and it is widely used and has a strong ecosystem. The Drizzle setup was from a previous project of mine.

### Tradeoffs

The frontend updates local state from mutation responses instead of introducing
a cache library. Status and priority values are repeated at the frontend/API
boundary rather than published as a shared package; that is acceptable for this
small assessment, but a generated contract would be safer as the system grows.
Only PostgreSQL is containerized, which optimizes local iteration over a fully
containerized deployment artifact, and is much more easier to setup ranther than creating a localized Postgres instance and database for testing.

### What would I improve with more time?

I would add browser-level tests, pagination and server-side filtering, an
OpenAPI-generated client, audit timestamps, deployment configuration, and an
authentication/authorization model. I would also run database integration tests
against a disposable PostgreSQL instance. Added Filtering since I compensated it by leveraging the Search component to filter the list of projects, but it would be better to have a server-side filtering and pagination for better performance and scalability.
I would have also deployed this in Railway, its just bad timing that my free trial just expired.

### Most challenging part

The main challenge was preserving one consistent contract across HTML date
inputs, API validation, PostgreSQL date columns, and edit operations. The
cross-field date validator keeps that rule at the API boundary while the form
provides immediate feedback.

### AI usage

OpenCode with GPT-5.6 Sol was used for scaffoling the application, and creating tests and documentation. The resulting code was reviewed and verified with TypeScript, ESLint, Jest, and production builds. Every output was manually checked and edited to ensure correctness, security, and maintainability, and the was heavily being steered by myself to ensure the final implementation met the assessment requirements and my own standards. The project structure and every decision was made by me while keeping in mind future scalability and maintainability of the application for both developers and agents.

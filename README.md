# Field Service Operations Platform

This is a production-grade fullstack business management platform framed around a realistic facilities-services operating model. It presents the kind of business problem a consulting engagement might solve: replacing fragmented spreadsheets, email dispatching, manual invoice tracking, and disconnected customer records with one secure operations platform.

It includes JWT authentication, role-based dashboards, booking workflows, CRM records, invoicing, analytics, uploads, notifications, Dockerized infrastructure, CI, and automated tests.

Live demo: https://field-service-operations-platform-w.vercel.app/

## Business Case

The modeled company manages cleaning, HVAC maintenance, emergency repairs, and inspections for commercial customers. The business problem is a lack of one reliable source of truth for bookings, employee assignment, job completion, customer history, and revenue reporting.

The platform demonstrates a practical solution:

- Customers book services and track request status.
- Admins assign employees and monitor unassigned or delayed work.
- Employees view assigned jobs, add notes, upload evidence, and mark work complete.
- Finance generates invoices from completed bookings and tracks payment state.
- Leadership reviews monthly revenue, completion volume, customer growth, and service trends.

Detailed case documentation lives in [docs/business-case.md](docs/business-case.md).

## Architecture

- `apps/web`: Next.js, TypeScript, Tailwind CSS, App Router UI
- `apps/api`: Node.js, Express, Prisma, PostgreSQL, JWT auth
- `apps/api/prisma`: database schema and seed data
- `.github/workflows/ci.yml`: install, typecheck, lint, test, and build pipeline
- `docker-compose.yml`: PostgreSQL, API, and frontend services


## Architecture Decisions

- PostgreSQL is used as the primary database because bookings, invoices, customers, assignments, notifications, and audit logs are relational workflows. Foreign keys and transactions keep operational records consistent as jobs move from booking to completion to invoicing.
- JWT access and refresh tokens keep the API stateless while still supporting role-scoped dashboards for admins, employees, and customers. Short-lived access tokens limit exposure, while refresh tokens allow practical session continuity.
- Docker is included so the web app, API, and PostgreSQL service can be started the same way in local development, CI-like checks, and production-style deployment environments.
- Roles are modeled directly in the data layer because the product has different operational surfaces: admins dispatch and invoice, employees complete assigned work, and customers manage their own bookings and invoices.
## Core Capabilities

- Admin, employee, and customer roles
- Access and refresh token authentication
- Protected API routes and role permissions
- Booking creation, assignment, lifecycle tracking, and notes
- CRM customer records and booking history
- Invoice generation, payment status tracking, and PDF export endpoint
- Realtime-ready notification model with Socket.IO wiring
- Receipt, document, and work photo uploads
- Analytics for revenue, completed bookings, customer growth, and service trends
- Dark mode-ready design tokens

## Quick Start

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

The web app runs at `http://localhost:3000` and the API runs at `http://localhost:4000`.

For local development, the default `.env.example` expects PostgreSQL on `localhost:5432`. Start PostgreSQL first, then run the Prisma commands. If the database is empty, `npm run seed` creates the working roles, service catalog, a booking, invoice activity, notifications, and audit records used by the operations screens.

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm.ps1`:

```powershell
copy .env.example .env
npm.cmd install
npm.cmd run prisma:generate
npm.cmd run prisma:migrate
npm.cmd run seed
npm.cmd run dev
```

## Docker

```bash
cp .env.example .env
docker compose up --build
```

The Compose stack starts PostgreSQL, the API, and the web service. Keep the database credentials in `.env` aligned with `docker-compose.yml` before running migrations or seed data.

## Workspace Accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@demo.local | Password123! |
| Employee | employee@demo.local | Password123! |
| Customer | customer@demo.local | Password123! |

## API Overview

All protected endpoints require `Authorization: Bearer <accessToken>`.

| Method | Path | Description |
| --- | --- | --- |
| POST | `/auth/register` | Create a user and customer profile when needed |
| POST | `/auth/login` | Login and receive access and refresh tokens |
| POST | `/auth/refresh` | Rotate an access token |
| POST | `/auth/reset-password/request` | Start password reset flow |
| POST | `/auth/reset-password/confirm` | Complete password reset |
| POST | `/bookings` | Create a customer booking |
| GET | `/bookings` | List role-scoped bookings |
| PATCH | `/bookings/:id` | Update status, assignment, or notes |
| DELETE | `/bookings/:id` | Cancel/delete a booking |
| GET | `/customers` | List customers |
| POST | `/customers` | Create a CRM customer |
| GET | `/invoices` | List invoices |
| POST | `/invoices` | Generate invoice |
| GET | `/analytics/overview` | Dashboard analytics |
| POST | `/upload` | Upload booking files |

## Testing

```bash
npm run test
npm run typecheck
npm run lint
```

API tests use Jest and Supertest, including coverage for invoice lifecycle transitions, booking activity visibility, and booking update validation. End-to-end booking flow coverage lives in `apps/web/cypress/e2e/booking-flow.cy.ts`.

## Deployment

The platform is ready for deployment to a VPS, Render, Railway, or DigitalOcean. Configure environment variables from `.env.example`, provision PostgreSQL, run Prisma migrations, then deploy the API and web containers.

Operational deployment checklist:

- Set `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `WEB_ORIGIN`, `API_URL`, and `NEXT_PUBLIC_API_URL`.
- Run `npm run prisma:generate` during build.
- Run `npx prisma migrate deploy --schema apps/api/prisma/schema.prisma` against the production database.
- Seed only when preparing a controlled demo or internal review environment.
- Verify `/health`, login, booking creation, assignment, invoice status updates, and the booking activity timeline after release.

## Screenshots

| Dashboard | Admin |
| --- | --- |
| ![Dashboard](docs/screenshots/Dashboard.jpg) | ![Admin dashboard](docs/screenshots/Admin.png) |

| Booking | Employee |
| --- | --- |
| ![Booking form](docs/screenshots/Booking.png) | ![Employee jobs](docs/screenshots/Employee.png) |

| CRM | Invoices |
| --- | --- |
| ![CRM](docs/screenshots/Crm.png) | ![Invoices](docs/screenshots/Invoices.png) |

| Analytics |
| --- |
| ![Analytics](docs/screenshots/Analytics.png) |


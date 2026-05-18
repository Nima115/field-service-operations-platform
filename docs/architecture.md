# ServiceFlow Architecture

## System Context

ServiceFlow uses a split frontend/API architecture for Nordic Service Group, a facilities-services client. The frontend renders role-specific workflows for operations, field employees, customers, finance, and leadership. The API owns authentication, authorization, business rules, persistence, file metadata, notifications, and analytics aggregation.

## Application Boundaries

- Web: Next.js App Router, server-safe configuration, responsive operational UI.
- API: Express modules grouped by business capability.
- Database: PostgreSQL managed through Prisma migrations.
- Realtime: Socket.IO server broadcasts notification events by user channel.
- Files: local disk in development, compatible with object storage adapters in production.

## Security Model

- Passwords are hashed with bcrypt.
- Access tokens are short-lived JWTs.
- Refresh tokens are stored hashed and rotated on login.
- Role middleware guards admin, employee, and customer operations.
- Uploads are validated by route-level middleware and linked to bookings.

## Business Workflow Coverage

- Request intake: customer booking form and booking confirmation.
- Dispatch: admin dashboard highlights assignment and status.
- Field execution: employee dashboard supports job notes, completion, and uploads.
- Account management: CRM stores customer contacts, notes, and booking history.
- Finance: invoices connect directly to booking records and PDF export.
- Leadership: analytics aggregate revenue, completed bookings, customer growth, and service trends.

## Production Notes

- Use managed PostgreSQL with backups.
- Put the API behind TLS and a reverse proxy.
- Store uploads in S3-compatible object storage.
- Send transactional email through a production SMTP provider.
- Keep `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` in the deployment secret store.

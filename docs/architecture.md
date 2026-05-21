# Field Service Operations Platform Architecture

## System Context

The platform uses a split frontend/API setup for a facilities-services operating model. The frontend renders the screens for admins, employees, customers, finance, and leadership. The API handles authentication, business rules, database updates, file metadata, notifications, and reporting totals.

## Architecture Diagram

```text
Next.js frontend
       |
       v
Express API
       +----------------+
       |                |
       v                v
PostgreSQL            Redis
                       |
                       v
              Notification service
                       |
                       v
              User dashboards
```

In the local demo, notifications are sent with Socket.IO from the API. Redis is included in the diagram as the production-friendly path for queueing or pub/sub if the notification work is split out later.

## Main Parts

- Web: Next.js App Router with responsive pages for each role.
- API: Express routes and services grouped by feature.
- Database: PostgreSQL, managed through Prisma migrations.
- Realtime: Socket.IO sends notification events to the right user channel.
- Files: local disk in development, with a path to move uploads to object storage later.

## Security Model

- Passwords are hashed with bcrypt.
- Access tokens are short-lived JWTs.
- Refresh tokens are stored hashed and rotated on login.
- Role middleware protects admin, employee, and customer routes.
- Uploads are validated by route-level middleware and linked to bookings.

## Main Workflows

- Request intake: customer booking form and booking confirmation.
- Dispatch: admin dashboard highlights assignment and status.
- Field work: employee dashboard supports job notes, completion, and uploads.
- Account management: CRM stores customer contacts, notes, and booking history.
- Finance: invoices connect directly to booking records and PDF export.
- Reporting: charts summarize revenue, completed bookings, customer growth, and service trends.

## Production Notes

- Use managed PostgreSQL with backups.
- Put the API behind TLS and a reverse proxy.
- Store uploads in S3-compatible object storage.
- Send emails through a production SMTP provider.
- Keep `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` in the deployment secret store.

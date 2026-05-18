# API Documentation

The API is designed around Nordic Service Group's service workflow: customer request intake, admin dispatch, employee execution, invoicing, and leadership reporting.

## Authentication

`POST /auth/login`

```json
{
  "email": "admin@serviceflow.local",
  "password": "Password123!"
}
```

Response:

```json
{
  "accessToken": "jwt",
  "refreshToken": "jwt",
  "user": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@serviceflow.local",
    "role": "ADMIN"
  }
}
```

## Booking Lifecycle

Statuses: `PENDING`, `CONFIRMED`, `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`.

Customers can create bookings. Admins can assign employees and update status. Employees can view assigned bookings, mark work complete, and add notes.

## Invoice Lifecycle

Statuses: `DRAFT`, `SENT`, `PAID`, `OVERDUE`, `VOID`.

Invoices are generated from bookings and service prices. The API exposes invoice history and status tracking.

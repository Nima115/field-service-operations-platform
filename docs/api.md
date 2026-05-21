# API Documentation

The API supports the core service flow: customers create bookings, admins assign employees, employees update jobs, finance creates invoices, and managers review simple reports.

## Authentication

`POST /auth/login`

```json
{
  "email": "admin@demo.local",
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
    "email": "admin@demo.local",
    "role": "ADMIN"
  }
}
```

## Booking Lifecycle

Statuses: `PENDING`, `CONFIRMED`, `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`.

Customers can create bookings. Admins can assign employees and update status. Employees can view their assigned bookings, mark work complete, and add notes.

## Invoice Lifecycle

Statuses: `DRAFT`, `SENT`, `PAID`, `OVERDUE`, `VOID`.

Invoices are created from bookings and service prices. The API returns invoice history and lets admins update invoice status.

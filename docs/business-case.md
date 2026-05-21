# Business Case: Confidential Facilities Client

## Client Profile

The client is a regional facilities-services company serving offices, coworking spaces, retail locations, and light industrial customers. They handle cleaning, HVAC maintenance, emergency repairs, and scheduled inspections across multiple cities. Client and customer names are redacted in this public portfolio version.

## Original Problem

Before the platform, the client coordinated work through spreadsheets, email threads, phone calls, and manual invoice tracking. That caused a few recurring problems:

- Customers had no self-service booking portal.
- Dispatchers could not easily see unassigned or delayed work.
- Employees received job details through fragmented channels.
- Customer history was split between spreadsheets and inboxes.
- Invoices were generated manually after work completion.
- Management lacked reliable monthly revenue and service-demand reporting.

## Project Goal

Build a secure web app that keeps bookings, employee assignments, job updates, invoices, and reporting in one place.

## Who Uses It

| User | Need |
| --- | --- |
| Operations Manager | See all bookings, assign employees, spot delayed work |
| Field Employee | View assigned jobs, update status, upload photos, add notes |
| Customer | Create bookings, track status, view invoice history |
| Finance Admin | Generate invoices, track paid/unpaid work, export PDFs |
| Leadership | Check revenue, completed jobs, customer growth, and service trends |

## What Was Built

The platform gives the client one place to manage the day-to-day service work:

- Role-based dashboards for admins, employees, and customers
- Secure authentication with access and refresh tokens
- Booking flow with statuses and employee assignment
- CRM records with customer notes and booking history
- Invoice generation and PDF export
- Notifications for booking confirmations and employee assignments
- Upload support for receipts, work photos, and service documents
- Dashboard charts for revenue and service activity
- Docker setup and CI checks for local development and deployment

## Success Metrics

The implementation was aimed at these practical outcomes:

- Reduce manual booking coordination by 60%
- Decrease average assignment time from 4 hours to under 30 minutes
- Improve invoice turnaround from 3 days to same-day generation
- Give the team one reliable place to check monthly revenue
- Preserve searchable customer and job history for account management

## Representative Workflow

1. A customer books HVAC maintenance through the customer portal.
2. The platform creates a pending booking and sends confirmation.
3. An admin reviews the dashboard and assigns an employee.
4. The employee sees the job in their dashboard, adds notes, and uploads work photos.
5. The admin marks the job completed or verifies employee completion.
6. Finance generates an invoice from the booking.
7. Reports update revenue, completed work, and service trends.

## Product Decisions

- PostgreSQL and Prisma were used because the data is relational: customers, bookings, invoices, users, and services.
- JWT access tokens and refresh tokens keep login state simple for the API.
- Separate dashboards keep each role focused on the screens they actually need.
- Docker Compose makes the local setup close to the deployed setup.
- CI runs type checks, linting, tests, and production builds before release.

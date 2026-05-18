# Business Case: Nordic Service Group

## Client Profile

Nordic Service Group is a regional facilities-services company serving offices, coworking spaces, retail locations, and light industrial customers. The company manages cleaning, HVAC maintenance, emergency repairs, and scheduled inspections across multiple cities.

## Original Problem

Before ServiceFlow, the client coordinated work through spreadsheets, email threads, phone calls, and manual invoice tracking. This created operational bottlenecks:

- Customers had no self-service booking portal.
- Dispatchers could not easily see unassigned or delayed work.
- Employees received job details through fragmented channels.
- Customer history was split between spreadsheets and inboxes.
- Invoices were generated manually after work completion.
- Management lacked reliable monthly revenue and service-demand reporting.

## Consulting Goal

Build a secure business management platform that centralizes the full service workflow from customer booking to employee assignment, job completion, invoicing, and executive reporting.

## Primary Stakeholders

| Stakeholder | Need |
| --- | --- |
| Operations Manager | See all bookings, assign employees, identify bottlenecks |
| Field Employee | View assigned jobs, update status, upload photos, add notes |
| Customer | Create bookings, track status, view invoice history |
| Finance Admin | Generate invoices, track paid/unpaid revenue, export PDFs |
| Leadership | Monitor revenue, completion rate, customer growth, service trends |

## Solution Delivered

ServiceFlow was designed as a SaaS-style operating system for the client:

- Role-based dashboards for admins, employees, and customers
- Secure authentication with access and refresh tokens
- Booking workflow with statuses and employee assignment
- CRM records with customer notes and booking history
- Invoice generation and PDF export
- Notification model for booking confirmations and employee assignments
- Upload support for receipts, work photos, and service documents
- Analytics dashboard for revenue and operational performance
- Dockerized deployment setup with CI verification

## Success Metrics

The implementation targets the following business outcomes:

- Reduce manual booking coordination by 60%
- Decrease average assignment time from 4 hours to under 30 minutes
- Improve invoice turnaround from 3 days to same-day generation
- Give leadership a single source of truth for monthly revenue
- Preserve searchable customer and job history for account management

## Representative Workflow

1. A customer books HVAC maintenance through the customer portal.
2. ServiceFlow creates a pending booking and sends confirmation.
3. An admin reviews the operations dashboard and assigns an employee.
4. The employee sees the job in their dashboard, adds notes, and uploads work photos.
5. The admin marks the job completed or verifies employee completion.
6. Finance generates an invoice from the booking.
7. Analytics update revenue, completion, and service-trend metrics.

## Product Decisions

- PostgreSQL and Prisma were selected for relational business data and auditability.
- JWT access tokens and refresh tokens support stateless API authentication.
- Separate dashboards reduce cognitive load for each role.
- Docker Compose mirrors the client deployment architecture locally.
- CI enforces type safety, linting, tests, and production builds before release.

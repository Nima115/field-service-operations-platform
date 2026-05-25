export const DEMO_MODE = !process.env.NEXT_PUBLIC_API_URL;
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type Role = "ADMIN" | "EMPLOYEE" | "CUSTOMER";
export type BookingStatus = "PENDING" | "CONFIRMED" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "VOID";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type Booking = {
  id: string;
  serviceType: string;
  bookingDate: string;
  status: BookingStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  customer?: { companyName: string; email: string };
  employee?: { id?: string; name: string; email: string } | null;
  invoices?: Invoice[];
  files?: { id: string; filePath: string; createdAt: string }[];
  activities?: BookingActivity[];
};

export type BookingActivity = {
  id: string;
  bookingId: string;
  action: string;
  detail?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  actor?: User | null;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  price: string | number;
};

export type Customer = {
  id: string;
  companyName: string;
  email: string;
  phone?: string;
  notes?: string;
  bookings?: Booking[];
};

export type Invoice = {
  id: string;
  bookingId: string;
  amount: string | number;
  status: InvoiceStatus;
  createdAt: string;
  booking?: Booking;
};

export type Notification = {
  id: string;
  type: string;
  message: string;
  readStatus: boolean;
  createdAt: string;
};

export type AuditLog = {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  actor?: User | null;
};

export type AnalyticsOverview = {
  monthlyRevenue: number;
  completedBookings: number;
  customerGrowth: number;
  serviceTrends: { serviceType: string; bookings: number }[];
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type Session = AuthResponse;

const sessionKey = "operations-platform.session";
const demoStoreKey = "operations-platform.demo-store";

const demoUsers: User[] = [
  { id: "usr-admin", name: "Admin User", email: "admin@demo.local", role: "ADMIN" },
  { id: "usr-employee", name: "Field Employee", email: "employee@demo.local", role: "EMPLOYEE" },
  { id: "usr-customer", name: "Customer User", email: "customer@demo.local", role: "CUSTOMER" }
];

const demoServices: Service[] = [
  { id: "svc-cleaning", title: "Commercial Cleaning", description: "Scheduled office and retail cleaning", price: 1200 },
  { id: "svc-hvac", title: "HVAC Maintenance", description: "Inspection, filters, and service checks", price: 1800 },
  { id: "svc-repair", title: "Emergency Repair", description: "Urgent facilities repair response", price: 2400 }
];

type DemoStore = {
  bookings: Booking[];
  customers: Customer[];
  invoices: Invoice[];
  notifications: Notification[];
  auditLogs: AuditLog[];
};

const initialDemoStore: DemoStore = {
  bookings: [
    {
      id: "BK-1048",
      serviceType: "Commercial Cleaning",
      bookingDate: "2026-05-22T08:30:00.000Z",
      status: "ASSIGNED",
      createdAt: "2026-05-20T08:00:00.000Z",
      updatedAt: "2026-05-21T10:00:00.000Z",
      customer: { companyName: "Customer Account A", email: "customer-a@example.com" },
      employee: { id: "usr-employee", name: "Field Employee", email: "employee@demo.local" },
      notes: "Monthly deep-clean checklist.",
      activities: [
        { id: "act-1", bookingId: "BK-1048", action: "Booking created", detail: "Commercial Cleaning scheduled", createdAt: "2026-05-20T08:00:00.000Z", actor: demoUsers[2] },
        { id: "act-2", bookingId: "BK-1048", action: "Employee assigned", detail: "Field Employee", createdAt: "2026-05-21T10:00:00.000Z", actor: demoUsers[0] }
      ]
    },
    {
      id: "BK-1049",
      serviceType: "HVAC Maintenance",
      bookingDate: "2026-05-23T12:00:00.000Z",
      status: "CONFIRMED",
      createdAt: "2026-05-21T09:00:00.000Z",
      updatedAt: "2026-05-21T09:30:00.000Z",
      customer: { companyName: "Customer Account B", email: "customer-b@example.com" },
      employee: null,
      notes: "Filter stock required.",
      activities: [
        { id: "act-3", bookingId: "BK-1049", action: "Booking created", detail: "HVAC Maintenance scheduled", createdAt: "2026-05-21T09:00:00.000Z", actor: demoUsers[2] },
        { id: "act-4", bookingId: "BK-1049", action: "Status changed", detail: "PENDING to CONFIRMED", createdAt: "2026-05-21T09:30:00.000Z", actor: demoUsers[0] }
      ]
    },
    {
      id: "BK-1050",
      serviceType: "Emergency Repair",
      bookingDate: "2026-05-24T15:00:00.000Z",
      status: "PENDING",
      createdAt: "2026-05-22T14:30:00.000Z",
      updatedAt: "2026-05-22T14:30:00.000Z",
      customer: { companyName: "Customer Account C", email: "customer-c@example.com" },
      employee: null,
      notes: "Customer requested same-day confirmation.",
      activities: [
        { id: "act-5", bookingId: "BK-1050", action: "Booking created", detail: "Emergency Repair scheduled", createdAt: "2026-05-22T14:30:00.000Z", actor: demoUsers[2] }
      ]
    }
  ],
  customers: [
    { id: "cus-a", companyName: "Customer Account A", email: "customer-a@example.com", phone: "+46 70 100 10 10", notes: "Monthly cleaning contract." },
    { id: "cus-b", companyName: "Customer Account B", email: "customer-b@example.com", phone: "+46 70 200 20 20", notes: "HVAC maintenance every quarter." },
    { id: "cus-c", companyName: "Customer Account C", email: "customer-c@example.com", phone: "+46 70 300 30 30", notes: "Priority emergency repair customer." }
  ],
  invoices: [
    {
      id: "INV-2048",
      bookingId: "BK-1048",
      amount: 1200,
      status: "SENT",
      createdAt: "2026-05-22T12:00:00.000Z",
      booking: {
        id: "BK-1048",
        serviceType: "Commercial Cleaning",
        bookingDate: "2026-05-22T08:30:00.000Z",
        status: "ASSIGNED",
        customer: { companyName: "Customer Account A", email: "customer-a@example.com" }
      }
    },
    {
      id: "INV-2049",
      bookingId: "BK-1049",
      amount: 1800,
      status: "PAID",
      createdAt: "2026-05-20T09:00:00.000Z",
      booking: {
        id: "BK-1049",
        serviceType: "HVAC Maintenance",
        bookingDate: "2026-05-23T12:00:00.000Z",
        status: "CONFIRMED",
        customer: { companyName: "Customer Account B", email: "customer-b@example.com" }
      }
    }
  ],
  notifications: [
    { id: "not-1", type: "BOOKING_CONFIRMED", message: "HVAC maintenance booking confirmed.", readStatus: false, createdAt: "2026-05-21T10:00:00.000Z" },
    { id: "not-2", type: "INVOICE_SENT", message: "Invoice INV-2048 is ready for review.", readStatus: true, createdAt: "2026-05-22T12:00:00.000Z" }
  ],
  auditLogs: [
    { id: "aud-1", action: "Admin assigned job", entity: "Booking", entityId: "BK-1048", createdAt: "2026-05-21T10:00:00.000Z", actor: demoUsers[0], metadata: { employee: "Field Employee" } },
    { id: "aud-2", action: "Invoice generated", entity: "Invoice", entityId: "INV-2048", createdAt: "2026-05-22T12:00:00.000Z", actor: demoUsers[0], metadata: { status: "SENT" } }
  ]
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function demoStore() {
  if (typeof window === "undefined") return clone(initialDemoStore);
  const raw = window.localStorage.getItem(demoStoreKey);
  if (!raw) {
    const store = clone(initialDemoStore);
    window.localStorage.setItem(demoStoreKey, JSON.stringify(store));
    return store;
  }
  return JSON.parse(raw) as DemoStore;
}

function saveDemoStore(store: DemoStore) {
  if (typeof window !== "undefined") window.localStorage.setItem(demoStoreKey, JSON.stringify(store));
}

function demoSession(role: Role = "ADMIN"): Session {
  const user = demoUsers.find((item) => item.role === role) ?? demoUsers[0];
  return { accessToken: "demo-access-token", refreshToken: "demo-refresh-token", user };
}

function demoOverview(store: DemoStore): AnalyticsOverview {
  return {
    monthlyRevenue: store.invoices.filter((invoice) => invoice.status === "PAID").reduce((sum, invoice) => sum + Number(invoice.amount), 0),
    completedBookings: store.bookings.filter((booking) => booking.status === "COMPLETED").length,
    customerGrowth: store.customers.length,
    serviceTrends: demoServices.map((service) => ({
      serviceType: service.title,
      bookings: store.bookings.filter((booking) => booking.serviceType === service.title).length
    }))
  };
}

function appendBookingActivity(store: DemoStore, bookingId: string, activity: Omit<BookingActivity, "id" | "bookingId" | "createdAt">) {
  const nextActivity: BookingActivity = {
    ...activity,
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    bookingId,
    createdAt: new Date().toISOString()
  };

  store.bookings = store.bookings.map((booking) =>
    booking.id === bookingId
      ? {
          ...booking,
          updatedAt: nextActivity.createdAt,
          activities: [nextActivity, ...(booking.activities ?? [])]
        }
      : booking
  );
}

function appendAuditLog(store: DemoStore, log: Omit<AuditLog, "id" | "createdAt">) {
  store.auditLogs = [
    {
      ...log,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    },
    ...store.auditLogs
  ];
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(sessionKey);
  if (raw) return JSON.parse(raw) as Session;
  return DEMO_MODE ? demoSession() : null;
}

export function saveSession(session: Session) {
  window.localStorage.setItem(sessionKey, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(sessionKey);
}

export async function apiFetch<T>(path: string, init?: RequestInit & { token?: string }): Promise<T> {
  if (DEMO_MODE) return demoFetch<T>(path, init);

  const headers = new Headers(init?.headers);
  if (!(init?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (init?.token) {
    headers.set("Authorization", `Bearer ${init.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: `Request failed: ${response.status}` }));
    throw new Error(error.message ?? `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function authToken() {
  return getSession()?.accessToken ?? (DEMO_MODE ? "demo-access-token" : undefined);
}

export async function login(email: string, password: string) {
  if (DEMO_MODE) {
    const role = email.includes("employee") ? "EMPLOYEE" : email.includes("customer") ? "CUSTOMER" : "ADMIN";
    const session = demoSession(role);
    saveSession(session);
    return session;
  }

  const session = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  saveSession(session);
  return session;
}

export async function register(input: {
  name: string;
  companyName: string;
  email: string;
  phone?: string;
  password: string;
}) {
  if (DEMO_MODE) {
    const store = demoStore();
    const customer: Customer = {
      id: `cus-${Date.now()}`,
      companyName: input.companyName,
      email: input.email,
      phone: input.phone,
      notes: "Created from demo registration."
    };
    store.customers = [customer, ...store.customers];
    saveDemoStore(store);
    const session = { ...demoSession("CUSTOMER"), user: { id: `usr-${Date.now()}`, name: input.name, email: input.email, role: "CUSTOMER" as const } };
    saveSession(session);
    return session;
  }

  const session = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ ...input, role: "CUSTOMER" })
  });
  saveSession(session);
  return session;
}

async function demoFetch<T>(path: string, init?: RequestInit & { token?: string }): Promise<T> {
  const store = demoStore();
  const method = init?.method ?? "GET";
  const body = typeof init?.body === "string" ? JSON.parse(init.body) : {};
  const ok = (value: unknown) => Promise.resolve(clone(value) as T);

  if (path === "/auth/me") return ok(getSession()?.user ?? demoSession().user);
  if (path === "/auth/reset-password/confirm") return ok({ message: "Password updated." });
  if (path === "/services") return ok(demoServices);
  if (path === "/users?role=EMPLOYEE") return ok(demoUsers.filter((user) => user.role === "EMPLOYEE"));
  if (path === "/analytics/overview") return ok(demoOverview(store));
  if (path === "/audit-logs") return ok(store.auditLogs);

  if (path === "/customers" && method === "GET") {
    return ok(store.customers.map((customer) => ({
      ...customer,
      bookings: store.bookings.filter((booking) => booking.customer?.email === customer.email)
    })));
  }

  if (path === "/customers" && method === "POST") {
    const customer = { id: `cus-${Date.now()}`, ...body, bookings: [] };
    store.customers = [customer, ...store.customers];
    saveDemoStore(store);
    return ok(customer);
  }

  if (path === "/bookings" && method === "GET") return ok(store.bookings);

  if (path === "/bookings" && method === "POST") {
    const customer = store.customers.find((item) => item.id === body.customerId) ?? store.customers[0];
    const now = new Date().toISOString();
    const booking: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceType: body.serviceType,
      bookingDate: body.bookingDate,
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
      customer: { companyName: customer?.companyName ?? "Current customer account", email: customer?.email ?? "customer@demo.local" },
      employee: null,
      notes: body.notes,
      activities: []
    };
    booking.activities = [{
      id: `act-${Date.now()}`,
      bookingId: booking.id,
      action: "Booking created",
      detail: `${booking.serviceType} scheduled`,
      createdAt: now,
      actor: getSession()?.user ?? demoUsers[0]
    }];
    store.bookings = [booking, ...store.bookings];
    appendAuditLog(store, {
      action: "Booking created",
      entity: "Booking",
      entityId: booking.id,
      actor: getSession()?.user ?? demoUsers[0],
      metadata: { status: booking.status }
    });
    store.notifications = [{ id: `not-${Date.now()}`, type: "BOOKING_CREATED", message: `${booking.serviceType} booking created.`, readStatus: false, createdAt: new Date().toISOString() }, ...store.notifications];
    saveDemoStore(store);
    return ok(booking);
  }

  const activityMatch = path.match(/^\/bookings\/(.+)\/activity$/);
  if (activityMatch && method === "GET") {
    const booking = store.bookings.find((item) => item.id === activityMatch[1]);
    return ok(booking?.activities ?? []);
  }

  const bookingMatch = path.match(/^\/bookings\/(.+)$/);
  if (bookingMatch && method === "PATCH") {
    const before = store.bookings.find((booking) => booking.id === bookingMatch[1]);
    store.bookings = store.bookings.map((booking) => {
      if (booking.id !== bookingMatch[1]) return booking;
      const employee = body.employeeId ? demoUsers.find((user) => user.id === body.employeeId) : body.employeeId === null ? null : booking.employee;
      return {
        ...booking,
        ...body,
        updatedAt: new Date().toISOString(),
        employee: employee ? { id: employee.id, name: employee.name, email: employee.email } : employee === null ? null : booking.employee
      };
    });
    const after = store.bookings.find((booking) => booking.id === bookingMatch[1]);
    if (after && before) {
      const actor = getSession()?.user ?? demoUsers[0];
      if (body.employeeId !== undefined) {
        appendBookingActivity(store, after.id, {
          action: body.employeeId ? "Employee assigned" : "Employee unassigned",
          detail: body.employeeId ? after.employee?.name ?? "Assigned employee" : "Booking returned to the unassigned queue",
          actor,
          metadata: { employeeId: body.employeeId }
        });
      }
      if (body.status && body.status !== before.status) {
        appendBookingActivity(store, after.id, {
          action: "Status changed",
          detail: `${before.status} to ${body.status}`,
          actor,
          metadata: { from: before.status, to: body.status }
        });
      }
      if (body.notes !== undefined && body.notes !== before.notes) {
        appendBookingActivity(store, after.id, { action: "Notes updated", detail: body.notes || "Notes cleared", actor });
      }
      appendAuditLog(store, {
        action: body.status === "COMPLETED" ? "Employee completed task" : body.employeeId ? "Admin assigned job" : "Booking updated",
        entity: "Booking",
        entityId: after.id,
        actor,
        metadata: body
      });
    }
    saveDemoStore(store);
    return ok({ success: true });
  }

  if (bookingMatch && method === "DELETE") {
    store.bookings = store.bookings.filter((booking) => booking.id !== bookingMatch[1]);
    saveDemoStore(store);
    return ok({ success: true });
  }

  if (path === "/invoices" && method === "GET") return ok(store.invoices);

  if (path === "/invoices" && method === "POST") {
    const booking = store.bookings.find((item) => item.id === body.bookingId) ?? store.bookings[0];
    const invoice: Invoice = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId: booking?.id ?? body.bookingId,
      amount: body.amount,
      status: body.status ?? "SENT",
      createdAt: new Date().toISOString(),
      booking
    };
    store.invoices = [invoice, ...store.invoices];
    appendBookingActivity(store, invoice.bookingId, {
      action: "Invoice created",
      detail: `${invoice.status} invoice for ${invoice.amount} SEK`,
      actor: getSession()?.user ?? demoUsers[0],
      metadata: { invoiceId: invoice.id, status: invoice.status }
    });
    appendAuditLog(store, {
      action: "Invoice generated",
      entity: "Invoice",
      entityId: invoice.id,
      actor: getSession()?.user ?? demoUsers[0],
      metadata: { bookingId: invoice.bookingId, status: invoice.status }
    });
    saveDemoStore(store);
    return ok(invoice);
  }

  const invoiceMatch = path.match(/^\/invoices\/(.+)$/);
  if (invoiceMatch && method === "PATCH") {
    const before = store.invoices.find((invoice) => invoice.id === invoiceMatch[1]);
    store.invoices = store.invoices.map((invoice) => invoice.id === invoiceMatch[1] ? { ...invoice, ...body } : invoice);
    const after = store.invoices.find((invoice) => invoice.id === invoiceMatch[1]);
    if (before && after && body.status && body.status !== before.status) {
      const actor = getSession()?.user ?? demoUsers[0];
      appendBookingActivity(store, after.bookingId, {
        action: "Invoice status changed",
        detail: `${before.status} to ${body.status}`,
        actor,
        metadata: { invoiceId: after.id, from: before.status, to: body.status }
      });
      appendAuditLog(store, {
        action: "Invoice status changed",
        entity: "Invoice",
        entityId: after.id,
        actor,
        metadata: { from: before.status, to: body.status }
      });
    }
    saveDemoStore(store);
    return ok({ success: true });
  }

  if (path === "/notifications" && method === "GET") return ok(store.notifications);

  const notificationMatch = path.match(/^\/notifications\/(.+)\/read$/);
  if (notificationMatch && method === "PATCH") {
    store.notifications = store.notifications.map((notification) => notification.id === notificationMatch[1] ? { ...notification, readStatus: true } : notification);
    saveDemoStore(store);
    return ok({ success: true });
  }

  return ok({ message: "Demo action completed." });
}

export const operationalBookings: Booking[] = [
  {
    id: "BK-1048",
    serviceType: "Commercial Cleaning",
    bookingDate: "2026-05-22T08:30:00.000Z",
    status: "ASSIGNED",
    customer: { companyName: "Customer Account A", email: "customer-a@example.com" },
    employee: { name: "Field Employee", email: "employee@demo.local" },
    notes: "Monthly deep-clean checklist."
  },
  {
    id: "BK-1049",
    serviceType: "HVAC Maintenance",
    bookingDate: "2026-05-23T12:00:00.000Z",
    status: "CONFIRMED",
    customer: { companyName: "Customer Account B", email: "customer-b@example.com" },
    employee: null,
    notes: "Filter stock required."
  },
  {
    id: "BK-1050",
    serviceType: "Emergency Repair",
    bookingDate: "2026-05-24T15:00:00.000Z",
    status: "PENDING",
    customer: { companyName: "Customer Account C", email: "customer-c@example.com" },
    employee: null,
    notes: "Customer requested same-day confirmation."
  }
];

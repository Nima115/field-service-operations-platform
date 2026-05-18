export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

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
  customer?: { companyName: string; email: string };
  employee?: { id?: string; name: string; email: string } | null;
  invoices?: Invoice[];
  files?: { id: string; filePath: string; createdAt: string }[];
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

const sessionKey = "serviceflow.session";

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(sessionKey);
  return raw ? (JSON.parse(raw) as Session) : null;
}

export function saveSession(session: Session) {
  window.localStorage.setItem(sessionKey, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(sessionKey);
}

export async function apiFetch<T>(path: string, init?: RequestInit & { token?: string }): Promise<T> {
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
  return getSession()?.accessToken;
}

export async function login(email: string, password: string) {
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
  const session = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ ...input, role: "CUSTOMER" })
  });
  saveSession(session);
  return session;
}

export const operationalBookings: Booking[] = [
  {
    id: "BK-1048",
    serviceType: "Commercial Cleaning",
    bookingDate: "2026-05-22T08:30:00.000Z",
    status: "ASSIGNED",
    customer: { companyName: "Nordic Office AB", email: "ops@nordicoffice.se" },
    employee: { name: "Jonas Lind", email: "jonas@serviceflow.local" },
    notes: "Monthly deep-clean checklist."
  },
  {
    id: "BK-1049",
    serviceType: "HVAC Maintenance",
    bookingDate: "2026-05-23T12:00:00.000Z",
    status: "CONFIRMED",
    customer: { companyName: "Harbor Cowork", email: "facility@harbor.example" },
    employee: null,
    notes: "Filter stock required."
  },
  {
    id: "BK-1050",
    serviceType: "Emergency Repair",
    bookingDate: "2026-05-24T15:00:00.000Z",
    status: "PENDING",
    customer: { companyName: "Studio North", email: "hello@studionorth.example" },
    employee: null,
    notes: "Customer requested same-day confirmation."
  }
];

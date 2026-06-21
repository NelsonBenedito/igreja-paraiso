/**
 * Cliente servidor para os endpoints autenticados do ChurchManager (admin).
 * Usa o token CHURCHMANAGER_ADMIN_TOKEN — nunca exposto ao browser.
 */

function getAdminBase(): string {
  const base = process.env.NEXT_PUBLIC_DONATIONS_API_BASE;
  if (!base?.trim()) throw new Error("NEXT_PUBLIC_DONATIONS_API_BASE não configurado.");
  return base.replace(/\/+$/, "");
}

function getAdminToken(): string {
  const token = process.env.CHURCHMANAGER_ADMIN_TOKEN;
  if (!token?.trim()) throw new Error("CHURCHMANAGER_ADMIN_TOKEN não configurado.");
  return token.trim();
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${getAdminBase()}/api${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getAdminToken()}`,
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch (networkError) {
    const msg = networkError instanceof Error ? networkError.message : "Falha de rede";
    throw new Error(`[admin-api] ${msg}`);
  }

  if (!res.ok) {
    let body: unknown;
    try { body = await res.json(); } catch { body = undefined; }
    const message =
      typeof body === "object" && body !== null && "message" in body
        ? String((body as { message: unknown }).message)
        : `Erro ${res.status}`;
    throw new Error(`[admin-api] ${res.status} — ${message}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** Verifica se a API admin está configurada */
export function isAdminApiConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_DONATIONS_API_BASE?.trim() &&
    process.env.CHURCHMANAGER_ADMIN_TOKEN?.trim()
  );
}

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface AdminEventDto {
  id: string;
  title: string;
  description: string | null;
  date: string;
  timeStart: string | null;
  timeEnd: string | null;
  location: string | null;
  imageUrl: string | null;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminRegistrationDto {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  userId: string | null;
  createdAt: string;
  eventId: string;
  event?: {
    title: string;
    date: string;
    tag: string | null;
  };
}

export interface CreateAdminEventBody {
  title: string;
  description?: string | null;
  date: string;
  timeStart?: string | null;
  timeEnd?: string | null;
  location?: string | null;
  imageUrl?: string | null;
  tags?: string[];
  published?: boolean;
}

// ─── Eventos ─────────────────────────────────────────────────────────────────

export async function adminListEvents(): Promise<AdminEventDto[]> {
  const data = await adminFetch<{ items: AdminEventDto[] }>("/admin/tenants/me/events");
  return data.items;
}

export async function adminCreateEvent(body: CreateAdminEventBody): Promise<AdminEventDto> {
  return adminFetch<AdminEventDto>("/admin/tenants/me/events", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function adminUpdateEvent(id: string, body: Partial<CreateAdminEventBody>): Promise<AdminEventDto> {
  return adminFetch<AdminEventDto>(`/admin/tenants/me/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function adminDeleteEvent(id: string): Promise<void> {
  return adminFetch<void>(`/admin/tenants/me/events/${id}`, { method: "DELETE" });
}

export async function adminUploadEventCover(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const url = `${getAdminBase()}/api/admin/tenants/me/events/upload-cover`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: formData,
    });
  } catch (networkError) {
    const msg = networkError instanceof Error ? networkError.message : "Falha de rede";
    throw new Error(`[admin-api] ${msg}`);
  }

  if (!res.ok) {
    let body: unknown;
    try { body = await res.json(); } catch { body = undefined; }
    const message =
      typeof body === "object" && body !== null && "message" in body
        ? String((body as { message: unknown }).message)
        : `Erro ${res.status}`;
    throw new Error(`[admin-api] upload ${res.status} — ${message}`);
  }

  return res.json() as Promise<{ url: string }>;
}

// ─── Inscrições ───────────────────────────────────────────────────────────────

export async function adminListRegistrations(): Promise<AdminRegistrationDto[]> {
  const data = await adminFetch<{ items: AdminRegistrationDto[] }>("/admin/tenants/me/registrations");
  return data.items;
}

// ─── Dashboard contadores ─────────────────────────────────────────────────────

export interface AdminEventsDashboard {
  totalEvents: number;
  publishedEvents: number;
  upcomingEvents: number;
  totalRegistrations: number;
  confirmedOrders: number;
  totalRevenueCents: number;
  upcomingEventsList: Array<{ id: string; title: string; date: string; published: boolean }>;
}

export async function adminGetEventsDashboard(): Promise<AdminEventsDashboard> {
  return adminFetch<AdminEventsDashboard>("/admin/tenants/me/events-dashboard");
}

// ─── Programação (Schedules) ──────────────────────────────────────────────────

export interface AdminScheduleDto {
  id: string;
  title: string;
  dayOfWeek: string;
  timeStart: string;
  location: string | null;
  description: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminScheduleBody {
  title: string;
  dayOfWeek: string;
  timeStart: string;
  location?: string | null;
  description?: string | null;
  active?: boolean;
  sortOrder?: number;
}

export async function adminListSchedules(): Promise<AdminScheduleDto[]> {
  const data = await adminFetch<{ items: AdminScheduleDto[] }>("/admin/tenants/me/schedules");
  return data.items;
}

export async function adminCreateSchedule(body: CreateAdminScheduleBody): Promise<AdminScheduleDto> {
  return adminFetch<AdminScheduleDto>("/admin/tenants/me/schedules", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function adminUpdateSchedule(id: string, body: Partial<CreateAdminScheduleBody>): Promise<AdminScheduleDto> {
  return adminFetch<AdminScheduleDto>(`/admin/tenants/me/schedules/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function adminDeleteSchedule(id: string): Promise<void> {
  return adminFetch<void>(`/admin/tenants/me/schedules/${id}`, { method: "DELETE" });
}


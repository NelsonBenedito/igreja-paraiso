import type { SiteSchedule } from "@/lib/events/types";
import type { SiteSections } from "@/lib/site-content/types";

export interface ContactView {
  address: string | null;
  phone: string | null;
  phoneHref: string | null;
  email: string | null;
  mapsUrl: string | null;
  schedules: { id: string; day: string; time: string; title: string }[];
}

const DAYS_ORDER = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

const clean = (v: string | null | undefined) => (v?.trim() ? v.trim() : null);

function toTelHref(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8) return null;
  return `tel:+${digits.length >= 12 && digits.startsWith("55") ? digits : `55${digits}`}`;
}

function toHttpUrl(url: string | null | undefined): string | null {
  const value = clean(url);
  if (!value) return null;
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:" ? value : null;
  } catch {
    return null;
  }
}

/**
 * Dados de /contato. Fonte: contact.* (endereço, telefone, e-mail), filial sede
 * de churches.items (mapsUrl) e /schedules ativos. `sections` nulo (API fora ou
 * sem configuração) → nada é exibido; campo vazio → bloco some.
 */
export function buildContactView(sections: SiteSections | null, schedules: SiteSchedule[]): ContactView {
  const phone = clean(sections?.contact.phone);
  const headquarters = sections?.churches.items.find((c) => c.active && c.isHeadquarters && toHttpUrl(c.mapsUrl));
  return {
    address: clean(sections?.contact.address),
    phone,
    phoneHref: phone ? toTelHref(phone) : null,
    email: clean(sections?.contact.email),
    mapsUrl: toHttpUrl(headquarters?.mapsUrl),
    schedules: schedules
      .filter((s) => s.active)
      .sort((a, b) => {
        const diff = DAYS_ORDER.indexOf(a.day_of_week) - DAYS_ORDER.indexOf(b.day_of_week);
        return diff !== 0 ? diff : a.time_start.localeCompare(b.time_start);
      })
      .map((s) => ({ id: s.id, day: s.day_of_week, time: s.time_start.slice(0, 5), title: s.title })),
  };
}

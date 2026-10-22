import { SITE_CONTENT_FALLBACK } from "./fallbacks";
import type { SiteSections } from "./types";

type Obj = Record<string, unknown>;

function isObj(v: unknown): v is Obj {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Objeto de texto/flag: só lê as chaves de `defaults`, com o mesmo tipo.
 * Ausente ou de tipo errado → default; chave extra → ignorada.
 */
function pick<T extends object>(raw: unknown, defaults: T): T {
  const src = isObj(raw) ? raw : {};
  const out: Record<string, unknown> = {};
  const def = defaults as Record<string, unknown>;
  for (const key of Object.keys(def)) {
    const v = src[key];
    out[key] = typeof v === typeof def[key] ? v : def[key];
  }
  return out as T;
}

/** Lista de itens: ignora não-objetos, itens sem `name` e inativos (`active: false`). */
function items<T extends { name: string }>(raw: unknown, shape: T): T[] {
  if (!isObj(raw) || !Array.isArray(raw.items)) return [];
  return raw.items
    .filter(isObj)
    .filter((i) => i.active !== false)
    .map((i) => ({ ...pick(i, shape), active: true }) as T)
    .filter((i) => typeof i.name === "string" && i.name.trim() !== "");
}

function omit<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const copy = { ...obj };
  delete copy[key];
  return copy;
}

const CHURCH = {
  name: "",
  location: "",
  address: "",
  image: "",
  mapsUrl: "",
  isHeadquarters: false,
  active: true,
};
const PASTOR = { name: "", image: "", active: true };
const MINISTRY = { name: "", description: "", icon: "", image: "", active: true };
const BENEFIT = { icon: "", titulo: "", descricao: "" };

/**
 * Normaliza `sections` da resposta de site-content para o formato que o site
 * consome. Nunca lança: textos ausentes usam a reserva, listas ausentes ficam
 * vazias, seções/campos desconhecidos são ignorados.
 */
export function normalizeSiteSections(raw: unknown): SiteSections {
  const r = isObj(raw) ? raw : {};
  const d = SITE_CONTENT_FALLBACK;
  const celulasText = omit(d.celulas, "benefits");
  const churchesText = omit(d.churches, "items");
  const pastorsText = omit(d.pastors, "items");
  const rawBenefits = isObj(r.celulas) ? r.celulas.benefits : undefined;

  return {
    mission: pick(r.mission, d.mission),
    celulas: {
      ...pick(r.celulas, celulasText),
      benefits: Array.isArray(rawBenefits)
        ? rawBenefits.filter(isObj).map((b) => pick(b, BENEFIT))
        : d.celulas.benefits,
    },
    visit: pick(r.visit, d.visit),
    churches: {
      ...pick(r.churches, churchesText),
      items: items(r.churches, CHURCH),
    },
    pastors: {
      ...pick(r.pastors, pastorsText),
      items: items(r.pastors, PASTOR),
    },
    ministries: { items: items(r.ministries, MINISTRY) },
    giving: pick(r.giving, d.giving),
    contact: pick(r.contact, d.contact),
    youtube: pick(r.youtube, d.youtube),
  };
}

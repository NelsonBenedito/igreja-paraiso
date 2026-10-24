/**
 * Ordem dos blocos da home vinda do painel (`layout.home` de site-content).
 * `hero` e o rodapé são fixos e não entram aqui. Espelha `SITE_HOME_BLOCKS`
 * da API; a ordem padrão é a de hoje no site.
 */
export const HOME_BLOCKS_DEFAULT = [
  "mission",
  "schedules",
  "celulas",
  "events",
  "churches",
  "giving",
  "youtube",
] as const;

export type HomeBlock = (typeof HOME_BLOCKS_DEFAULT)[number];

const KNOWN = new Set<string>(HOME_BLOCKS_DEFAULT);

function isHomeBlock(v: unknown): v is HomeBlock {
  return typeof v === "string" && KNOWN.has(v);
}

/**
 * Resolve a ordem da home a partir de `layout` (`{ home: string[] }`).
 * Nunca lança:
 * - sem `layout` ou `home` que não é array → ordem padrão;
 * - ids desconhecidos (ou não-string) são ignorados; repetidos valem na 1ª ocorrência;
 * - id conhecido que falta entra na posição padrão: logo após o bloco
 *   anterior (na ordem padrão) já presente; sem anterior, no início.
 */
export function resolveHomeOrder(layout: unknown): HomeBlock[] {
  const home =
    typeof layout === "object" && layout !== null
      ? (layout as { home?: unknown }).home
      : undefined;
  if (!Array.isArray(home)) return [...HOME_BLOCKS_DEFAULT];

  const order: HomeBlock[] = [];
  for (const id of home) {
    if (isHomeBlock(id) && !order.includes(id)) order.push(id);
  }

  HOME_BLOCKS_DEFAULT.forEach((id, i) => {
    if (order.includes(id)) return;
    let at = 0;
    for (let j = i - 1; j >= 0; j--) {
      const prev = order.indexOf(HOME_BLOCKS_DEFAULT[j]);
      if (prev !== -1) {
        at = prev + 1;
        break;
      }
    }
    order.splice(at, 0, id);
  });

  return order;
}

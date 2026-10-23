import type { PublicTicketTypeDto } from "./types";

/**
 * Ingresso que fica selecionado ao (re)carregar a lista: mantém o atual se
 * continuar disponível; senão, o primeiro não esgotado; `null` se todos esgotaram.
 */
export function selectableTicketId(
  tickets: Pick<PublicTicketTypeDto, "id" | "isSoldOut">[],
  currentId: string | null,
): string | null {
  const available = tickets.filter((t) => !t.isSoldOut);
  return (available.find((t) => t.id === currentId) ?? available[0])?.id ?? null;
}

/** Rótulos exibidos na grelha de cotas (formato monetário BR). */
export const COTAS_DESC = [
  "R$10.000,00",
  "R$ 6.000,00",
  "R$ 5.000,00",
  "R$ 3.000,00",
  "R$ 2.000,00",
  "R$ 1.000,00",
  "R$ 500,00",
  "R$ 400,00",
  "R$ 300,00",
  "R$ 200,00",
  "R$ 100,00",
  "R$ 50,00",
] as const;

export type CotaLabel = (typeof COTAS_DESC)[number];

export function parseReaisFromCotaLabel(label: string): number {
  const cleaned = label
    .replace(/R\$\s*/i, "")
    .trim()
    .replace(/\./g, "")
    .replace(",", ".");
  const n = Number.parseFloat(cleaned);
  if (!Number.isFinite(n) || n < 0.01) {
    throw new Error(`Valor inválido na cota: ${label}`);
  }
  return Math.round(n * 100) / 100;
}

/** Helpers de CPF usados no fluxo de cotas (máscara, validação e identificação). */

export function onlyDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

/** Máscara progressiva `000.000.000-00` (aceita entrada parcial e ignora o excesso). */
export function maskCpf(raw: string): string {
  const digits = onlyDigits(raw).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/** Valida os dígitos verificadores; rejeita sequências repetidas (111.111.111-11). */
export function isValidCpf(cpf: string): boolean {
  const digits = onlyDigits(cpf);
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
  const nums = digits.split("").map((c) => Number.parseInt(c, 10));
  const calc = (size: number) => {
    let sum = 0;
    for (let i = 0; i < size; i += 1) sum += nums[i] * (size + 1 - i);
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };
  return calc(9) === nums[9] && calc(10) === nums[10];
}

/** Tamanho mínimo do nome do contribuinte (após trim). */
export const MIN_DONOR_NAME_LENGTH = 3;

export function isValidDonorName(name: string): boolean {
  return name.trim().length >= MIN_DONOR_NAME_LENGTH;
}

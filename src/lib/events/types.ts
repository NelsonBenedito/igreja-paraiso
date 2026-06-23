export type EventPaymentStatus = "free" | "pending" | "paid" | "cancelled";

export interface EventWithPrice {
  id: string;
  title: string;
  registration_price?: number | null;
}

export function eventRequiresPayment(
  registrationPrice: number | null | undefined,
): boolean {
  return typeof registrationPrice === "number" && registrationPrice > 0;
}

export function formatEventPriceBrl(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function isRegistrationConfirmed(
  paymentStatus: string | null | undefined,
): boolean {
  return (
    !paymentStatus ||
    paymentStatus === "gratuito" ||
    paymentStatus === "pago"
  );
}

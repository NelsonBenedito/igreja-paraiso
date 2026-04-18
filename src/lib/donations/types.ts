/** Corpo público `POST /api/public/tenants/:slug/links` (Nest). */
export type CreatePublicPaymentLinkBody = {
  isMonthly: boolean;
  value?: number;
  /** Duração da assinatura em meses (1–12), quando `isMonthly` é true. */
  subscriptionMonths?: number;
};

/** Resposta `201` — redireccionar o browser para `url`. */
export type CreatePublicPaymentLinkResponse = {
  id: string;
  url: string;
  metadata?: {
    source?: string;
    tenant?: string;
  };
};

/** Corpo público `POST /api/public/tenants/:slug/links` (Nest). */
export type CreatePublicPaymentLinkBody = {
  isMonthly: boolean;
  value?: number;
  /**
   * Obrigatório no servidor quando `isMonthly` é true. A API aceita 1–120 meses;
   * nesta campanha o site só envia 1–12.
   */
  subscriptionDurationMonths?: number;
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

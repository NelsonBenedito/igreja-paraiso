/** Corpo público `POST /api/public/tenants/:slug/links` (Nest). */
export type CreatePublicPaymentLinkBody = {
  isMonthly: boolean;
  value?: number;
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

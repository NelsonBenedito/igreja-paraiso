/** Corpo público `POST /api/public/tenants/:slug/links` (Nest). */
export type CreatePublicPaymentLinkBody = {
  reuseMode?: "preset_global" | "cpf_custom";
  presetKey?: string;
  cpf?: string;
  name?: string;
  isMonthly: boolean;
  /**
   * Quando presente, deve ser >= 5 (reais); caso contrário a API responde 400.
   * Omitir permite valor livre na página do Asaas, conforme configuração do tenant.
   */
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

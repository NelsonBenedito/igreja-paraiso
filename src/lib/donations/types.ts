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
  /**
   * Só com `cpf_custom`: confirma uma contribuição adicional quando o CPF já tem
   * assinatura ativa (sem isto a API responde 409 `HAS_ACTIVE_CONTRIBUTION`).
   */
  confirmAdditional?: boolean;
};

/** Resposta `409` do `POST /links` quando o CPF já tem assinatura ativa. */
export type HasActiveContributionResponse = {
  code: "HAS_ACTIVE_CONTRIBUTION";
  /** E-mail mascarado do perfil do pagador (ex.: `pa***@gmail.com`). */
  emailHint: string | null;
};

/** Corpo `POST /api/public/tenants/:slug/contributions/access-link` (resposta sempre 202). */
export type ContributionsAccessLinkBody = {
  cpf: string;
  returnUrl: string;
};

/** Resposta `POST /contributions/session`. */
export type ContributionsSessionResponse = {
  sessionToken: string;
  expiresAt: string;
};

export type ContributionSubscription = {
  id: string;
  status: string;
  valueCents: number;
  label: string;
  createdAt: string;
  currentPeriodEnd: string | null;
};

export type ContributionPayment = {
  date: string;
  valueCents: number;
  status: string;
  billingType: string | null;
};

export type ContributionPendingLink = {
  url: string;
  /** `null` = valor livre na página de pagamento. */
  valueCents: number | null;
  isMonthly: boolean;
  subscriptionDurationMonths: number | null;
  createdAt: string;
};

/** Resposta `GET /contributions/me` (Bearer = sessionToken). */
export type ContributionsMeResponse = {
  payer: { name: string; emailHint: string | null };
  subscriptions: ContributionSubscription[];
  payments: ContributionPayment[];
  pendingLink: ContributionPendingLink | null;
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

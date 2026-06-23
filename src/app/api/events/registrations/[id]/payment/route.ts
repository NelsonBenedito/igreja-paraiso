import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createEventRegistrationCharge } from "@/lib/asaas/eventPayment";
import { AsaasApiError, isAsaasConfigured } from "@/lib/asaas/client";
import { eventRequiresPayment } from "@/lib/events/types";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: registrationId } = await context.params;

  if (!isAsaasConfigured()) {
    return NextResponse.json(
      { message: "Integração Asaas não configurada no servidor." },
      { status: 503 },
    );
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      {
        message:
          "Servidor sem SUPABASE_SERVICE_ROLE_KEY — necessário para gerar cobrança.",
      },
      { status: 503 },
    );
  }

  const { data: registration, error: regError } = await admin
    .from("event_registrations")
    .select(
      "id, event_id, name, email, phone, cpf, payment_status, asaas_payment_id, events(title, registration_price)",
    )
    .eq("id", registrationId)
    .single();

  if (regError || !registration) {
    return NextResponse.json(
      { message: "Inscrição não encontrada." },
      { status: 404 },
    );
  }

  const eventsRaw = registration.events as
    | { title: string; registration_price: number | null }
    | { title: string; registration_price: number | null }[]
    | null;
  const eventRow = Array.isArray(eventsRaw) ? eventsRaw[0] : eventsRaw;

  if (!eventRow || !eventRequiresPayment(eventRow.registration_price)) {
    return NextResponse.json(
      { message: "Este evento não exige pagamento." },
      { status: 400 },
    );
  }

  if (registration.payment_status === "paid") {
    return NextResponse.json(
      { message: "Esta inscrição já está paga." },
      { status: 400 },
    );
  }

  if (!registration.cpf) {
    return NextResponse.json(
      { message: "CPF obrigatório para gerar a cobrança." },
      { status: 400 },
    );
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3000";

  const successUrl = `${siteUrl}/evento/${registration.event_id}?pagamento=ok`;

  try {
    const { paymentId, invoiceUrl, customerId } =
      await createEventRegistrationCharge({
        registrationId: registration.id,
        customerName: registration.name,
        cpf: registration.cpf,
        email: registration.email,
        phone: registration.phone,
        value: Number(eventRow.registration_price),
        eventTitle: eventRow.title,
        successUrl,
      });

    await admin
      .from("event_registrations")
      .update({
        asaas_payment_id: paymentId,
        asaas_customer_id: customerId,
        payment_status: "pending",
      })
      .eq("id", registrationId);

    return NextResponse.json({ url: invoiceUrl, paymentId });
  } catch (err) {
    if (err instanceof AsaasApiError) {
      console.error("[Asaas]", err.status, err.errors);
      const asaasDetail = err.errors?.[0]?.description;
      const domainHint =
        err.errors?.[0]?.code === "invalid_object" &&
        asaasDetail?.toLowerCase().includes("domínio");
      return NextResponse.json(
        {
          message:
            err.status === 401
              ? "Credenciais Asaas inválidas no servidor."
              : domainHint
                ? "Configure um domínio/site na conta Asaas (Minha Conta → Informações) ou use um túnel (ngrok) em produção."
                : "Não foi possível criar a cobrança. Tente novamente.",
          ...(process.env.NODE_ENV === "development" && asaasDetail
            ? { detail: asaasDetail }
            : {}),
        },
        { status: err.status >= 500 ? 502 : 400 },
      );
    }
    console.error("[payment route]", err);
    return NextResponse.json(
      { message: "Erro interno ao preparar pagamento." },
      { status: 500 },
    );
  }
}

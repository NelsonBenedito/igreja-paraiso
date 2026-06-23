export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

const PAID_EVENTS = new Set([
  "PAYMENT_RECEIVED",
  "PAYMENT_CONFIRMED",
  "PAYMENT_RECEIVED_IN_CASH",
]);

type AsaasWebhookPayload = {
  event?: string;
  payment?: {
    id?: string;
    externalReference?: string;
    status?: string;
  };
};
export async function POST(request: Request) {
  const token = process.env.ASAAS_WEBHOOK_TOKEN?.trim();

  // if (token) {
  //   const header =
  //     request.headers.get("asaas-access-token") ||
  //     request.headers.get("x-asaas-access-token");

  //   if (header !== token) {
  //     return NextResponse.json(
  //       { message: "Unauthorized" },
  //       { status: 401 }
  //     );
  //   }
  // }

  let body: AsaasWebhookPayload;

  try {
    const raw = await request.text();

    console.log("[ASAAS RAW BODY]");
    // console.log(raw);

    const params = new URLSearchParams(raw);

    const data = params.get("data");

    if (!data) {
      return NextResponse.json(
        { message: "Missing data field" },
        { status: 400 }
      );
    }

    body = JSON.parse(data) as AsaasWebhookPayload;

  } catch (err) {
    console.error("[asaas webhook] invalid payload", err);

    return NextResponse.json(
      { message: "Invalid payload" },
      { status: 400 }
    );
  }

  const eventName = body.event ?? "";
  console.log("[ASAAS EVENT]", eventName);

  if (!PAID_EVENTS.has(eventName)) {
    return NextResponse.json({
      received: true,
      ignored: true,
    });
  }

  const paymentId = body.payment?.id;
  const externalReference = body.payment?.externalReference;

  if (!paymentId && !externalReference) {
    return NextResponse.json({
      received: true,
      skipped: true,
    });
  }

  const admin = createAdminClient();

  if (!admin) {
    return NextResponse.json(
      { message: "Server misconfigured" },
      { status: 503 }
    );
  }

  let query = admin
    .from("event_registrations")
    .update({
      payment_status: "paid",
      asaas_payment_id: paymentId,
      paid_at: new Date().toISOString(),
    })
    .neq("payment_status", "paid");

  if (externalReference) {
    query = query.eq("id", externalReference);
  } else {
    query = query.eq("asaas_payment_id", paymentId);
  }

  const { data, error } = await query.select();

  if (error) {
    console.error("[asaas webhook] update failed", {
      error,
      paymentId,
      externalReference,
      eventName,
    });

    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    );
  }

  if (!data?.length) {
    console.warn("[asaas webhook] registration not found", {
      paymentId,
      externalReference,
    });
  }

  return NextResponse.json({
    received: true,
    paid: true,
  });
}
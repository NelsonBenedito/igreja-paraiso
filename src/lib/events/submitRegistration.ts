import type { SupabaseClient } from "@supabase/supabase-js";
import { onlyDigits, isValidCpf } from "@/lib/cpf";
import { eventRequiresPayment } from "@/lib/events/types";

export type RegistrationFormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
  cpf: string;
};

export type SubmitRegistrationResult =
  | { ok: true; registrationId: string; requiresPayment: false }
  | { ok: true; registrationId: string; requiresPayment: true }
  | { ok: false; reason: "duplicate" | "validation" | "error"; message?: string };

export async function submitEventRegistration(
  supabase: SupabaseClient,
  input: {
    eventId: string;
    registrationPrice: number | null | undefined;
    form: RegistrationFormData;
    userId: string | null;
  },
): Promise<SubmitRegistrationResult> {
  const name = input.form.name.trim();
  const email = input.form.email.trim().toLowerCase();
  const phone = input.form.phone.trim() || null;
  const message = input.form.message.trim() || null;
  const requiresPayment = eventRequiresPayment(input.registrationPrice);

  if (requiresPayment) {
    const cpf = onlyDigits(input.form.cpf);
    if (!isValidCpf(cpf)) {
      return {
        ok: false,
        reason: "validation",
        message: "Informe um CPF válido para continuar com o pagamento.",
      };
    }
  }

  const { data, error } = await supabase
    .from("event_registrations")
    .insert({
      event_id: input.eventId,
      name,
      email,
      phone,
      message,
      user_id: input.userId,
      cpf: requiresPayment ? onlyDigits(input.form.cpf) : null,
      payment_status: requiresPayment ? "pending" : "free",
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { ok: false, reason: "duplicate" };
    }
    console.error("[Supabase event_registrations]", error);
    return { ok: false, reason: "error" };
  }

  return {
    ok: true,
    registrationId: data.id,
    requiresPayment,
  };
}

export async function startRegistrationPayment(
  registrationId: string,
): Promise<{ ok: true; url: string } | { ok: false; message: string }> {
  const res = await fetch(
    `/api/events/registrations/${encodeURIComponent(registrationId)}/payment`,
    { method: "POST" },
  );

  if (res.status === 503) {
    return {
      ok: false,
      message:
        "Pagamento online indisponível no momento. Tente mais tarde ou fale com a igreja.",
    };
  }

  if (!res.ok) {
    let message = "Não foi possível abrir o pagamento. Tente novamente.";
    try {
      const json = (await res.json()) as { message?: string };
      if (json.message) message = json.message;
    } catch {
      /* ignore */
    }
    return { ok: false, message };
  }

  const json = (await res.json()) as { url?: string };
  if (!json.url) {
    return { ok: false, message: "Resposta de pagamento inválida." };
  }
  return { ok: true, url: json.url };
}

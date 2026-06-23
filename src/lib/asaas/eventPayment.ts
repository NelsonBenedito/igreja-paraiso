import { asaasRequest } from "./client";

type AsaasCustomer = { id: string };
type AsaasCustomerList = { data: AsaasCustomer[] };
type AsaasPayment = {
  id: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
};

export type CreateEventRegistrationChargeInput = {
  registrationId: string;
  customerName: string;
  cpf: string;
  email: string;
  phone?: string | null;
  value: number;
  eventTitle: string;
  successUrl: string;
};

export async function findOrCreateAsaasCustomer(input: {
  name: string;
  cpf: string;
  email: string;
  phone?: string | null;
  externalReference: string;
}): Promise<string> {
  const cpfCnpj = input.cpf.replace(/\D/g, "");
  const list = await asaasRequest<AsaasCustomerList>(
    `/v3/customers?cpfCnpj=${encodeURIComponent(cpfCnpj)}&limit=1`,
    { method: "GET" },
  );
  if (list.data?.[0]?.id) return list.data[0].id;

  const mobileDigits = input.phone?.replace(/\D/g, "") ?? "";
  const mobilePhone =
    mobileDigits.length >= 10 && mobileDigits.length <= 11
      ? mobileDigits
      : undefined;

  const created = await asaasRequest<AsaasCustomer>("/v3/customers", {
    method: "POST",
    body: JSON.stringify({
      name: input.name,
      cpfCnpj,
      email: input.email,
      ...(mobilePhone ? { mobilePhone } : {}),
      externalReference: input.externalReference,
      notificationDisabled: false,
    }),
  });
  return created.id;
}

export async function createEventRegistrationCharge(
  input: CreateEventRegistrationChargeInput,
): Promise<{ paymentId: string; invoiceUrl: string; customerId: string }> {
  const customerId = await findOrCreateAsaasCustomer({
    name: input.customerName,
    cpf: input.cpf,
    email: input.email,
    phone: input.phone,
    externalReference: input.registrationId,
  });

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3);
  const dueDateStr = dueDate.toISOString().slice(0, 10);

  const isLocalSuccessUrl = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(
    input.successUrl,
  );
  const allowCallback =
    process.env.NODE_ENV === "production" &&
    process.env.ASAAS_PAYMENT_CALLBACK !== "false" &&
    !isLocalSuccessUrl;

  const payment = await asaasRequest<AsaasPayment>("/v3/payments", {
    method: "POST",
    body: JSON.stringify({
      customer: customerId,
      billingType: "PIX",
      value: Math.round(input.value * 100) / 100,
      dueDate: dueDateStr,
      description: `Inscrição: ${input.eventTitle}`.slice(0, 500),
      externalReference: input.registrationId,

      /*  callback: {
         successUrl: input.successUrl,
         autoRedirect: true,
       }, */
    }),
  });

  const invoiceUrl = payment.invoiceUrl || payment.bankSlipUrl;
  if (!invoiceUrl) {
    throw new Error("Asaas não retornou URL de pagamento");
  }

  return {
    paymentId: payment.id,
    invoiceUrl,
    customerId,
  };
}

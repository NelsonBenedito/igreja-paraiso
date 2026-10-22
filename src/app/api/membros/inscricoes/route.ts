import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { fetchMyRegistrations } from "@/lib/events/client";

export const dynamic = "force-dynamic";

/**
 * GET /api/membros/inscricoes → `{ eventIds }` do membro autenticado.
 *
 * A API exige o segredo de participante (`x-participant-secret`), que só existe
 * no servidor; por isso o navegador consulta as inscrições por aqui. O e-mail
 * vem sempre da sessão — nunca da query. Sem sessão → 401. Falha da API →
 * 200 `{ eventIds: [] }`, para a interface degradar sem quebrar.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!user.email) {
    return NextResponse.json({ eventIds: [] });
  }

  try {
    const { items } = await fetchMyRegistrations({ email: user.email, userId: user.id });
    return NextResponse.json({ eventIds: items.map((r) => r.eventId) });
  } catch (error) {
    console.warn("[membros/inscricoes] não foi possível carregar as inscrições:", error);
    return NextResponse.json({ eventIds: [] });
  }
}

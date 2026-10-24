import { NextResponse } from "next/server";
import { fetchPublicEvents } from "@/lib/events/client";
import { isPublicApiConfigured } from "@/lib/public-api/env";
import { montarProjecaoAgenda } from "@/lib/projecao/agenda";

/**
 * Dados da tela de projeção (`/projecao-agenda`). Mesma origem da página, então
 * não depende do CORS da API. A lista vem do cache de eventos do site (até 60 s).
 * Em falha responde 503: a página ignora e mantém a última agenda boa na tela.
 */
export const dynamic = "force-dynamic";

const SEM_CACHE = { "Cache-Control": "no-store" };

export async function GET() {
  if (!isPublicApiConfigured()) {
    return NextResponse.json({ message: "API pública não configurada" }, { status: 503, headers: SEM_CACHE });
  }
  try {
    const { items } = await fetchPublicEvents({ upcomingOnly: true });
    return NextResponse.json(montarProjecaoAgenda(items), { headers: SEM_CACHE });
  } catch (error) {
    console.warn("[projecao-agenda] falha ao buscar eventos:", error);
    return NextResponse.json({ message: "Agenda indisponível" }, { status: 503, headers: SEM_CACHE });
  }
}

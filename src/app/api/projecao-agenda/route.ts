import { NextResponse } from "next/server";
import { EventsApiError, fetchProjectionAgenda, fetchPublicEvents } from "@/lib/events/client";
import { isPublicApiConfigured } from "@/lib/public-api/env";
import { montarProjecaoAgenda, montarProjecaoDaAgenda, type ProjecaoAgenda } from "@/lib/projecao/agenda";

/**
 * Dados da tela de projeção (`/projecao-agenda`). Mesma origem da página, então
 * não depende do CORS da API. A lista junta eventos e programação semanal dos
 * próximos 7 dias, vinda pronta da API (`/projection-agenda`, sem os itens
 * ocultos no painel), e os tópicos fixos ativos (tela "participe"), com o cache
 * de conteúdo do site (até 60 s). API sem `topics` → nenhum tópico.
 * API antiga sem esse endpoint (404) → volta a mostrar só os eventos.
 * Em outra falha responde 503: a página ignora e mantém a última agenda boa na tela.
 */
export const dynamic = "force-dynamic";

const SEM_CACHE = { "Cache-Control": "no-store" };

async function buscarAgenda(): Promise<ProjecaoAgenda> {
  try {
    const { items, topics } = await fetchProjectionAgenda();
    return montarProjecaoDaAgenda(items, new Date(), topics ?? []);
  } catch (error) {
    if (!(error instanceof EventsApiError && error.status === 404)) throw error;
    const { items } = await fetchPublicEvents({ upcomingOnly: true });
    return montarProjecaoAgenda(items);
  }
}

export async function GET() {
  if (!isPublicApiConfigured()) {
    return NextResponse.json({ message: "API pública não configurada" }, { status: 503, headers: SEM_CACHE });
  }
  try {
    return NextResponse.json(await buscarAgenda(), { headers: SEM_CACHE });
  } catch (error) {
    console.warn("[projecao-agenda] falha ao buscar a agenda:", error);
    return NextResponse.json({ message: "Agenda indisponível" }, { status: 503, headers: SEM_CACHE });
  }
}

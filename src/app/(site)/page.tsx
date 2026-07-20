import Hero from "@/components/Hero";
import NewsSection from "@/components/NewsSection";
import ProgramacaoSection from "@/components/Programacao";
import Missions from "@/components/Missions";
import LatestStream from "@/components/LatestStream";
import MissionSection from "@/components/MissionSection";
import CelulasSection from "@/components/CelulasSection";
import OfertorioSection from "@/components/OfertorioSection";
import { createClient } from "@/utils/supabase/server";
import {
  getActiveSchedules,
  getPublicEvents,
  getRegisteredEventIdsForUser,
} from "@/lib/events/data";
import { getSiteContent } from "@/lib/site-content/data";
import { SITE_CONTENT_FALLBACK } from "@/lib/site-content/fallbacks";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [eventsResult, schedulesResult, registeredResult, siteResult] =
    await Promise.allSettled([
      getPublicEvents({ upcomingOnly: true }),
      getActiveSchedules(),
      user?.email
        ? getRegisteredEventIdsForUser(user.email, user.id)
        : Promise.resolve([] as string[]),
      getSiteContent(),
    ]);

  const events = eventsResult.status === "fulfilled" ? eventsResult.value : [];
  const schedules =
    schedulesResult.status === "fulfilled" ? schedulesResult.value : [];
  const registeredEventIds =
    registeredResult.status === "fulfilled" ? registeredResult.value : [];
  const site =
    siteResult.status === "fulfilled"
      ? siteResult.value
      : SITE_CONTENT_FALLBACK;
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Sobre a Igreja */}
      <MissionSection content={site.mission} />

      {/* 3. Programação / Agenda semanal */}
      <ProgramacaoSection schedules={schedules} />

      {/* 4. Células */}
      <CelulasSection content={site.celulas} />

      {/* 5. Eventos — renderização condicional: a seção só existe no DOM
          quando há eventos ativos (Asaas). Sem eventos = nada renderizado,
          nenhum espaço em branco. */}
      {events.length > 0 && (
        <NewsSection events={events} registeredEventIds={registeredEventIds} />
      )}

      {/* 6. Missões / Campos (sobre o lugar — sem nome do time pastoral) */}
      <Missions content={site.churches} />

      {/* 7. Ofertório — CTA claro, antes do rodapé */}
      <OfertorioSection content={site.giving} />

      {/* Transmissão (exceção à hierarquia — mantida ao fim, antes do rodapé) */}
      <LatestStream content={site.youtube} />

      {/* 8. Endereços / Rodapé → renderizado pelo (site)/layout.tsx */}
    </>
  );
}

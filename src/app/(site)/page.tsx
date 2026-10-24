import { Fragment, type ReactNode } from "react";
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
import { getSiteContent, getSiteHomeOrder } from "@/lib/site-content/data";
import { SITE_CONTENT_FALLBACK } from "@/lib/site-content/fallbacks";
import {
  HOME_BLOCKS_DEFAULT,
  type HomeBlock,
} from "@/lib/site-content/home-order";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    eventsResult,
    schedulesResult,
    registeredResult,
    siteResult,
    orderResult,
  ] = await Promise.allSettled([
    getPublicEvents({ upcomingOnly: true }),
    getActiveSchedules(),
    user?.email
      ? getRegisteredEventIdsForUser(user.email, user.id)
      : Promise.resolve([] as string[]),
    getSiteContent(),
    getSiteHomeOrder(),
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
  const order: HomeBlock[] =
    orderResult.status === "fulfilled"
      ? orderResult.value
      : [...HOME_BLOCKS_DEFAULT];

  // Miolo da home: ordem definida no painel (`layout.home`), padrão =
  // Sobre → Programação → Células → Eventos → Missões → Ofertório → Transmissão.
  const blocks: Record<HomeBlock, ReactNode> = {
    // Sobre a Igreja
    mission: <MissionSection content={site.mission} />,

    // Programação / Agenda semanal
    schedules: <ProgramacaoSection schedules={schedules} />,

    // Células
    celulas: <CelulasSection content={site.celulas} />,

    // Eventos — renderização condicional: a seção só existe no DOM quando há
    // eventos ativos (Asaas). Sem eventos = nada renderizado, nenhum espaço
    // em branco.
    events:
      events.length > 0 ? (
        <NewsSection events={events} registeredEventIds={registeredEventIds} />
      ) : null,

    // Missões / Campos (sobre o lugar — sem nome do time pastoral)
    churches: <Missions content={site.churches} />,

    // Ofertório — CTA claro
    giving: <OfertorioSection content={site.giving} />,

    // Transmissão
    youtube: <LatestStream content={site.youtube} />,
  };

  return (
    <>
      {/* Hero — fixo, sempre primeiro */}
      <Hero />

      {order.map((id) => (
        <Fragment key={id}>{blocks[id]}</Fragment>
      ))}

      {/* Endereços / Rodapé → renderizado pelo (site)/layout.tsx */}
    </>
  );
}

import Hero from "@/components/Hero";
import NewsSection from "@/components/NewsSection";
import ProgramacaoSection from "@/components/Programacao";
import Missions from "@/components/Missions";
import LatestStream from "@/components/LatestStream";
import MissionSection from "@/components/MissionSection";
import CelulasSection from "@/components/CelulasSection";
import OfertorioSection from "@/components/OfertorioSection";
import VisitSection from "@/components/VisitSection";
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
      <Hero />

      <MissionSection content={site.mission} />

      <ProgramacaoSection schedules={schedules} />

      <CelulasSection content={site.celulas} />

      <OfertorioSection content={site.giving} />

      <VisitSection content={site.visit} />

      {events.length > 0 && (
        <NewsSection events={events} registeredEventIds={registeredEventIds} />
      )}

      <LatestStream content={site.youtube} />

      <Missions content={site.churches} />
    </>
  );
}

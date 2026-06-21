import Hero from "@/components/Hero";
import NewsSection from "@/components/NewsSection";
import ProgramacaoSection from "@/components/Programacao";
import Missions from "@/components/Missions";
import LatestStream from "@/components/LatestStream";
import Reveal from "@/components/Reveal";
import MissionSection from "@/components/MissionSection";
import CelulasSection from "@/components/CelulasSection";
import { createClient } from "@/utils/supabase/server";
import {
  getActiveSchedules,
  getPublicEvents,
  getRegisteredEventIdsForUser,
} from "@/lib/events/data";
import { MapPin } from 'lucide-react';

export default async function Home() {
  const [eventsResult, schedulesResult] = await Promise.allSettled([
    getPublicEvents({ upcomingOnly: true }),
    getActiveSchedules(),
  ]);

  const events = eventsResult.status === "fulfilled" ? eventsResult.value : [];
  const schedules = schedulesResult.status === "fulfilled" ? schedulesResult.value : [];

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let registeredEventIds: string[] = [];
  if (user?.email) {
    registeredEventIds = await getRegisteredEventIdsForUser(
      user.email,
      user.id,
    );
  }

  return (
    <>
      <Hero />

      <MissionSection />

      <CelulasSection />

      <LatestStream />

      {events.length > 0 && (
        <NewsSection events={events} registeredEventIds={registeredEventIds} />
      )}

      <ProgramacaoSection schedules={schedules} />

      <Missions />

      <section id="onde" className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-8rem)] max-w-[90rem] mx-auto bg-paraiso-blue-dark rounded-[2.5rem] shadow-sm overflow-hidden my-12 py-32 px-6 lg:px-20 border border-slate-100 dark:border-white/5 relative min-h-[80vh] flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2000"
          className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
          alt="Campus"
        />
        <div className="absolute inset-0 bg-paraiso-blue/90 backdrop-blur-[2px]"></div>

        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-none">
              VENHA NOS <br />
              <span className="text-paraiso-green-light italic font-serif lowercase">visitar</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto mb-16 text-left">
              <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-4 mb-4 text-paraiso-green-light">
                  <MapPin size={32} />
                  <h3 className="text-lg font-black uppercase tracking-widest">Endereço</h3>
                </div>
                <p className="text-base text-slate-200 font-medium leading-relaxed">
                  Rua Helmut Gums, 438 - Virada<br />
                  Santa Maria de Jetibá - ES<br />
                  CEP 29645-000
                </p>
              </div>

              <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-4 mb-4 text-paraiso-green-light">
                  <MapPin size={32} />
                  <h3 className="text-lg font-black uppercase tracking-widest">Horários</h3>
                </div>
                <p className="text-base text-slate-200 font-medium leading-relaxed">
                  Domingo: 09h e 18h<br />
                  Quinta-feira: 19h30<br />
                  Sábado: 19h30 (Juventude)
                </p>
              </div>
            </div>

            <a
              href="https://maps.app.goo.gl/UsxnnZ69miAvFzvs6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-12 py-5 bg-white text-paraiso-blue rounded-full font-black uppercase tracking-widest text-sm hover:bg-paraiso-green hover:text-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              <MapPin size={18} />
              Ver no Mapa
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}

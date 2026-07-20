import React from "react";
import Reveal from "@/components/Reveal";
import { MapPin, Info } from "lucide-react";
import Link from "next/link";
import type { SiteVisit } from "@/lib/site-content/types";

interface VisitSectionProps {
  content: SiteVisit;
}

/** Bloco "Venha nos visitar" (#onde) — textos e imagem vêm do CMS. */
export default function VisitSection({ content }: VisitSectionProps) {
  const addressLines = content.address.split("\n").filter(Boolean);
  const hoursLines = content.hours.split("\n").filter(Boolean);

  return (
    <section
      id="onde"
      className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-8rem)] max-w-360 mx-auto bg-paraiso-blue-dark rounded-[2.5rem] shadow-sm overflow-hidden my-6 md:my-10 py-20 md:py-28 px-6 md:px-12 lg:px-20 border border-slate-100 dark:border-white/5 relative min-h-[60vh] flex items-center justify-center"
    >
      <img
        src={content.backgroundImage}
        className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
        alt="Campus"
      />
      <div className="absolute inset-0 bg-paraiso-blue/90 backdrop-blur-[2px]" />

      <div className="flex justify-start text-left w-full px-6 relative z-10 text-white">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-none">
            {content.titlePart1} <br />
            <span className="text-paraiso-green-light italic font-serif lowercase">
              {content.titleHighlight}
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto mb-16 text-left">
            <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-4 mb-4 text-paraiso-green-light">
                <MapPin size={32} />
                <h3 className="text-lg font-black uppercase tracking-widest">
                  {content.addressTitle}
                </h3>
              </div>
              <p className="text-base text-slate-200 font-medium leading-relaxed">
                {addressLines.map((line, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </p>
            </div>

            <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-4 mb-4 text-paraiso-green-light">
                <MapPin size={32} />
                <h3 className="text-lg font-black uppercase tracking-widest">
                  {content.hoursTitle}
                </h3>
              </div>
              <p className="text-base text-slate-200 font-medium leading-relaxed">
                {hoursLines.map((line, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-row gap-4">
            <a
              href={content.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-paraiso-blue rounded-full font-black uppercase tracking-widest text-xs hover:bg-paraiso-green hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              <MapPin size={16} />
              Como Chegar (Sede)
            </a>
            <Link
              href="/nossas-igrejas"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-transparent border-2 border-white hover:bg-white hover:text-paraiso-blue text-white rounded-full font-black uppercase tracking-widest text-xs transition-all"
            >
              <Info size={16} />
              Nossas Igrejas
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

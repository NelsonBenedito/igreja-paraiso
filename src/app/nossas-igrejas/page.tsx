import Image from "next/image";
import { MapPin, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content/data";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Nossas Igrejas | Igreja Paraíso",
  description: "Conheça nossas filiais e campos de atuação em diversas cidades.",
};

/** URL de embed do Google Maps sem necessidade de API key. */
function mapEmbedUrl(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export default async function NossasIgrejasPage() {
  const site = await getSiteContent();
  const { churches } = site;

  // Sede primeiro via isHeadquarters (não pela ordem do array).
  const items = [...churches.items].sort((a, b) => {
    if (a.isHeadquarters === b.isHeadquarters) return 0;
    return a.isHeadquarters ? -1 : 1;
  });

  return (
    <div className="bg-slate-50 dark:bg-paraiso-blue-deep min-h-screen pb-24 pt-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-paraiso-green transition-colors mb-8 text-sm font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Voltar para o início
        </Link>

        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-paraiso-green/10 text-paraiso-green text-xs font-black uppercase tracking-widest border border-paraiso-green/20">
            {churches.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-paraiso-blue-dark dark:text-white tracking-tighter uppercase leading-none">
            {churches.titlePart1}{" "}
            <span className="text-paraiso-green italic font-serif lowercase">
              {churches.titleHighlight}
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-300 text-lg font-medium leading-relaxed">
            {churches.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {items.map((church) => {
            const query = church.address?.trim() || church.location || church.name;
            return (
              <div
                key={church.name}
                className="group overflow-hidden rounded-[2.5rem] bg-white dark:bg-paraiso-blue-dark shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-white/5 flex flex-col"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-200">
                  <Image
                    src={church.image}
                    alt={church.name}
                    fill
                    className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-paraiso-blue-deep/60 via-transparent to-transparent z-10" />
                  <span className="absolute top-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm dark:bg-paraiso-blue-dark/90 text-slate-800 dark:text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow z-20">
                    <MapPin size={10} className="text-paraiso-green" />
                    {church.isHeadquarters ? "Sede" : church.location.split(" - ")[0]}
                  </span>
                </div>

                <div className="p-8 flex flex-col gap-5 flex-grow">
                  <h3 className="font-black text-2xl text-slate-800 dark:text-white uppercase tracking-tight leading-tight group-hover:text-paraiso-green transition-colors">
                    {church.name}
                  </h3>

                  {/* Endereço completo */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-paraiso-green shrink-0 mt-0.5" />
                    <p className="text-sm md:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                      {church.address?.trim() || church.location}
                    </p>
                  </div>

                  {/* Mapa integrado */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-100 dark:border-white/10 bg-slate-100 dark:bg-white/5">
                    <iframe
                      title={`Mapa — ${church.name}`}
                      src={mapEmbedUrl(query)}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 h-full w-full border-0"
                      allowFullScreen
                    />
                  </div>

                  {church.mapsUrl?.trim() ? (
                    <div className="mt-auto pt-2">
                      <Button
                        asChild
                        className="w-full bg-paraiso-blue hover:bg-paraiso-green text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <a href={church.mapsUrl} target="_blank" rel="noopener noreferrer">
                          <MapPin size={14} /> Como Chegar <ExternalLink size={12} />
                        </a>
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

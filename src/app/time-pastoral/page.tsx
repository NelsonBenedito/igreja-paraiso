import Image from "next/image";
import { MapPin, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content/data";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Time Pastoral | Igreja Paraíso",
  description: "Conheça os pastores e líderes que servem à nossa comunidade.",
};

export default async function TimePastoralPage() {
  const site = await getSiteContent();
  const { pastors } = site;

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
            {pastors.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-paraiso-blue-dark dark:text-white tracking-tighter uppercase leading-none">
            {pastors.titlePart1}{" "}
            <span className="text-paraiso-green italic font-serif lowercase">
              {pastors.titleHighlight}
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-300 text-lg font-medium leading-relaxed">
            {pastors.intro}
          </p>
        </div>

        {/* Destaque do presidente — ainda não modelado no CMS; mantido local */}
        <div className="max-w-4xl mx-auto mb-24 bg-white dark:bg-paraiso-blue-dark rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 dark:border-white/5 p-8 md:p-12 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative aspect-[4/5] bg-slate-100 rounded-3xl overflow-hidden shadow-md ring-1 ring-slate-100 dark:ring-white/10">
            <Image
              src="/pastor.jpg"
              alt="Pr. Evandro Menezes"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paraiso-green/15 text-paraiso-green text-xs font-black uppercase tracking-widest">
              Pastor Presidente
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-paraiso-blue-dark dark:text-white uppercase tracking-tight">
              Pr. Evandro Menezes
            </h2>
            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-base">
              Líder visionário e dedicado ao ministério pastoral, o Pr. Evandro
              tem servido a esta geração com paixão pelo Evangelho, amor pelas
              pessoas e compromisso com o crescimento do Reino de Deus.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <p>📍 Atuação: Geral / Presidência do Campo</p>
              <p>
                📖 Casado com Ricelle Menezes Gonçalves, parceira de vida e
                ministério.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
            <h3 className="text-2xl md:text-3xl font-black text-paraiso-blue-dark dark:text-white uppercase tracking-tight">
              Pastores e Liderança do Campo
            </h3>
            <div className="w-16 h-1 bg-paraiso-green mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastors.items.map((pastor) => (
              <Card
                key={pastor.name}
                className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-none shadow-md rounded-[2rem] h-full flex flex-col bg-white dark:bg-paraiso-blue-dark"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-200">
                  <Image
                    src={pastor.image}
                    alt={pastor.name}
                    fill
                    className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-paraiso-blue-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <CardContent className="p-8 flex flex-col gap-3 flex-grow relative">
                  <div className="flex flex-col gap-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-paraiso-green/10 text-paraiso-green text-[10px] font-black uppercase tracking-widest w-fit mb-2">
                      <User size={10} />
                      {pastor.role.includes("Auxiliar") ? "Auxiliar" : "Local"}
                    </div>
                    <h4
                      className="font-black text-xl text-slate-800 dark:text-white uppercase tracking-tight leading-tight line-clamp-1"
                      title={pastor.name}
                    >
                      {pastor.name}
                    </h4>
                    <p className="text-sm font-bold text-paraiso-green uppercase tracking-wide">
                      {pastor.role}
                    </p>
                  </div>
                  <div className="mt-auto pt-4 flex items-center gap-2 text-slate-400 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-t border-slate-100 dark:border-white/5">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-paraiso-green" />
                    <span>{pastor.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getSiteContent } from "@/lib/site-content/data";

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

        {/* Grid limpa: apenas foto e nome (sem cargo, sem campus). */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
          {pastors.items.map((pastor) => (
            <div key={pastor.name} className="group flex flex-col">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-slate-200 dark:bg-white/5 shadow-md ring-1 ring-slate-100 dark:ring-white/10">
                <Image
                  src={pastor.image}
                  alt={pastor.name}
                  fill
                  className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <h3
                className="mt-5 text-center font-black text-base md:text-lg text-paraiso-blue-dark dark:text-white uppercase tracking-tight leading-tight"
                title={pastor.name}
              >
                {pastor.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

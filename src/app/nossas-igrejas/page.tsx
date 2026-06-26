import Image from "next/image";
import { MapPin, User, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { MISSION_CHURCHES } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Nossas Igrejas | Igreja Paraíso",
  description: "Conheça nossas filiais e campos de atuação em diversas cidades.",
};

export default function NossasIgrejasPage() {
  return (
    <div className="bg-slate-50 dark:bg-paraiso-blue-deep min-h-screen pb-24 pt-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Voltar */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-paraiso-green transition-colors mb-8 text-sm font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Voltar para o início
        </Link>

        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-paraiso-green/10 text-paraiso-green text-xs font-black uppercase tracking-widest border border-paraiso-green/20">
            Onde Estamos
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-paraiso-blue-dark dark:text-white tracking-tighter uppercase leading-none">
            Nossas <span className="text-paraiso-green italic font-serif lowercase">igrejas</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-300 text-lg font-medium leading-relaxed">
            Estamos presentes em diversas cidades, servindo à comunidade e espalhando a palavra de Deus. Venha nos fazer uma visita!
          </p>
        </div>

        {/* Grid de Igrejas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MISSION_CHURCHES.map((church) => (
            <Card 
              key={church.id} 
              className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-none shadow-md rounded-[2.5rem] h-full flex flex-col bg-white dark:bg-paraiso-blue-dark"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200">
                <Image
                  src={church.image}
                  alt={church.name}
                  fill
                  className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-paraiso-blue-deep/60 via-transparent to-transparent z-10" />
                
                {/* Tag de Cidade */}
                <span className="absolute top-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm dark:bg-paraiso-blue-dark/90 text-slate-800 dark:text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow z-20">
                  <MapPin size={10} className="text-paraiso-green" />
                  {church.location.split(" - ")[0]}
                </span>
              </div>
              <CardContent className="p-8 flex flex-col gap-4 flex-grow relative">
                <div className="space-y-1">
                  <h3 className="font-black text-xl text-slate-800 dark:text-white uppercase tracking-tight leading-tight group-hover:text-paraiso-green transition-colors">
                    {church.name}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <User size={12} className="text-paraiso-green" />
                    Liderança: {church.pastor}
                  </p>
                </div>
                
                <div className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed min-h-[3rem]">
                  {church.address}
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
                  <Button 
                    asChild 
                    className="w-full bg-paraiso-blue hover:bg-paraiso-green text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                  >
                    <a 
                      href={church.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin size={14} /> Ver no Mapa <ExternalLink size={12} />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}

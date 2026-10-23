import Link from "next/link";
import ImageWithFallback from "@/components/ImageWithFallback";
import { getPublicEvents } from "@/lib/events/data";
import { eventCardContent, formatEventDate } from "@/lib/events/display";
import { Calendar, Clock, MapPin, Tag } from "lucide-react";

export default async function EventsPage() {
    const events = await getPublicEvents({ upcomingOnly: true }).catch((error) => {
        console.error("[events/page] API indisponível, renderizando lista vazia:", error);
        return [];
    });

    return (
        <div className="bg-slate-50 min-h-screen pb-20 pt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-paraiso-green/10 text-paraiso-green text-xs font-black uppercase tracking-widest border border-paraiso-green/20 mb-4">
                        Agenda
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-paraiso-blue-dark tracking-tighter mb-4">
                        Próximos Eventos
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Fique por dentro de tudo o que acontece na Igreja Paraíso. Participe e traga sua família!
                    </p>
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-24 text-slate-400">
                        <Calendar size={56} className="mx-auto mb-4 opacity-30" />
                        <p className="text-xl font-bold">Nenhum evento programado no momento.</p>
                        <p className="text-sm mt-2">Volte em breve para conferir as novidades!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => {
                            const card = eventCardContent(event);
                            return (
                            <Link
                                key={event.id}
                                href={`/evento/${event.id}`}
                                className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                <div className="relative h-52 w-full overflow-hidden bg-slate-200">
                                    <ImageWithFallback
                                        src={card.imageUrl}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        fallback={
                                            <div className="w-full h-full flex items-center justify-center bg-paraiso-blue-dark/10">
                                                <Calendar size={40} className="text-paraiso-blue-dark/30" />
                                            </div>
                                        }
                                    />
                                    {card.tag && (
                                        <span className="absolute top-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-paraiso-blue-dark text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow">
                                            <Tag size={10} />
                                            {card.tag}
                                        </span>
                                    )}
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 text-paraiso-green font-bold text-sm mb-3">
                                        <Calendar size={15} />
                                        <span>{formatEventDate(event.date)}</span>
                                    </div>

                                    <h2 className="text-xl font-black text-slate-800 mb-2 group-hover:text-paraiso-blue-dark transition-colors leading-tight">
                                        {event.title}
                                    </h2>

                                    {card.text && (
                                        <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                                            {card.text}
                                        </p>
                                    )}

                                    <div className="space-y-1.5 mt-auto pt-4 border-t border-slate-100 text-xs text-slate-500">
                                        {(event.time_start || event.time_end) && (
                                            <div className="flex items-center gap-2">
                                                <Clock size={13} className="text-slate-400" />
                                                <span>
                                                    {event.time_start?.slice(0, 5)}
                                                    {event.time_end && ` – ${event.time_end.slice(0, 5)}`}
                                                </span>
                                            </div>
                                        )}
                                        {event.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin size={13} className="text-slate-400" />
                                                <span>{event.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

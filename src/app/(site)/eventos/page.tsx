import Link from "next/link";
import ImageWithFallback from "@/components/ImageWithFallback";
import { getPublicEvents } from "@/lib/events/data";
import { eventCardContent, formatEventDate } from "@/lib/events/display";
import { ArrowRight, CalendarDays } from "lucide-react";
import { SectionLabel, SectionTitle, Period } from "@/components/site/Editorial";

export default async function EventsPage() {
    const events = await getPublicEvents({ upcomingOnly: true }).catch((error) => {
        console.error("[events/page] API indisponível, renderizando lista vazia:", error);
        return [];
    });

    return (
        <div className="min-h-screen bg-paper text-ink">
            <div className="mx-auto max-w-[82rem] px-5 pb-24 pt-32 md:px-16 md:pb-32 md:pt-40">
                <header className="mb-14 border-b border-hairline pb-10 md:mb-20 md:pb-14">
                    <SectionLabel numbered={false} className="mb-6">
                        Agenda
                    </SectionLabel>
                    <SectionTitle as="h1" size="xl">
                        Eventos<Period />
                    </SectionTitle>
                    <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
                        O que vem por aí na Igreja Paraíso.
                    </p>
                </header>

                {events.length === 0 ? (
                    <div className="py-16 text-ink-muted">
                        <p className="text-xl font-medium text-ink">Nenhum evento programado no momento.</p>
                        <p className="mt-2 text-sm">Volte em breve.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => {
                            const card = eventCardContent(event);
                            return (
                            <Link
                                key={event.id}
                                href={`/evento/${event.id}`}
                                className="group flex h-full flex-col"
                            >
                                <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-md border border-hairline bg-paper-soft">
                                    <ImageWithFallback
                                        src={card.imageUrl}
                                        alt={event.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                        fallback={
                                            <div className="flex h-full w-full items-center justify-center bg-paper-soft">
                                                <CalendarDays className="h-10 w-10 text-ink-muted/50" />
                                            </div>
                                        }
                                    />
                                </div>

                                <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
                                    <span>
                                        <span className="text-detail" aria-hidden="true">●</span>{" "}
                                        {formatEventDate(event.date)}
                                    </span>
                                    {(event.time_start || event.time_end) && (
                                        <span>
                                            {event.time_start?.slice(0, 5)}
                                            {event.time_end && ` – ${event.time_end.slice(0, 5)}`}
                                        </span>
                                    )}
                                    {event.location && <span>{event.location}</span>}
                                </div>

                                <h2 className="m-0 mb-2 text-2xl font-medium leading-tight tracking-[-0.02em] text-ink transition-colors group-hover:text-detail">
                                    {event.title}
                                </h2>

                                {card.text && (
                                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-ink-muted">
                                        {card.text}
                                    </p>
                                )}

                                <div className="mt-auto flex items-center justify-between gap-4 border-t border-hairline pt-4">
                                    <span className="text-[15px] text-ink-muted">{card.tag ?? ""}</span>
                                    <span className="inline-flex items-center gap-2.5 text-sm font-medium text-ink transition-colors group-hover:text-detail">
                                        Ver evento
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-paraiso-green text-white">
                                            <ArrowRight size={12} strokeWidth={2.2} />
                                        </span>
                                    </span>
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

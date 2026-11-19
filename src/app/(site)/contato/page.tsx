import type { ReactNode } from "react";
import {
    EditorialSection,
    Highlight,
    Period,
    PillLink,
    SectionLabel,
    SectionTitle,
} from "@/components/site/Editorial";
import { getActiveSchedules } from "@/lib/events/data";
import { buildContactView } from "@/lib/contact/view";
import { fetchSiteSections } from "@/lib/site-content/data";

const ROW =
    "grid grid-cols-1 gap-2 border-b border-hairline py-6 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-8 md:py-8";
const ROW_LABEL = "text-xs font-medium uppercase tracking-[0.16em] text-ink-muted md:pt-1.5";
const ROW_VALUE = "text-lg tracking-[-0.01em] md:text-[1.375rem]";
const LINK = "transition-colors hover:text-detail";

function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className={ROW}>
            <dt className={ROW_LABEL}>{label}</dt>
            <dd className="m-0 min-w-0">{children}</dd>
        </div>
    );
}

export default async function ContactPage() {
    const [sectionsResult, schedulesResult] = await Promise.allSettled([
        fetchSiteSections(),
        getActiveSchedules(),
    ]);
    const { address, phone, phoneHref, email, mapsUrl, schedules } = buildContactView(
        sectionsResult.status === "fulfilled" ? sectionsResult.value : null,
        schedulesResult.status === "fulfilled" ? schedulesResult.value : [],
    );
    const hasContact = Boolean(address || mapsUrl || phone || email);

    return (
        <div className="bg-paper text-ink">
            <header className="mx-auto max-w-[82rem] px-5 pt-32 pb-16 md:px-16 md:pt-40 md:pb-24">
                <SectionLabel numbered={false} className="mb-6">
                    Contato
                </SectionLabel>
                <SectionTitle as="h1" size="xl">
                    Fale <Highlight>conosco</Highlight>
                    <Period />
                </SectionTitle>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
                    Pedidos de oração, dúvidas ou uma visita.
                </p>
            </header>

            {hasContact && (
                <EditorialSection label="Onde estamos" numbered={false}>
                    <dl className="m-0 border-t border-ink">
                        {(address || mapsUrl) && (
                            <Row label="Endereço">
                                {address && <p className={`m-0 whitespace-pre-line ${ROW_VALUE}`}>{address}</p>}
                                {mapsUrl && (
                                    <PillLink href={mapsUrl} variant="soft" arrow="up-right" className={address ? "mt-5" : undefined}>
                                        Abrir no Google Maps
                                    </PillLink>
                                )}
                            </Row>
                        )}

                        {phone && (
                            <Row label="Telefone">
                                {phoneHref ? (
                                    <a href={phoneHref} className={`${ROW_VALUE} ${LINK}`}>
                                        {phone}
                                    </a>
                                ) : (
                                    <p className={`m-0 ${ROW_VALUE}`}>{phone}</p>
                                )}
                            </Row>
                        )}

                        {email && (
                            <Row label="E-mail">
                                <a href={`mailto:${email}`} className={`break-all ${ROW_VALUE} ${LINK}`}>
                                    {email}
                                </a>
                            </Row>
                        )}
                    </dl>
                </EditorialSection>
            )}

            {schedules.length > 0 && (
                <EditorialSection label="Cultos" numbered={false} tone="soft">
                    <SectionTitle className="mb-10 md:mb-14">
                        Horários de culto
                        <Period />
                    </SectionTitle>
                    <ul className="m-0 list-none border-t border-ink p-0">
                        {schedules.map((item) => (
                            <li
                                key={item.id}
                                className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 border-b border-hairline py-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,2fr)] md:py-7"
                            >
                                <span className="text-xl font-medium tracking-[-0.02em] md:text-[1.625rem]">
                                    {item.day}
                                </span>
                                <span className="text-xl font-light tabular-nums text-detail md:text-[1.625rem]">
                                    {item.time}
                                </span>
                                <span className="col-span-2 min-w-0 text-sm text-ink-muted md:col-span-1 md:text-[1.0625rem]">
                                    {item.title}
                                </span>
                            </li>
                        ))}
                    </ul>
                </EditorialSection>
            )}

            {!hasContact && schedules.length === 0 && (
                <div className="border-t border-hairline">
                    <p className="mx-auto max-w-[82rem] px-5 py-20 text-sm text-ink-muted md:px-16">
                        Contatos indisponíveis no momento.
                    </p>
                </div>
            )}
        </div>
    );
}

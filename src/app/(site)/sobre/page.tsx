import Image from "next/image";
import ImageWithFallback from "@/components/ImageWithFallback";
import {
    EditorialSection,
    Highlight,
    Period,
    SectionLabel,
    SectionTitle,
    TextLink,
} from "@/components/site/Editorial";
import { getSiteContent } from "@/lib/site-content/data";

export default async function AboutPage() {
    // Lista vem do painel (pastors.items); o bloco do Presidente é texto institucional.
    const { pastors } = await getSiteContent();

    return (
        <div className="bg-paper text-ink">
            <header className="mx-auto max-w-[82rem] px-5 pt-32 pb-16 md:px-16 md:pt-40 md:pb-24">
                <SectionLabel numbered={false} className="mb-6">
                    A igreja
                </SectionLabel>
                <SectionTitle as="h1" size="xl">
                    Sobre a Igreja <Highlight>Paraíso</Highlight>
                    <Period />
                </SectionTitle>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
                    Casa de Deus, minha família.
                </p>
            </header>

            <EditorialSection label="Presidente" numbered={false}>
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
                    <div className="relative aspect-[4/5] overflow-hidden border border-hairline bg-paper-soft">
                        <Image
                            src="/pastor.jpg"
                            alt="Pr. Evandro Menezes"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>

                    <div className="flex flex-col justify-end">
                        <SectionTitle className="mb-10">
                            Pr. Evandro Menezes
                            <Period />
                        </SectionTitle>

                        <dl className="m-0 border-t border-ink">
                            <div className="grid grid-cols-1 gap-1 border-b border-hairline py-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6">
                                <dt className="text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">
                                    Formação
                                </dt>
                                <dd className="m-0 text-base leading-relaxed">
                                    Mestre em Teologia pela Eastern University (Pensilvânia, EUA).
                                </dd>
                            </div>
                            <div className="grid grid-cols-1 gap-1 border-b border-hairline py-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6">
                                <dt className="text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">
                                    Família
                                </dt>
                                <dd className="m-0 text-base leading-relaxed">
                                    Casado com Ricelle Menezes Gonçalves.
                                </dd>
                            </div>
                        </dl>

                        <div className="mt-8">
                            <TextLink href="https://www.instagram.com/prevandromenezes/">Instagram</TextLink>
                        </div>
                    </div>
                </div>
            </EditorialSection>

            <EditorialSection label="Pastores" numbered={false} tone="soft">
                <SectionTitle className="mb-6">
                    Pastores e <Highlight>missões</Highlight>
                    <Period />
                </SectionTitle>
                <p className="mb-10 max-w-xl text-base leading-relaxed text-ink-muted md:mb-14">
                    Quem cuida das igrejas filiais e das missões.
                </p>

                {pastors.items.length === 0 ? (
                    <p className="m-0 border-t border-ink py-10 text-sm text-ink-muted">
                        Nenhum pastor disponível no momento.
                    </p>
                ) : (
                    <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-10 border-t border-ink p-0 pt-10 sm:grid-cols-2 lg:grid-cols-3">
                        {pastors.items.map((pastor) => (
                            <PastorItem key={pastor.name} name={pastor.name} image={pastor.image} />
                        ))}
                    </ul>
                )}
            </EditorialSection>
        </div>
    );
}

function PastorItem({ name, image }: { name: string; image: string }) {
    return (
        <li className="group">
            <div className="relative aspect-square w-full overflow-hidden border border-hairline bg-paper">
                <ImageWithFallback
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            </div>
            <h3
                className="mt-4 line-clamp-1 text-lg font-medium tracking-[-0.02em] md:text-xl"
                title={name}
            >
                {name}
            </h3>
        </li>
    );
}

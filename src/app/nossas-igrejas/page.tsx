import ImageWithFallback from "@/components/ImageWithFallback";
import { getSiteContent } from "@/lib/site-content/data";
import type { SiteChurch } from "@/lib/site-content/types";
import { SectionLabel, SectionTitle, Highlight, Period } from "@/components/site/Editorial";

export const metadata = {
  title: "Nossas Igrejas | Igreja Paraíso",
  description: "Conheça nossas filiais e campos de atuação em diversas cidades.",
};

/** URL de embed do Google Maps sem necessidade de API key. */
function mapEmbedUrl(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

/** Minúsculas e sem acento, para comparar cidade com nome/endereço. */
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

/**
 * Cidade (parte antes de " - " em `location`) só quando ela ainda não aparece
 * no nome nem no endereço, para não repetir a mesma informação no cartão.
 */
function cityIfNew(church: SiteChurch, address: string) {
  const city = church.location?.split(" - ")[0]?.trim();
  if (!city) return null;
  const c = normalize(city);
  if (normalize(church.name).includes(c) || normalize(address).includes(c)) return null;
  return city;
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
    <div className="bg-paper text-ink">
      <header className="mx-auto max-w-[82rem] px-5 pb-16 pt-32 md:px-16 md:pb-24 md:pt-40">
        {churches.badge ? (
          <SectionLabel numbered={false} className="mb-6">
            {churches.badge}
          </SectionLabel>
        ) : null}
        <SectionTitle as="h1" size="xl" className="max-w-[56rem]">
          {churches.titlePart1} <Highlight>{churches.titleHighlight}</Highlight>
          <Period />
        </SectionTitle>
        {churches.intro ? (
          <p className="m-0 mt-8 max-w-[40rem] text-[17px] leading-[1.65] text-ink-muted">
            {churches.intro}
          </p>
        ) : null}
      </header>

      <section className="border-t border-hairline">
        <div className="mx-auto max-w-[82rem] px-5 py-16 md:px-16 md:py-24">
          {items.length === 0 ? (
            <p className="m-0 text-ink-muted">Nenhuma igreja disponível no momento.</p>
          ) : (
            <ul className="m-0 grid list-none grid-cols-1 gap-x-10 gap-y-16 p-0 md:grid-cols-2">
              {items.map((church) => {
                const address = church.address?.trim() || church.location;
                const query = church.address?.trim() || church.location || church.name;
                const city = church.address?.trim() ? cityIfNew(church, address) : null;
                return (
                  <li key={church.name} className="group flex flex-col">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-hairline bg-paper-soft">
                      <ImageWithFallback
                        src={church.image}
                        alt={church.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>

                    <div className="mt-5 flex flex-1 flex-col gap-5 border-t border-hairline pt-5">
                      {church.isHeadquarters ? (
                        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-detail">
                          Sede
                        </span>
                      ) : null}
                      <div>
                        <h2 className="m-0 text-[22px] font-medium leading-tight tracking-[-0.01em] text-ink">
                          {church.name}
                        </h2>
                        {city ? <p className="m-0 mt-1.5 text-sm text-ink-muted">{city}</p> : null}
                        {address ? (
                          <p className="m-0 mt-1.5 text-sm leading-relaxed text-ink-muted">{address}</p>
                        ) : null}
                      </div>

                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-hairline bg-paper-soft">
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
                        <div className="mt-auto">
                          <a
                            href={church.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 border-b border-current pb-1 text-sm font-medium text-ink transition-colors hover:text-detail"
                          >
                            Como chegar <span aria-hidden="true">↗</span>
                          </a>
                        </div>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

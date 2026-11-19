import ImageWithFallback from "@/components/ImageWithFallback";
import { getSiteContent } from "@/lib/site-content/data";
import { SectionLabel, SectionTitle, Highlight, Period } from "@/components/site/Editorial";

export const metadata = {
  title: "Time Pastoral | Igreja Paraíso",
  description: "Conheça os pastores e líderes que servem à nossa comunidade.",
};

export default async function TimePastoralPage() {
  const site = await getSiteContent();
  const { pastors } = site;

  return (
    <div className="bg-paper text-ink">
      <header className="mx-auto max-w-[82rem] px-5 pb-16 pt-32 md:px-16 md:pb-24 md:pt-40">
        {pastors.badge ? (
          <SectionLabel numbered={false} className="mb-6">
            {pastors.badge}
          </SectionLabel>
        ) : null}
        <SectionTitle as="h1" size="xl" className="max-w-[56rem]">
          {pastors.titlePart1} <Highlight>{pastors.titleHighlight}</Highlight>
          <Period />
        </SectionTitle>
        {pastors.intro ? (
          <p className="m-0 mt-8 max-w-[40rem] text-[17px] leading-[1.65] text-ink-muted">
            {pastors.intro}
          </p>
        ) : null}
      </header>

      <section className="border-t border-hairline">
        <div className="mx-auto max-w-[82rem] px-5 py-16 md:px-16 md:py-24">
          {/* Só foto e nome: a API não manda cargo nem campus. */}
          {pastors.items.length === 0 ? (
            <p className="m-0 text-ink-muted">Nenhum pastor disponível no momento.</p>
          ) : (
            <ul className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-12 p-0 sm:grid-cols-3 lg:grid-cols-4">
              {pastors.items.map((pastor) => (
                <li key={pastor.name} className="group flex flex-col">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md border border-hairline bg-paper-soft">
                    <ImageWithFallback
                      src={pastor.image}
                      alt={pastor.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  <h2
                    className="m-0 mt-5 border-t border-hairline pt-4 text-lg font-medium leading-tight tracking-[-0.01em] text-ink md:text-[22px]"
                    title={pastor.name}
                  >
                    {pastor.name}
                  </h2>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

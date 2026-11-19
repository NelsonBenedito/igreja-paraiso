import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PillLink, Period, SectionTitle } from "@/components/site/Editorial";

export const metadata: Metadata = {
  title: "Em breve | Igreja Paraíso",
  description: "O site está em preparação. A campanha Cotas Campus já está no ar.",
};

export default function EmConstrucaoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-5 py-16 text-center font-display text-ink">
      <Link href="/" aria-label="Igreja Paraíso — início" className="mb-12 flex items-center">
        <Image
          src="/IgrejaParaiso.webp"
          alt="Igreja Paraíso"
          width={1529}
          height={461}
          unoptimized
          priority
          className="h-11 w-auto object-contain dark:hidden"
        />
        <Image
          src="/LogoParaisoW.svg"
          alt="Igreja Paraíso"
          width={1920}
          height={562}
          unoptimized
          priority
          className="hidden h-11 w-auto object-contain dark:block"
        />
      </Link>
      <SectionTitle as="h1" size="lg" className="max-w-2xl">
        Em breve
        <Period />
      </SectionTitle>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
        O site está em preparação. A campanha do novo campus já está no ar.
      </p>
      <PillLink href="/cotas/campus" className="mt-10">
        Ver Cotas Campus
      </PillLink>
    </main>
  );
}

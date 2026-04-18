import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Em breve | Igreja Paraíso",
  description:
    "Estamos a preparar o site. A campanha Cotas Campus já está disponível.",
};

export default function EmConstrucaoPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-paraiso-green mb-3">
        Igreja Paraíso
      </p>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 max-w-lg leading-tight">
        Site em preparação
      </h1>
      <p className="mt-4 text-slate-600 max-w-md text-base leading-relaxed">
        O restante do site ainda não está disponível nesta versão. A campanha do
        novo campus já pode ser vista e apoiada no link abaixo.
      </p>
      <Link
        href="/cotas/campus"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-paraiso-green px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-paraiso-blue hover:shadow-lg"
      >
        Ir para Cotas Campus Paraíso
      </Link>
    </main>
  );
}

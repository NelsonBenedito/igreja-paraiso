'use client';

import Link from "next/link";
import Image from "next/image";
import { login, signup, loginWithGoogle } from "@/app/auth/actions";
import { SectionLabel, SectionTitle, Period } from "@/components/site/Editorial";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";

const LABEL_CLASS = "block text-xs font-medium uppercase tracking-[0.16em] text-ink-muted";
const INPUT_CLASS =
    "mt-2 block h-12 w-full rounded-md border border-hairline bg-paper px-4 text-base text-ink placeholder:text-ink-muted/60 transition-colors focus:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-detail/40";

// Botão de envio no visual do PillLink (tinta, círculo verde com seta), com estado de carregamento.
function SubmitButton({ text }: { text: string }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            aria-busy={pending}
            className="inline-flex min-h-12 w-full items-center gap-3.5 rounded-full bg-ink py-1.5 pl-1.5 pr-6 text-sm font-medium text-paper transition-opacity duration-300 hover:opacity-90 disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-detail/40"
        >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paraiso-green text-white">
                {pending ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <ArrowRight size={15} aria-hidden="true" />}
            </span>
            {text}
        </button>
    );
}

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="flex min-h-screen w-full flex-col bg-paper font-display text-ink">
            <header className="border-b border-hairline">
                <div className="mx-auto flex max-w-[82rem] items-center justify-between gap-6 px-5 py-4 md:px-16">
                    <Link href="/" aria-label="Igreja Paraíso — início" className="flex shrink-0 items-center">
                        <Image
                            src="/IgrejaParaiso.webp"
                            alt="Igreja Paraíso"
                            width={1529}
                            height={461}
                            unoptimized
                            priority
                            className="h-10 w-auto object-contain dark:hidden"
                        />
                        <Image
                            src="/LogoParaisoW.svg"
                            alt="Igreja Paraíso"
                            width={1920}
                            height={562}
                            unoptimized
                            priority
                            className="hidden h-10 w-auto object-contain dark:block"
                        />
                    </Link>
                    <Link
                        href="/"
                        className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
                    >
                        Voltar
                    </Link>
                </div>
            </header>

            <main className="mx-auto grid w-full max-w-[82rem] flex-1 gap-12 px-5 py-14 md:px-16 md:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
                <div>
                    <SectionLabel numbered={false} className="mb-6">
                        Igreja Paraíso
                    </SectionLabel>
                    <SectionTitle as="h1" size="lg">
                        {isLogin ? "Área de membros" : "Criar conta"}
                        <Period />
                    </SectionTitle>
                    <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
                        {isLogin
                            ? "Entre com seu e-mail e senha."
                            : "Preencha os dados para criar seu acesso."}
                    </p>
                </div>

                <div className="w-full max-w-md lg:justify-self-end lg:border-l lg:border-hairline lg:pl-16 lg:max-w-none">
                    <form action={isLogin ? login : signup} className="space-y-6">
                        {!isLogin && (
                            <div>
                                <label htmlFor="name" className={LABEL_CLASS}>Nome completo</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Seu nome"
                                    required
                                    className={INPUT_CLASS}
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className={LABEL_CLASS}>E-mail</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="seu@email.com"
                                required
                                className={INPUT_CLASS}
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className={LABEL_CLASS}>Senha</label>
                                {isLogin && (
                                    <Link href="#" className="text-xs font-medium text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline">
                                        Esqueceu?
                                    </Link>
                                )}
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={isLogin ? "current-password" : "new-password"}
                                placeholder="••••••••"
                                required
                                className={INPUT_CLASS}
                            />
                        </div>

                        <div className="pt-2">
                            <SubmitButton text={isLogin ? "Entrar" : "Criar conta"} />
                        </div>
                    </form>

                    <div className="my-8 flex items-center gap-4">
                        <div className="h-px flex-1 bg-hairline" />
                        <span className="shrink-0 text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">ou</span>
                        <div className="h-px flex-1 bg-hairline" />
                    </div>

                    <form action={loginWithGoogle}>
                        <button
                            type="submit"
                            className="flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-hairline bg-paper text-sm font-medium text-ink transition-colors hover:border-ink/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-detail/40"
                        >
                            {/* Google G logo */}
                            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Entrar com Google
                        </button>
                    </form>

                    <p className="mt-8 text-sm text-ink-muted">
                        {isLogin ? "Ainda não tem conta? " : "Já tem conta? "}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="inline cursor-pointer border-0 border-b border-current bg-transparent p-0 pb-0.5 font-medium text-ink transition-colors hover:text-detail"
                        >
                            {isLogin ? "Criar conta" : "Entrar"}
                        </button>
                    </p>
                </div>
            </main>
        </div>
    );
}

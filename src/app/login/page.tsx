'use client';

import Link from "next/link";
import { login, signup } from "@/app/auth/actions"; // verify this exists, yes it was in previous file
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Lock, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useFormStatus } from "react-dom";


// Submit button with loading state
function SubmitButton({ text }: { text: string }) {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full h-14 bg-paraiso-green hover:bg-paraiso-blue text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_10px_30px_rgba(100,167,11,0.3)] hover:shadow-[0_10px_40px_rgba(0,35,80,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group overflow-hidden relative"
        >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-2xl"></div>
            <span className="relative z-10 flex items-center gap-2">
                {pending ? <Loader2 className="animate-spin" /> : text}
                {!pending && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </span>
        </Button>
    )
}

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen w-full flex bg-slate-50 relative overflow-hidden">
            {/* Background Texture/Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-paraiso-green/5 rounded-full blur-[120px]"></div>
                <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] bg-paraiso-blue/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Left Content - Form Area */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center relative z-10 p-8 lg:p-12">
                {/* Back Button - Absolute Position */}
                <div className="absolute top-8 left-8 lg:top-12 lg:left-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-paraiso-blue transition-colors text-xs font-bold uppercase tracking-widest group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Voltar
                    </Link>
                </div>

                <motion.div
                    key={isLogin ? "login" : "signup"}
                    initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-sm mt-16 lg:mt-0"
                >
                    {/* Header */}
                    <div className="mb-12 text-center lg:text-left">

                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                            <img src="/IgrejaParaiso.webp" alt="Logo" className="w-42 object-contain" />
                        </div>

                        <h1 className="text-5xl font-black text-paraiso-blue-dark mb-4 tracking-tighter leading-[0.9]">
                            {isLogin ? (
                                <>ÁREA DE <br /><span className="text-paraiso-green">MEMBROS</span></>
                            ) : (
                                <>CRIAR SUA <br /><span className="text-paraiso-green">CONTA</span></>
                            )}
                        </h1>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed">
                            {isLogin
                                ? "Bem-vindo de volta! Digite suas credenciais para acessar conteúdos exclusivos."
                                : "Preencha seus dados abaixo para se tornar um membro da nossa comunidade digital."
                            }
                        </p>
                    </div>

                    {/* Form */}
                    <form action={isLogin ? login : signup} className="space-y-6">
                        {!isLogin && (
                            <div className="space-y-2 group">
                                <Label htmlFor="name" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-paraiso-blue transition-colors">Nome Completo</Label>
                                <div className="relative">
                                    <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-slate-300 group-focus-within:text-paraiso-green transition-colors">
                                        <User size={20} />
                                    </div>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Seu nome"
                                        required
                                        className="pl-12 h-14 bg-white border-0 border-b-2 border-slate-100 rounded-xl focus:border-paraiso-green focus:ring-0 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all font-medium text-slate-700 placeholder:text-slate-300 text-lg"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2 group">
                            <Label htmlFor="email" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-paraiso-blue transition-colors">Email</Label>
                            <div className="relative">
                                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-slate-300 group-focus-within:text-paraiso-green transition-colors">
                                    <User size={20} />
                                </div>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    required
                                    className="pl-12 h-14 bg-white border-0 border-b-2 border-slate-100 rounded-xl focus:border-paraiso-green focus:ring-0 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all font-medium text-slate-700 placeholder:text-slate-300 text-lg"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="password" className="text-xs font-black text-slate-400 uppercase tracking-widest group-focus-within:text-paraiso-blue transition-colors">Senha</Label>
                                {isLogin && (
                                    <Link href="#" className="text-xs font-bold text-paraiso-green hover:text-paraiso-blue transition-colors">
                                        Esqueceu?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-slate-300 group-focus-within:text-paraiso-green transition-colors">
                                    <Lock size={20} />
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className="pl-12 h-14 bg-white border-0 border-b-2 border-slate-100 rounded-xl focus:border-paraiso-green focus:ring-0 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all font-medium text-slate-700 placeholder:text-slate-300 text-lg"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <SubmitButton text={isLogin ? "Acessar Portal" : "Criar Conta"} />
                        </div>
                    </form>

                    <div className="text-center mt-10">
                        <p className="text-slate-400 text-sm font-medium">
                            {isLogin ? "Ainda não é membro? " : "Já tem uma conta? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-paraiso-blue font-bold hover:text-paraiso-green transition-colors underline decoration-2 decoration-transparent hover:decoration-paraiso-green underline-offset-4 bg-transparent border-0 cursor-pointer p-0 inline"
                            >
                                {isLogin ? "Cadastre-se aqui" : "Faça Login"}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Right Content - Image Area with Unique Shape */}
            <div className="hidden lg:block w-1/2 relative h-screen p-4">
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl"
                >
                    {/* Image */}
                    <img
                        src="/BgIgrejaParaiso.webp"
                        alt="Worship"
                        className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[20s] ease-linear"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-paraiso-blue-dark/90 via-paraiso-blue/40 to-transparent mix-blend-multiply"></div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-16 text-white">
                        <div className="max-w-xl">
                            <div className="w-20 h-1 bg-paraiso-green mb-8"></div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter mb-6 leading-tight">
                                "Venha o Teu Reino"
                            </h2>
                            <p className="text-lg text-white/80 font-medium leading-relaxed">
                                Acesse conteúdos exclusivos, mensagens pastorais e fique por dentro de tudo o que acontece em nossa família.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

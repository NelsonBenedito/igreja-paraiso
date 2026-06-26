'use client';
import React, { useState } from 'react';
import Reveal from '@/components/Reveal';
import { motion } from 'framer-motion';
import { Copy, Check, Heart, HelpCircle, Landmark } from 'lucide-react';
import Link from 'next/link';

const OfertorioSection: React.FC = () => {
    const pixKey = 'projeto@visaodofuturo.com.br';
    const [copied, setCopied] = useState(false);

    const handleCopyPix = () => {
        navigator.clipboard.writeText(pixKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section
            id="ofertorio"
            className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-8rem)] max-w-360 mx-auto bg-slate-50 dark:bg-paraiso-blue-dark/50 rounded-[2.5rem] shadow-sm overflow-hidden my-6 md:my-10 py-16 md:py-20 px-6 md:px-12 lg:px-20 border border-slate-100 dark:border-white/5 relative"
        >
            <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-paraiso-green/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-paraiso-blue/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
                <Reveal>
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
                        <span className="inline-block px-4 py-1 bg-paraiso-green/10 text-paraiso-green text-[10px] font-black uppercase tracking-widest rounded-md">
                            Dízimos e Ofertas
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none text-paraiso-blue dark:text-white">
                            Sua contribuição{' '}
                            <span className="text-paraiso-green italic">edifica</span>{' '}
                            vidas.
                        </h2>
                        <p className="text-base text-slate-500 dark:text-slate-300 font-medium leading-relaxed">
                            Acreditamos que a generosidade é uma resposta de amor à graça de Deus. Ao contribuir, você apoia as ações sociais, o sustento da igreja local e os projetos de expansão do Reino de Deus.
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto mb-14">
                    {/* Card PIX */}
                    <Reveal>
                        <div className="bg-white dark:bg-paraiso-blue-dark border border-slate-100 dark:border-white/5 rounded-3xl p-8 shadow-md relative overflow-hidden h-full justify-between">
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-paraiso-green/5 rounded-full blur-xl pointer-events-none" />
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-paraiso-green/10 flex items-center justify-center mb-6">
                                    <Heart className="w-6 h-6 text-paraiso-green" />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight text-paraiso-blue dark:text-white mb-2">
                                    Contribuição via PIX
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                                    Ideal para ofertas voluntárias, dízimos e contribuições rápidas de qualquer valor. Use a chave PIX abaixo ou copie o endereço.
                                </p>
                            </div>

                            <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4 mt-auto">
                                <div className="overflow-hidden">
                                    <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Chave E-mail</span>
                                    <span className="text-sm md:text-base font-black text-slate-800 dark:text-white truncate block">
                                        {pixKey}
                                    </span>
                                </div>
                                <button
                                    onClick={handleCopyPix}
                                    className="p-3 bg-paraiso-green hover:bg-paraiso-green-light text-white rounded-xl transition-all shadow-md flex items-center justify-center shrink-0"
                                    title="Copiar chave PIX"
                                >
                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </Reveal>

                    {/* Card Contas Bancárias */}
                    <Reveal>
                        <div className="bg-white dark:bg-paraiso-blue-dark border border-slate-100 dark:border-white/5 rounded-3xl p-8 shadow-md relative overflow-hidden h-full flex flex-col justify-between">
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-paraiso-blue/5 rounded-full blur-xl pointer-events-none" />
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-paraiso-blue/10 flex items-center justify-center mb-6">
                                    <Landmark className="w-6 h-6 text-paraiso-blue" />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight text-paraiso-blue dark:text-white mb-2">
                                    Transferência Bancária
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                                    Se preferir transferir via TED/DOC ou depósito identificado direto em conta, utilize os dados da conta oficial da igreja.
                                </p>
                            </div>

                            <div className="space-y-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-5 mt-auto text-sm text-slate-700 dark:text-slate-300 font-medium">
                                <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                                    <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-xs">Banco</span>
                                    <span className="font-black text-slate-800 dark:text-white">Sicoob (756)</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                                    <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-xs">Agência</span>
                                    <span className="font-black text-slate-800 dark:text-white">3007</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                                    <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-xs">Conta Corrente</span>
                                    <span className="font-black text-slate-800 dark:text-white">12.345-6</span>
                                </div>
                                <div className="flex justify-between pb-1">
                                    <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-xs">Favorecido / CNPJ</span>
                                    <span className="font-black text-slate-800 dark:text-white text-right">
                                        Igreja Paraíso<br />
                                        <span className="text-[10px] text-slate-400 font-normal">CNPJ: 12.345.678/0001-90</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>


                <div className="bg-linear-to-r from-paraiso-blue to-paraiso-green/80 text-white rounded-[2rem] p-8 md:p-10 shadow-xl  mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute -right-24 -bottom-24 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="space-y-3 max-w-2xl text-center md:text-left">
                        <span className="inline-block px-3 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-md">
                            Projeto de Expansão
                        </span>
                        <h3 className="text-2xl font-black uppercase tracking-tight leading-tight">
                            Campanha de Cotas do Novo Campus
                        </h3>
                        <p className="text-white/80 text-sm md:text-base font-medium leading-relaxed">
                            Faça parte de algo maior! Ajude a edificar a nova estrutura da nossa sede e áreas geracionais. Adquira ou apoie através das cotas exclusivas de expansão.
                        </p>
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="shrink-0"
                    >
                        <Link
                            href="/cotas/campus"
                            className="inline-flex items-center gap-2 px-6 py-4 bg-white text-paraiso-blue hover:text-white hover:bg-paraiso-blue-dark rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-md"
                        >
                            <HelpCircle size={14} /> Conhecer Campanha
                        </Link>
                    </motion.div>
                </div>

            </div>
        </section>
    );
};

export default OfertorioSection;

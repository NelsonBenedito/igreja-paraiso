'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2, AlertCircle, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { submitEventRegistration } from '@/lib/events/data-client';
import type { SiteEvent } from '@/lib/events/types';
import { formatEventDate } from '@/lib/events/display';

interface Props {
    event: SiteEvent | null;
    onClose: () => void;
    onSuccess?: (eventId: string) => void;
}

type Status = 'idle' | 'loading' | 'success' | 'duplicate' | 'error';

const EventRegistrationModal: React.FC<Props> = ({ event, onClose, onSuccess }) => {
    const supabase = createClient();
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [status, setStatus] = useState<Status>('idle');

    if (!event) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        const { data: { user } } = await supabase.auth.getUser();

        const result = await submitEventRegistration(event.id, {
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim() || null,
            message: form.message.trim() || null,
            userId: user?.id ?? null,
        });

        if (result.ok) {
            setStatus('success');
            onSuccess?.(event.id);
        } else if (result.reason === 'duplicate') {
            setStatus('duplicate');
        } else {
            setStatus('error');
        }
    };

    const reset = () => {
        setForm({ name: '', email: '', phone: '', message: '' });
        setStatus('idle');
    };

    return (
        <AnimatePresence>
            {event && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="relative w-full max-w-lg bg-white dark:bg-[#0f1a2a] rounded-3xl shadow-2xl overflow-hidden pointer-events-auto">

                            {/* Header com imagem */}
                            <div
                                className="relative h-36 flex items-end p-6"
                                style={{
                                    background: event.image_url
                                        ? `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%), url(${event.image_url}) center/cover`
                                        : 'linear-gradient(135deg, #2B4364 0%, #7C9A40 100%)',
                                }}
                            >
                                <div className="flex-1">
                                    {event.tag && (
                                        <span className="px-3 py-1 bg-paraiso-green text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-2 inline-block">
                                            {event.tag}
                                        </span>
                                    )}
                                    <h2 className="text-xl font-black text-white leading-tight">{event.title}</h2>
                                    <p className="text-white/70 text-xs mt-1">
                                        {formatEventDate(event.date)}
                                        {event.time_start && ` · ${event.time_start.slice(0, 5)}`}
                                        {event.location && ` · ${event.location}`}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Conteúdo */}
                            <div className="p-6">
                                {/* Sucesso */}
                                {status === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-6 space-y-4"
                                    >
                                        <CheckCircle2 className="w-16 h-16 text-paraiso-green mx-auto" />
                                        <div>
                                            <h3 className="text-xl font-black text-paraiso-blue dark:text-white mb-2">
                                                Inscrição confirmada!
                                            </h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                                Sua inscrição para <strong>{event.title}</strong> foi realizada com sucesso.
                                                Fique de olho no seu e-mail!
                                            </p>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="px-8 py-3 bg-paraiso-green text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-paraiso-blue transition-all"
                                        >
                                            Fechar
                                        </button>
                                    </motion.div>
                                )}

                                {/* Duplicado */}
                                {status === 'duplicate' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-6 space-y-4"
                                    >
                                        <AlertCircle className="w-16 h-16 text-amber-500 mx-auto" />
                                        <div>
                                            <h3 className="text-xl font-black text-paraiso-blue dark:text-white mb-2">
                                                Você já está inscrito!
                                            </h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                                Este e-mail já foi cadastrado para este evento.
                                            </p>
                                        </div>
                                        <div className="flex gap-3 justify-center">
                                            <button onClick={reset} className="px-6 py-3 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-full hover:border-paraiso-green transition-all">
                                                Tentar outro e-mail
                                            </button>
                                            <button onClick={onClose} className="px-6 py-3 bg-paraiso-green text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-paraiso-blue transition-all">
                                                Fechar
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Erro */}
                                {status === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-6 space-y-4"
                                    >
                                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                                        <div>
                                            <h3 className="text-xl font-black text-paraiso-blue dark:text-white mb-2">Ocorreu um erro</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                                Não foi possível realizar sua inscrição. Tente novamente.
                                            </p>
                                        </div>
                                        <button onClick={reset} className="px-8 py-3 bg-red-500 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-red-600 transition-all">
                                            Tentar novamente
                                        </button>
                                    </motion.div>
                                )}

                                {/* Formulário */}
                                {(status === 'idle' || status === 'loading') && (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                                            Preencha seus dados para garantir sua vaga neste evento.
                                        </p>

                                        {/* Nome */}
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                required
                                                type="text"
                                                placeholder="Seu nome completo"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-paraiso-green transition-colors"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                required
                                                type="email"
                                                placeholder="Seu e-mail"
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-paraiso-green transition-colors"
                                            />
                                        </div>

                                        {/* Telefone */}
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="tel"
                                                placeholder="Telefone / WhatsApp (opcional)"
                                                value={form.phone}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-paraiso-green transition-colors"
                                            />
                                        </div>

                                        {/* Mensagem */}
                                        <div className="relative">
                                            <MessageSquare className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                                            <textarea
                                                rows={2}
                                                placeholder="Alguma observação? (opcional)"
                                                value={form.message}
                                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-paraiso-green transition-colors resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="w-full py-4 bg-paraiso-green text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-paraiso-blue transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
                                        >
                                            {status === 'loading' ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" />
                                                    Confirmando inscrição...
                                                </>
                                            ) : (
                                                'Confirmar Inscrição'
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EventRegistrationModal;

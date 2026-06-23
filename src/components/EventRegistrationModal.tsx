'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Loader2, CheckCircle2, AlertCircle,
    User, Mail, Phone, CreditCard, IdCard,
    ChevronLeft, Calendar, MapPin, Clock,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { maskCpf } from '@/lib/cpf';
import { eventRequiresPayment, formatEventPriceBrl } from '@/lib/events/types';
import { submitEventRegistration, startRegistrationPayment } from '@/lib/events/submitRegistration';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Event {
    id: string;
    title: string;
    date: string;
    time_start: string | null;
    location: string | null;
    image_url: string | null;
    tag: string | null;
    registration_price?: number | null;
}

interface Props {
    event: Event | null;
    onClose: () => void;
    onSuccess?: (eventId: string) => void;
}

type Status = 'idle' | 'loading' | 'success' | 'duplicate' | 'error' | 'payment_error';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

const STEPS = ['Seus Dados', 'Revisão', 'Concluído'];

const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 56 : -56, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -56 : 56, opacity: 0 }),
};

// ─── Stepper indicator ────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
    return (
        <div className="flex items-center justify-center gap-0 px-6 pt-5 pb-4">
            {STEPS.map((label, i) => {
                const done = i < current;
                const active = i === current;
                return (
                    <React.Fragment key={label}>
                        <div className="flex flex-col items-center gap-1.5">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${done
                                    ? 'bg-paraiso-green text-white'
                                    : active
                                        ? 'bg-paraiso-blue text-white ring-2 ring-paraiso-green ring-offset-2 dark:ring-offset-[#0f1a2a]'
                                        : 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-500'
                                    }`}
                            >
                                {done ? <CheckCircle2 size={14} /> : i + 1}
                            </div>
                            <span
                                className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${active
                                    ? 'text-paraiso-blue dark:text-white'
                                    : done
                                        ? 'text-paraiso-green'
                                        : 'text-slate-400 dark:text-slate-500'
                                    }`}
                            >
                                {label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className="relative flex-1 mx-2 mb-5">
                                <div className="h-0.5 w-full bg-slate-100 dark:bg-white/10 rounded-full" />
                                <motion.div
                                    className="absolute top-0 left-0 h-0.5 bg-paraiso-green rounded-full"
                                    initial={false}
                                    animate={{ width: i < current ? '100%' : '0%' }}
                                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                                />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

// ─── Field component ──────────────────────────────────────────────────────────

function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{icon}</div>
            {children}
        </div>
    );
}

const inputCls =
    'w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-paraiso-green dark:focus:border-paraiso-green transition-colors font-medium';

// ─── Main Component ───────────────────────────────────────────────────────────

const EventRegistrationModal: React.FC<Props> = ({ event, onClose, onSuccess }) => {
    const supabase = createClient();

    const [step, setStep] = useState(0);
    const [dir, setDir] = useState(1);
    const [form, setForm] = useState({ name: '', email: '', phone: '', cpf: '' });
    const [status, setStatus] = useState<Status>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    if (!event) return null;

    const requiresPayment = eventRequiresPayment(event.registration_price);

    // ── Navigation ──────────────────────────────────────────────────────────

    const goTo = (next: number) => {
        setDir(next > step ? 1 : -1);
        setStep(next);
    };

    const handleContinue = () => {
        // Basic HTML5 validation passthrough handled by required attrs,
        // but guard against empty name / email before advancing
        if (!form.name.trim() || !form.email.trim()) return;
        if (requiresPayment && !form.cpf.trim()) return;
        goTo(1);
    };

    // ── Submit (happens on step 1 → 2) ──────────────────────────────────────

    const handleSubmit = async () => {
        setStatus('loading');
        setErrorMessage(null);

        const { data: { user } } = await supabase.auth.getUser();

        const result = await submitEventRegistration(supabase, {
            eventId: event.id,
            registrationPrice: event.registration_price,
            form: { ...form, message: '' },
            userId: user?.id ?? null,
        });

        if (!result.ok) {
            if (result.reason === 'duplicate') {
                setStatus('duplicate');
            } else {
                setErrorMessage(result.message ?? 'Não foi possível realizar sua inscrição.');
                setStatus('error');
            }
            goTo(2);
            return;
        }

        if (result.requiresPayment) {
            const payment = await startRegistrationPayment(result.registrationId);
            if (!payment.ok) {
                setErrorMessage(payment.message);
                setStatus('payment_error');
                goTo(2);
                return;
            }
            window.location.href = payment.url;
            return;
        }

        setStatus('success');
        onSuccess?.(event.id);
        goTo(2);
    };

    const reset = () => {
        setForm({ name: '', email: '', phone: '', cpf: '' });
        setStatus('idle');
        setErrorMessage(null);
        setDir(-1);
        setStep(0);
    };

    // ─── Render ─────────────────────────────────────────────────────────────

    return (
        <AnimatePresence>
            {event && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.96, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 24 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="relative w-full max-w-md bg-white dark:bg-[#0f1a2a] rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]">

                            {/* ── Header: event image + info ──────────────────────── */}
                            <div
                                className="relative shrink-0 h-32 flex items-end p-5"
                                style={{
                                    background: event.image_url
                                        ? `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.78) 100%), url(${event.image_url}) center/cover`
                                        : 'linear-gradient(135deg, #2B4364 0%, #7C9A40 100%)',
                                }}
                            >
                                <div className="flex-1 min-w-0">
                                    {event.tag && (
                                        <span className="px-2.5 py-0.5 bg-paraiso-green text-white text-[9px] font-black uppercase tracking-widest rounded-full mb-1.5 inline-block">
                                            {event.tag}
                                        </span>
                                    )}
                                    <h2 className="text-base font-black text-white leading-tight truncate">
                                        {event.title}
                                    </h2>
                                    <p className="text-white/65 text-[11px] mt-0.5 flex items-center gap-2 flex-wrap">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={10} />
                                            {formatDate(event.date)}
                                        </span>
                                        {event.time_start && (
                                            <span className="flex items-center gap-1">
                                                <Clock size={10} />
                                                {event.time_start.slice(0, 5)}
                                            </span>
                                        )}
                                        {event.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin size={10} />
                                                {event.location}
                                            </span>
                                        )}
                                    </p>
                                </div>

                                {/* Close button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/35 text-white hover:bg-black/55 transition-all"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* ── Stepper ─────────────────────────────────────────── */}
                            <div className="shrink-0 border-b border-slate-100 dark:border-white/8">
                                <StepIndicator current={step} />
                            </div>

                            {/* ── Step content (scrollable) ────────────────────────── */}
                            <div className="overflow-y-auto flex-1">
                                <AnimatePresence mode="wait" custom={dir}>
                                    {/* ══ STEP 0: Dados ══ */}
                                    {step === 0 && (
                                        <motion.div
                                            key="step-0"
                                            custom={dir}
                                            variants={slideVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                                            className="p-6 space-y-3"
                                        >
                                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-1">
                                                {requiresPayment
                                                    ? `Inscrição: ${formatEventPriceBrl(event.registration_price!)} — você será redirecionado ao pagamento seguro.`
                                                    : 'Preencha seus dados para garantir sua vaga.'}
                                            </p>

                                            {/* Nome */}
                                            <Field icon={<User size={15} />}>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Nome completo *"
                                                    value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                    className={inputCls}
                                                />
                                            </Field>

                                            {/* Email */}
                                            <Field icon={<Mail size={15} />}>
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="Seu e-mail *"
                                                    value={form.email}
                                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                    className={inputCls}
                                                />
                                            </Field>

                                            {/* CPF (só se pagamento) */}
                                            {requiresPayment && (
                                                <Field icon={<IdCard size={15} />}>
                                                    <input
                                                        required
                                                        type="text"
                                                        inputMode="numeric"
                                                        placeholder="CPF * (obrigatório para pagamento)"
                                                        value={form.cpf}
                                                        onChange={(e) => setForm({ ...form, cpf: maskCpf(e.target.value) })}
                                                        className={inputCls}
                                                    />
                                                </Field>
                                            )}

                                            {/* Telefone */}
                                            <Field icon={<Phone size={15} />}>
                                                <input
                                                    type="tel"
                                                    placeholder="WhatsApp / Telefone (opcional)"
                                                    value={form.phone}
                                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                    className={inputCls}
                                                />
                                            </Field>
                                        </motion.div>
                                    )}

                                    {/* ══ STEP 1: Revisão ══ */}
                                    {step === 1 && (
                                        <motion.div
                                            key="step-1"
                                            custom={dir}
                                            variants={slideVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                                            className="p-6 space-y-4"
                                        >
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                                Confirme seus dados antes de finalizar.
                                            </p>

                                            {/* Summary card */}
                                            <div className="bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 divide-y divide-slate-200 dark:divide-white/10 overflow-hidden">
                                                <Row label="Nome" value={form.name} />
                                                <Row label="E-mail" value={form.email} />
                                                {form.phone && <Row label="Telefone" value={form.phone} />}
                                                {requiresPayment && form.cpf && <Row label="CPF" value={form.cpf} />}
                                            </div>

                                            {/* Pricing banner */}
                                            {requiresPayment && (
                                                <div className="flex items-center gap-3 p-4 bg-paraiso-blue/8 dark:bg-paraiso-green/10 border border-paraiso-blue/15 dark:border-paraiso-green/20 rounded-2xl">
                                                    <CreditCard size={18} className="text-paraiso-blue dark:text-paraiso-green shrink-0" />
                                                    <div>
                                                        <p className="text-xs font-black text-paraiso-blue dark:text-paraiso-green uppercase tracking-widest">
                                                            Valor da inscrição
                                                        </p>
                                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                                                            {formatEventPriceBrl(event.registration_price!)}
                                                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-2">
                                                                · pagamento seguro
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* ══ STEP 2: Concluído ══ */}
                                    {step === 2 && (
                                        <motion.div
                                            key="step-2"
                                            custom={dir}
                                            variants={slideVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                                            className="p-6"
                                        >
                                            {/* Success */}
                                            {status === 'success' && (
                                                <div className="text-center py-4 space-y-4">
                                                    <motion.div
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                    >
                                                        <CheckCircle2 className="w-16 h-16 text-paraiso-green mx-auto" />
                                                    </motion.div>
                                                    <div>
                                                        <h3 className="text-xl font-black text-paraiso-blue dark:text-white mb-2">
                                                            Inscrição confirmada!
                                                        </h3>
                                                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                                            Você está inscrito em <strong>{event.title}</strong>.
                                                            Fique de olho no seu e-mail!
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={onClose}
                                                        className="px-8 py-3 bg-paraiso-green text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-paraiso-blue transition-all shadow-md"
                                                    >
                                                        Fechar
                                                    </button>
                                                </div>
                                            )}

                                            {/* Duplicate */}
                                            {status === 'duplicate' && (
                                                <div className="text-center py-4 space-y-4">
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
                                                        <button
                                                            onClick={reset}
                                                            className="px-5 py-3 border border-slate-200 dark:border-white/15 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-2xl hover:border-paraiso-green transition-all"
                                                        >
                                                            Tentar outro e-mail
                                                        </button>
                                                        <button
                                                            onClick={onClose}
                                                            className="px-5 py-3 bg-paraiso-green text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-paraiso-blue transition-all"
                                                        >
                                                            Fechar
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Error / payment error */}
                                            {(status === 'error' || status === 'payment_error') && (
                                                <div className="text-center py-4 space-y-4">
                                                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                                                    <div>
                                                        <h3 className="text-xl font-black text-paraiso-blue dark:text-white mb-2">
                                                            Ocorreu um erro
                                                        </h3>
                                                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                                                            {errorMessage || 'Não foi possível realizar sua inscrição. Tente novamente.'}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={reset}
                                                        className="px-8 py-3 bg-red-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-red-600 transition-all"
                                                    >
                                                        Tentar novamente
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* ── Footer: action buttons ───────────────────────────── */}
                            {step < 2 && (
                                <div className="shrink-0 p-5 pt-3 border-t border-slate-100 dark:border-white/8 flex items-center gap-3">
                                    {/* Back button (only on step 1) */}
                                    {step === 1 && (
                                        <button
                                            onClick={() => goTo(0)}
                                            disabled={status === 'loading'}
                                            className="flex items-center gap-1.5 px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-white/15 text-slate-600 dark:text-slate-300 font-bold text-xs hover:border-paraiso-green dark:hover:border-paraiso-green transition-all disabled:opacity-50"
                                        >
                                            <ChevronLeft size={14} />
                                            Voltar
                                        </button>
                                    )}

                                    {/* Primary action */}
                                    {step === 0 && (
                                        <button
                                            onClick={handleContinue}
                                            disabled={!form.name.trim() || !form.email.trim() || (requiresPayment && !form.cpf.trim())}
                                            className="flex-1 py-3.5 bg-paraiso-blue text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-paraiso-green transition-all disabled:opacity-45 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                                        >
                                            Continuar
                                        </button>
                                    )}

                                    {step === 1 && (
                                        <button
                                            onClick={handleSubmit}
                                            disabled={status === 'loading'}
                                            className="flex-1 py-3.5 bg-paraiso-green text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-paraiso-blue transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
                                        >
                                            {status === 'loading' ? (
                                                <>
                                                    <Loader2 size={15} className="animate-spin" />
                                                    {requiresPayment ? 'Preparando pagamento...' : 'Confirmando...'}
                                                </>
                                            ) : requiresPayment ? (
                                                <>
                                                    <CreditCard size={15} />
                                                    Ir para pagamento
                                                </>
                                            ) : (
                                                'Confirmar Inscrição'
                                            )}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EventRegistrationModal;

// ─── Row helper ───────────────────────────────────────────────────────────────

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest shrink-0">
                {label}
            </span>
            <span className="text-sm font-semibold text-slate-700 dark:text-white text-right truncate">
                {value}
            </span>
        </div>
    );
}

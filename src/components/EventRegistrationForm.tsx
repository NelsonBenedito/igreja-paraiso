'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, User, Mail, Phone, MessageSquare, CreditCard, IdCard } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { maskCpf } from '@/lib/cpf';
import {
    eventRequiresPayment,
    formatEventPriceBrl,
} from '@/lib/events/types';
import {
    submitEventRegistration,
    startRegistrationPayment,
} from '@/lib/events/submitRegistration';

interface Event {
    id: string;
    title: string;
    registration_price?: number | null;
}

interface Props {
    event: Event;
    onSuccess?: (eventId: string) => void;
}

type Status = 'idle' | 'loading' | 'success' | 'duplicate' | 'error' | 'payment_error';

const EventRegistrationForm: React.FC<Props> = ({ event, onSuccess }) => {
    const supabase = createClient();
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', cpf: '' });
    const [status, setStatus] = useState<Status>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const requiresPayment = eventRequiresPayment(event.registration_price);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage(null);

        const { data: { user } } = await supabase.auth.getUser();

        const result = await submitEventRegistration(supabase, {
            eventId: event.id,
            registrationPrice: event.registration_price,
            form,
            userId: user?.id ?? null,
        });

        if (!result.ok) {
            if (result.reason === 'duplicate') setStatus('duplicate');
            else if (result.reason === 'validation') {
                setErrorMessage(result.message ?? 'Dados inválidos.');
                setStatus('error');
            } else setStatus('error');
            return;
        }

        if (result.requiresPayment) {
            const payment = await startRegistrationPayment(result.registrationId);
            if (!payment.ok) {
                setErrorMessage(payment.message);
                setStatus('payment_error');
                return;
            }
            window.location.href = payment.url;
            return;
        }

        setStatus('success');
        onSuccess?.(event.id);
    };

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8 space-y-4 bg-paraiso-green/5 rounded-3xl border border-paraiso-green/20 p-8"
            >
                <CheckCircle2 className="w-16 h-16 text-paraiso-green mx-auto" />
                <div>
                    <h3 className="text-xl font-black text-paraiso-blue dark:text-white mb-2">
                        Inscrição confirmada!
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        Sua inscrição para <strong>{event.title}</strong> foi realizada com sucesso.
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="bg-white dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/10 p-8 shadow-sm">
            <h3 className="text-xl font-black text-paraiso-blue dark:text-white uppercase tracking-widest mb-2">
                Inscrição
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium">
                {requiresPayment
                    ? `Valor: ${formatEventPriceBrl(event.registration_price!)} — após preencher os dados você será redirecionado ao pagamento seguro (Asaas).`
                    : 'Preencha seus dados para garantir sua vaga neste evento.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {(status === 'error' || status === 'payment_error') && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-xs font-bold">
                        <AlertCircle size={16} />
                        {errorMessage || 'Ocorreu um erro. Tente novamente.'}
                    </div>
                )}
                {status === 'duplicate' && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3 text-amber-500 text-xs font-bold">
                        <AlertCircle size={16} />
                        Você já está inscrito com este e-mail.
                    </div>
                )}

                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        required
                        type="text"
                        placeholder="Seu nome completo"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-paraiso-green transition-colors font-medium"
                    />
                </div>

                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        required
                        type="email"
                        placeholder="Seu e-mail"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-paraiso-green transition-colors font-medium"
                    />
                </div>

                {requiresPayment && (
                    <div className="relative">
                        <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            required
                            type="text"
                            inputMode="numeric"
                            placeholder="CPF (obrigatório para pagamento)"
                            value={form.cpf}
                            onChange={(e) => setForm({ ...form, cpf: maskCpf(e.target.value) })}
                            className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-paraiso-green transition-colors font-medium"
                        />
                    </div>
                )}

                <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="tel"
                        placeholder="Telefone / WhatsApp (opcional)"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-paraiso-green transition-colors font-medium"
                    />
                </div>

                <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                    <textarea
                        rows={3}
                        placeholder="Alguma observação? (opcional)"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-paraiso-green transition-colors resize-none font-medium"
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-4 bg-paraiso-green text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-paraiso-blue transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            {requiresPayment ? 'Preparando pagamento...' : 'Confirmando...'}
                        </>
                    ) : requiresPayment ? (
                        <>
                            <CreditCard size={18} />
                            Ir para pagamento
                        </>
                    ) : (
                        'Confirmar Inscrição'
                    )}
                </button>
            </form>
        </div>
    );
};

export default EventRegistrationForm;

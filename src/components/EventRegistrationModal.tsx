'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2, AlertCircle, User, Mail, Phone, MessageSquare, Ticket, CreditCard, Copy, ExternalLink, QrCode } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { submitEventRegistration, submitEventCheckout } from '@/lib/events/data-client';
import { fetchEventTickets } from '@/lib/events/client';
import type { SiteEvent, PublicTicketTypeDto, EventCheckoutResponse } from '@/lib/events/types';
import { formatEventDate } from '@/lib/events/display';

interface Props {
    event: SiteEvent | null;
    onClose: () => void;
    onSuccess?: (eventId: string) => void;
}

type Status = 'idle' | 'loading' | 'success' | 'duplicate' | 'error';

const EventRegistrationModal: React.FC<Props> = ({ event, onClose, onSuccess }) => {
    const supabase = createClient();
    const [form, setForm] = useState({ 
        name: '', email: '', phone: '', message: '',
        cpf: '', billingType: 'PIX' as 'PIX' | 'BOLETO' | 'CREDIT_CARD'
    });
    const [status, setStatus] = useState<Status>('idle');
    const [tickets, setTickets] = useState<PublicTicketTypeDto[]>([]);
    const [isLoadingTickets, setIsLoadingTickets] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [checkoutResponse, setCheckoutResponse] = useState<EventCheckoutResponse | null>(null);

    useEffect(() => {
        if (event) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsLoadingTickets(true);
            fetchEventTickets(event.id)
                .then(res => {
                    const t = res.ticketTypes || [];
                    setTickets(t);
                    if (t.length > 0) setSelectedTicketId(t[0].id);
                })
                .catch(() => setTickets([]))
                .finally(() => setIsLoadingTickets(false));
        }
    }, [event]);

    if (!event) return null;

    const selectedTicket = tickets.find(t => t.id === selectedTicketId);
    const isPaid = selectedTicket ? (selectedTicket.priceCents + selectedTicket.feeCents > 0) : false;

    useEffect(() => {
        if (selectedTicket && isPaid) {
            const allowed = selectedTicket.allowedBillingTypes ?? [];
            if (allowed.length > 0 && !allowed.includes(form.billingType)) {
                setForm(f => ({ ...f, billingType: allowed[0] as 'PIX' | 'BOLETO' | 'CREDIT_CARD' }));
            }
        }
    }, [selectedTicketId]); // eslint-disable-line react-hooks/exhaustive-deps

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copiado para a área de transferência!");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        const { data: { user } } = await supabase.auth.getUser();

        if (isPaid && selectedTicketId) {
            const cpfDigits = form.cpf.replace(/\D/g, '');
            if (cpfDigits.length !== 11) {
                alert("Por favor, informe um CPF válido com 11 dígitos.");
                setStatus('idle');
                return;
            }

            const result = await submitEventCheckout(event.id, {
                payer: {
                    name: form.name.trim(),
                    email: form.email.trim().toLowerCase(),
                    phone: form.phone.trim() || undefined,
                    cpf: cpfDigits,
                },
                lines: [{ ticketTypeId: selectedTicketId, quantity: 1 }],
                billingType: form.billingType,
            });

            if (result.ok) {
                setCheckoutResponse(result.data);
                setStatus('success');
                onSuccess?.(event.id);
            } else {
                setStatus('error');
            }
        } else {
            const result = await submitEventRegistration(event.id, {
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim() || null,
                message: form.message.trim() || null,
                userId: user?.id ?? null,
                ticketTypeId: selectedTicketId,
            });

            if (result.ok) {
                setStatus('success');
                onSuccess?.(event.id);
            } else if (result.reason === 'duplicate') {
                setStatus('duplicate');
            } else {
                setStatus('error');
            }
        }
    };

    const reset = () => {
        setForm({ ...form, cpf: '', billingType: 'PIX' });
        setStatus('idle');
        setCheckoutResponse(null);
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
                        <div className="relative w-full max-w-lg bg-white dark:bg-[#0f1a2a] rounded-3xl shadow-2xl overflow-hidden pointer-events-auto max-h-[90vh] overflow-y-auto">

                            {/* Header */}
                            <div
                                className="relative h-36 flex items-end p-6 shrink-0"
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
                                        className="text-center py-6 space-y-6"
                                    >
                                        <CheckCircle2 className="w-16 h-16 text-paraiso-green mx-auto" />
                                        <div>
                                            <h3 className="text-xl font-black text-paraiso-blue dark:text-white mb-2">
                                                Inscrição confirmada!
                                            </h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                                Sua inscrição para <strong>{event.title}</strong> foi realizada com sucesso.
                                            </p>

                                            {/* Pagamento PIX */}
                                            {checkoutResponse?.pix && (
                                                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2">
                                                        <QrCode size={18} /> Pague via PIX
                                                    </p>
                                                    <img 
                                                        src={`data:image/jpeg;base64,${checkoutResponse.pix.encodedImage}`} 
                                                        alt="QR Code PIX" 
                                                        className="w-48 h-48 mx-auto rounded-lg"
                                                    />
                                                    <button 
                                                        onClick={() => copyToClipboard(checkoutResponse.pix!.payload)}
                                                        className="w-full py-3 bg-white dark:bg-white/10 text-paraiso-blue dark:text-white text-sm font-bold rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Copy size={16} /> Copiar Código PIX
                                                    </button>
                                                </div>
                                            )}

                                            {/* Link Boleto ou Cartão */}
                                            {(checkoutResponse?.bankSlipUrl || checkoutResponse?.invoiceUrl) && !checkoutResponse?.pix && (
                                                <div className="mt-4">
                                                    <a 
                                                        href={checkoutResponse.bankSlipUrl || checkoutResponse.invoiceUrl || '#'} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="w-full py-4 bg-paraiso-blue text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-paraiso-blue-dark transition-all"
                                                    >
                                                        <ExternalLink size={18} /> Acessar Cobrança
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="px-8 py-3 w-full bg-paraiso-green text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-paraiso-blue transition-all"
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
                                            Preencha seus dados para garantir sua vaga.
                                        </p>

                                        {isLoadingTickets ? (
                                            <div className="flex items-center justify-center py-4">
                                                <Loader2 size={24} className="animate-spin text-paraiso-green" />
                                            </div>
                                        ) : tickets.length > 0 ? (
                                            <div className="space-y-2 mb-6">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                    Selecione o Ingresso
                                                </label>
                                                <div className="space-y-2">
                                                    {tickets.filter(t => t.visibility !== 'PRIVATE').map(ticket => {
                                                        const price = ticket.priceCents + ticket.feeCents;
                                                        const isSelected = selectedTicketId === ticket.id;
                                                        const soldOut = ticket.isSoldOut;
                                                        return (
                                                            <div
                                                                key={ticket.id}
                                                                onClick={() => !soldOut && setSelectedTicketId(ticket.id)}
                                                                className={`border p-4 rounded-2xl flex items-center justify-between transition-all ${
                                                                    soldOut
                                                                    ? 'opacity-50 cursor-not-allowed border-slate-200 dark:border-white/10'
                                                                    : isSelected
                                                                    ? 'cursor-pointer border-paraiso-green bg-paraiso-green/5 dark:bg-paraiso-green/10'
                                                                    : 'cursor-pointer border-slate-200 dark:border-white/10 hover:border-paraiso-green/50'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-paraiso-green' : 'border-slate-300'}`}>
                                                                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-paraiso-green" />}
                                                                    </div>
                                                                    <div>
                                                                        <h4 className={`font-bold text-sm ${isSelected ? 'text-paraiso-green' : 'text-slate-700 dark:text-white'}`}>
                                                                            {ticket.name}
                                                                            {soldOut && <span className="ml-2 text-xs text-red-500 font-bold">Esgotado</span>}
                                                                        </h4>
                                                                        {ticket.description && (
                                                                            <p className="text-xs text-slate-500 line-clamp-1">{ticket.description}</p>
                                                                        )}
                                                                        {ticket.quantityRemaining != null && !soldOut && (
                                                                            <p className="text-[10px] text-slate-400 mt-0.5">
                                                                                {ticket.quantityRemaining} restante{ticket.quantityRemaining !== 1 ? 's' : ''}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="font-black text-slate-800 dark:text-white">
                                                                        {price > 0 ? formatCurrency(price) : 'Grátis'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ) : null}

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

                                        <AnimatePresence>
                                            {isPaid && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="space-y-4 overflow-hidden"
                                                >
                                                    {/* CPF */}
                                                    <div className="relative mt-4">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <input
                                                            required={isPaid}
                                                            type="text"
                                                            placeholder="CPF (Obrigatório para eventos pagos)"
                                                            value={form.cpf}
                                                            onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-paraiso-green transition-colors"
                                                            maxLength={14}
                                                        />
                                                    </div>

                                                    {/* Forma de Pagamento */}
                                                    {(() => {
                                                        const allowed = selectedTicket?.allowedBillingTypes ?? [];
                                                        const allOptions = [
                                                            { key: 'PIX' as const, label: 'PIX', icon: <QrCode size={16} /> },
                                                            { key: 'BOLETO' as const, label: 'Boleto', icon: <Ticket size={16} /> },
                                                            { key: 'CREDIT_CARD' as const, label: 'Cartão', icon: <CreditCard size={16} /> },
                                                        ];
                                                        const options = allowed.length === 0 ? allOptions : allOptions.filter(o => allowed.includes(o.key));

                                                        return options.length > 0 ? (
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                    Forma de Pagamento
                                                                </label>
                                                                <div className={`grid gap-2 ${options.length === 1 ? 'grid-cols-1' : options.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                                                    {options.map(opt => (
                                                                        <button
                                                                            key={opt.key}
                                                                            type="button"
                                                                            onClick={() => setForm({ ...form, billingType: opt.key })}
                                                                            className={`py-3 px-2 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                                                                form.billingType === opt.key
                                                                                ? 'border-paraiso-green bg-paraiso-green/10 text-paraiso-green'
                                                                                : 'border-slate-200 dark:border-white/10 text-slate-500 hover:border-paraiso-green/50'
                                                                            }`}
                                                                        >
                                                                            {opt.icon} {opt.label}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : null;
                                                    })()}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Mensagem */}
                                        <div className="relative mt-4">
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
                                            disabled={status === 'loading' || isLoadingTickets || (tickets.length > 0 && !selectedTicketId)}
                                            className="w-full py-4 mt-4 bg-paraiso-green text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-paraiso-blue transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
                                        >
                                            {status === 'loading' ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" />
                                                    Processando...
                                                </>
                                            ) : (
                                                isPaid ? 'Finalizar Inscrição' : 'Confirmar Inscrição'
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

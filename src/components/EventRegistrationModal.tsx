'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2, AlertCircle, User, Mail, Phone, MessageSquare, Ticket, CreditCard, Copy, ExternalLink, QrCode, Users, Clock } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { submitEventRegistration, submitEventCheckout, pollOrderPayment } from '@/lib/events/data-client';
import { fetchEventTickets } from '@/lib/events/client';
import type {
    SiteEvent,
    PublicTicketTypeDto,
    PublicTicketFieldDto,
    EventCheckoutResponse,
    OrderPaymentStatus,
    BillingType,
} from '@/lib/events/types';
import { formatEventDate } from '@/lib/events/display';

interface Props {
    event: SiteEvent | null;
    onClose: () => void;
    onSuccess?: (eventId: string) => void;
}

type Status =
    | 'idle'
    | 'loading'
    | 'success'
    | 'awaiting_payment'
    | 'paid'
    | 'payment_failed'
    | 'duplicate'
    | 'sold_out'
    | 'error';

/** Campos satisfeitos por `payer` — a API não os espera em `fieldValues`. */
const SYSTEM_FIELD_KEYS = new Set(['name', 'email', 'phone', 'cpf']);

const PAYMENT_OPTIONS: Array<{ key: Exclude<BillingType, 'UNDEFINED'>; label: string; icon: React.ReactNode }> = [
    { key: 'PIX', label: 'PIX', icon: <QrCode size={16} /> },
    { key: 'BOLETO', label: 'Boleto', icon: <Ticket size={16} /> },
    { key: 'CREDIT_CARD', label: 'Cartão', icon: <CreditCard size={16} /> },
];

const inputClass =
    'w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-paraiso-green transition-colors';

const EventRegistrationModal: React.FC<Props> = ({ event, onClose, onSuccess }) => {
    const supabase = createClient();
    const [form, setForm] = useState({
        name: '', email: '', phone: '', message: '',
        cpf: '', billingType: 'PIX' as Exclude<BillingType, 'UNDEFINED'>,
    });
    const [status, setStatus] = useState<Status>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [tickets, setTickets] = useState<PublicTicketTypeDto[]>([]);
    const [isLoadingTickets, setIsLoadingTickets] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [holderNames, setHolderNames] = useState<string[]>([]);
    const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
    const [installmentCount, setInstallmentCount] = useState(1);
    const [checkoutResponse, setCheckoutResponse] = useState<EventCheckoutResponse | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<OrderPaymentStatus>('PENDING');
    const [communityLink, setCommunityLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const pollAbortRef = useRef<AbortController | null>(null);

    const eventId = event?.id ?? null;

    useEffect(() => {
        if (!eventId) return;
        setIsLoadingTickets(true);
        let cancelled = false;
        fetchEventTickets(eventId)
            .then(res => {
                if (cancelled) return;
                const t = res.ticketTypes ?? [];
                setTickets(t);
                if (t.length > 0) setSelectedTicketId(t[0].id);
            })
            .catch(() => { if (!cancelled) setTickets([]); })
            .finally(() => { if (!cancelled) setIsLoadingTickets(false); });
        return () => { cancelled = true; };
    }, [eventId]);

    const selectedTicket = useMemo(
        () => tickets.find(t => t.id === selectedTicketId) ?? null,
        [tickets, selectedTicketId],
    );
    const unitPrice = selectedTicket ? selectedTicket.priceCents + selectedTicket.feeCents : 0;
    const isPaid = unitPrice > 0;

    /** Campos personalizados a pedir ao utilizador (os de sistema vêm de `payer`). */
    const customFields = useMemo<PublicTicketFieldDto[]>(
        () => (selectedTicket?.fields ?? []).filter(f => !SYSTEM_FIELD_KEYS.has(f.key)),
        [selectedTicket],
    );

    const maxQuantity = useMemo(() => {
        if (!selectedTicket) return 1;
        const limits = [selectedTicket.maxPerOrder || 1];
        if (selectedTicket.quantityRemaining != null) limits.push(selectedTicket.quantityRemaining);
        return Math.max(1, Math.min(...limits));
    }, [selectedTicket]);

    const minQuantity = Math.max(1, selectedTicket?.minPerOrder ?? 1);

    // Ao trocar de ingresso, os limites e campos mudam — repõe o que deixou de ser válido.
    useEffect(() => {
        if (!selectedTicket) return;
        const allowed = selectedTicket.allowedBillingTypes ?? [];
        if (allowed.length > 0 && !allowed.includes(form.billingType)) {
            const next = PAYMENT_OPTIONS.find(o => allowed.includes(o.key));
            if (next) setForm(f => ({ ...f, billingType: next.key }));
        }
        setQuantity(q => Math.min(Math.max(q, minQuantity), maxQuantity));
        setFieldValues({});
        setInstallmentCount(1);
    }, [selectedTicketId]); // eslint-disable-line react-hooks/exhaustive-deps

    // Mantém o número de caixas de nome alinhado com a quantidade escolhida.
    useEffect(() => {
        setHolderNames(prev => {
            const next = prev.slice(0, quantity);
            while (next.length < quantity) next.push('');
            return next;
        });
    }, [quantity]);

    useEffect(() => () => pollAbortRef.current?.abort(), []);

    const formatCurrency = (cents: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setErrorMessage('Não foi possível copiar. Selecione o código manualmente.');
        }
    };

    const startPolling = (orderId: string, evtId: string) => {
        pollAbortRef.current?.abort();
        const controller = new AbortController();
        pollAbortRef.current = controller;

        void pollOrderPayment(evtId, orderId, {
            signal: controller.signal,
            onUpdate: s => setPaymentStatus(s.status),
        }).then(final => {
            if (controller.signal.aborted) return;
            if (!final) return; // timeout — mantém o ecrã de aguardo
            setPaymentStatus(final.status);
            if (final.status === 'CONFIRMED') {
                setStatus('paid');
                onSuccess?.(evtId);
            } else {
                setStatus('payment_failed');
            }
        });
    };

    const validateCpf = (raw: string): string | null => {
        const digits = raw.replace(/\D/g, '');
        if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return null;
        // Dígitos verificadores — evita ida à API com CPF que já sabemos inválido.
        for (const [len, pos] of [[9, 10], [10, 11]] as const) {
            let sum = 0;
            for (let i = 0; i < len; i++) sum += Number(digits[i]) * (pos - i);
            const check = (sum * 10) % 11 % 10;
            if (check !== Number(digits[len])) return null;
        }
        return digits;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!event) return;
        setErrorMessage(null);

        const missing = customFields.find(f => f.required && !fieldValues[f.fieldId]?.trim());
        if (missing) {
            setErrorMessage(`Campo obrigatório: ${missing.label}`);
            return;
        }

        setStatus('loading');
        const { data: { user } } = await supabase.auth.getUser();
        const apiFieldValues = customFields
            .filter(f => fieldValues[f.fieldId]?.trim())
            .map(f => ({ fieldId: f.fieldId, value: fieldValues[f.fieldId].trim() }));

        if (isPaid && selectedTicketId) {
            const cpf = validateCpf(form.cpf);
            if (!cpf) {
                setErrorMessage('Informe um CPF válido.');
                setStatus('idle');
                return;
            }

            const result = await submitEventCheckout(event.id, {
                payer: {
                    name: form.name.trim(),
                    email: form.email.trim().toLowerCase(),
                    phone: form.phone.trim() || undefined,
                    cpf,
                },
                lines: [{
                    ticketTypeId: selectedTicketId,
                    quantity,
                    holderNames: holderNames.map(n => n.trim()).filter(Boolean),
                }],
                billingType: form.billingType,
                ...(form.billingType === 'CREDIT_CARD' ? { installmentCount } : {}),
                ...(apiFieldValues.length > 0 ? { fieldValues: apiFieldValues } : {}),
            });

            if (result.ok) {
                setCheckoutResponse(result.data);
                if (result.data.status === 'CONFIRMED') {
                    setPaymentStatus('CONFIRMED');
                    setStatus('paid');
                    onSuccess?.(event.id);
                } else {
                    setStatus('awaiting_payment');
                    startPolling(result.data.orderId, event.id);
                }
            } else if (result.reason === 'sold_out') {
                setStatus('sold_out');
            } else {
                setErrorMessage(result.message ?? null);
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
                ...(apiFieldValues.length > 0 ? { fieldValues: apiFieldValues } : {}),
            });

            if (result.ok) {
                setCommunityLink(result.communityLink);
                setStatus('success');
                onSuccess?.(event.id);
            } else if (result.reason === 'duplicate') {
                setStatus('duplicate');
            } else {
                setErrorMessage(result.message ?? null);
                setStatus('error');
            }
        }
    };

    const reset = () => {
        pollAbortRef.current?.abort();
        setForm(f => ({ ...f, cpf: '' }));
        setStatus('idle');
        setErrorMessage(null);
        setCheckoutResponse(null);
        setPaymentStatus('PENDING');
    };

    const refetchTickets = async () => {
        if (!event) return;
        setStatus('idle');
        setIsLoadingTickets(true);
        try {
            const res = await fetchEventTickets(event.id);
            setTickets(res.ticketTypes ?? []);
        } finally {
            setIsLoadingTickets(false);
        }
    };

    if (!event) return null;

    const totalCents = unitPrice * quantity;
    const pix = checkoutResponse?.pix;
    const hasPixData = !!(pix?.payload || pix?.encodedImage);

    const renderCustomField = (field: PublicTicketFieldDto) => {
        const value = fieldValues[field.fieldId] ?? '';
        const set = (v: string) => setFieldValues(prev => ({ ...prev, [field.fieldId]: v }));
        const base = 'w-full px-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-paraiso-green transition-colors';

        return (
            <div key={field.fieldId} className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'SELECT' ? (
                    <select required={field.required} value={value} onChange={e => set(e.target.value)} className={base}>
                        <option value="">Selecione…</option>
                        {(field.options ?? []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                ) : field.type === 'TEXTAREA' ? (
                    <textarea rows={2} required={field.required} value={value} onChange={e => set(e.target.value)} className={`${base} resize-none`} />
                ) : field.type === 'CHECKBOX' ? (
                    <label className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                        <input
                            type="checkbox"
                            required={field.required}
                            checked={value === 'true'}
                            onChange={e => set(e.target.checked ? 'true' : '')}
                            className="w-4 h-4 accent-paraiso-green"
                        />
                        {field.label}
                    </label>
                ) : (
                    <input
                        type={field.type === 'EMAIL' ? 'email' : field.type === 'PHONE' ? 'tel' : 'text'}
                        required={field.required}
                        value={value}
                        onChange={e => set(e.target.value)}
                        className={base}
                    />
                )}
            </div>
        );
    };

    return (
        <AnimatePresence>
            {event && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={status === 'awaiting_payment' ? undefined : onClose}
                    />

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
                                    <p className="text-white/70 text-xs mt-1">{formatEventDate(event.date)}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="p-6">
                                {/* Inscrição gratuita confirmada */}
                                {status === 'success' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6 space-y-6">
                                        <CheckCircle2 className="w-16 h-16 text-paraiso-green mx-auto" />
                                        <div>
                                            <h3 className="text-xl font-black text-paraiso-blue dark:text-white mb-2">Inscrição confirmada!</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                                Sua inscrição para <strong>{event.title}</strong> foi realizada com sucesso.
                                            </p>
                                            {communityLink && (
                                                <a
                                                    href={communityLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-full py-4 bg-paraiso-green text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-paraiso-blue transition-all"
                                                >
                                                    <Users size={18} /> Entrar no grupo
                                                </a>
                                            )}
                                        </div>
                                        <button onClick={onClose} className="px-8 py-3 w-full bg-paraiso-green text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-paraiso-blue transition-all">
                                            Fechar
                                        </button>
                                    </motion.div>
                                )}

                                {/* Aguardando pagamento */}
                                {status === 'awaiting_payment' && checkoutResponse && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                                        <div className="text-center">
                                            <Clock className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                                            <h3 className="text-xl font-black text-paraiso-blue dark:text-white mb-1">Aguardando pagamento</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                                Sua vaga fica reservada até a confirmação. Não feche esta janela.
                                            </p>
                                            <p className="text-lg font-black text-paraiso-blue dark:text-white mt-3">
                                                {formatCurrency(Math.round(checkoutResponse.value * 100))}
                                            </p>
                                        </div>

                                        {hasPixData && (
                                            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2">
                                                    <QrCode size={18} /> Pague via PIX
                                                </p>
                                                {pix?.encodedImage && (
                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                    <img
                                                        src={`data:image/png;base64,${pix.encodedImage}`}
                                                        alt="QR Code PIX"
                                                        className="w-48 h-48 mx-auto rounded-lg bg-white"
                                                    />
                                                )}
                                                {pix?.payload && (
                                                    <button
                                                        onClick={() => copyToClipboard(pix.payload!)}
                                                        className="w-full py-3 bg-white dark:bg-white/10 text-paraiso-blue dark:text-white text-sm font-bold rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Copy size={16} /> {copied ? 'Código copiado!' : 'Copiar código PIX'}
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {(checkoutResponse.bankSlipUrl || checkoutResponse.invoiceUrl) && (
                                            <a
                                                href={checkoutResponse.bankSlipUrl || checkoutResponse.invoiceUrl || '#'}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full py-4 bg-paraiso-blue text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-paraiso-blue-dark transition-all"
                                            >
                                                <ExternalLink size={18} /> Acessar cobrança
                                            </a>
                                        )}

                                        {!hasPixData && !checkoutResponse.bankSlipUrl && !checkoutResponse.invoiceUrl && (
                                            <p className="text-xs text-center text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 p-3 rounded-xl">
                                                Não recebemos os dados de pagamento. Verifique seu e-mail ou entre em contato com a igreja
                                                informando o pedido <strong>{checkoutResponse.orderId}</strong>.
                                            </p>
                                        )}

                                        <p className="text-xs text-center text-slate-400 flex items-center justify-center gap-2">
                                            <Loader2 size={14} className="animate-spin" />
                                            Verificando pagamento automaticamente…
                                        </p>
                                        <p className="text-[10px] text-center text-slate-400">
                                            Pedido: {checkoutResponse.orderId}
                                        </p>
                                    </motion.div>
                                )}

                                {/* Pagamento confirmado */}
                                {status === 'paid' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6 space-y-6">
                                        <CheckCircle2 className="w-16 h-16 text-paraiso-green mx-auto" />
                                        <div>
                                            <h3 className="text-xl font-black text-paraiso-blue dark:text-white mb-2">Pagamento confirmado!</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                                Sua inscrição para <strong>{event.title}</strong> está garantida.
                                                Os bilhetes foram enviados para <strong>{form.email.trim().toLowerCase()}</strong>.
                                            </p>
                                        </div>
                                        <button onClick={onClose} className="px-8 py-3 w-full bg-paraiso-green text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-paraiso-blue transition-all">
                                            Fechar
                                        </button>
                                    </motion.div>
                                )}

                                {/* Pagamento falhou ou expirou */}
                                {status === 'payment_failed' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6 space-y-4">
                                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                                        <div>
                                            <h3 className="text-xl font-black text-paraiso-blue dark:text-white mb-2">
                                                {paymentStatus === 'EXPIRED' ? 'Cobrança expirada' : 'Pagamento não concluído'}
                                            </h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                                {paymentStatus === 'EXPIRED'
                                                    ? 'O prazo para pagamento terminou e a reserva foi liberada.'
                                                    : 'Não conseguimos confirmar seu pagamento.'} Você pode tentar novamente.
                                            </p>
                                        </div>
                                        <button onClick={reset} className="px-8 py-3 w-full bg-paraiso-green text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-paraiso-blue transition-all">
                                            Tentar novamente
                                        </button>
                                    </motion.div>
                                )}

                                {/* Esgotado durante o checkout */}
                                {status === 'sold_out' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6 space-y-4">
                                        <AlertCircle className="w-16 h-16 text-amber-500 mx-auto" />
                                        <div>
                                            <h3 className="text-xl font-black text-paraiso-blue dark:text-white mb-2">Ingressos esgotados</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                                As últimas vagas foram preenchidas enquanto você preenchia o formulário.
                                            </p>
                                        </div>
                                        <button onClick={refetchTickets} className="px-8 py-3 w-full bg-paraiso-green text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-paraiso-blue transition-all">
                                            Ver ingressos disponíveis
                                        </button>
                                    </motion.div>
                                )}

                                {/* Já inscrito */}
                                {status === 'duplicate' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6 space-y-4">
                                        <AlertCircle className="w-16 h-16 text-amber-500 mx-auto" />
                                        <div>
                                            <h3 className="text-xl font-black text-paraiso-blue dark:text-white mb-2">Você já está inscrito!</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">Este e-mail já foi cadastrado para este evento.</p>
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
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6 space-y-4">
                                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                                        <div>
                                            <h3 className="text-xl font-black text-paraiso-blue dark:text-white mb-2">Ocorreu um erro</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                                {errorMessage ?? 'Não foi possível realizar sua inscrição. Tente novamente.'}
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
                                                    {tickets.map(ticket => {
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

                                        {/* Quantidade — só quando o ingresso permite mais de um */}
                                        {selectedTicket && maxQuantity > 1 && (
                                            <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                                                        Quantidade
                                                    </label>
                                                    <span className="text-[10px] text-slate-400">
                                                        {minQuantity > 1 && `mín. ${minQuantity} · `}máx. {maxQuantity}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setQuantity(q => Math.max(minQuantity, q - 1))}
                                                        disabled={quantity <= minQuantity}
                                                        className="w-9 h-9 rounded-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-black disabled:opacity-40 hover:border-paraiso-green transition-all"
                                                    >−</button>
                                                    <span className="w-8 text-center font-black text-slate-800 dark:text-white">{quantity}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setQuantity(q => Math.min(maxQuantity, q + 1))}
                                                        disabled={quantity >= maxQuantity}
                                                        className="w-9 h-9 rounded-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-black disabled:opacity-40 hover:border-paraiso-green transition-all"
                                                    >+</button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Nome */}
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                required
                                                type="text"
                                                placeholder="Seu nome completo"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className={inputClass}
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
                                                className={inputClass}
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
                                                className={inputClass}
                                            />
                                        </div>

                                        {/* Nome de cada participante */}
                                        {quantity > 1 && (
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                    Nome dos participantes
                                                </label>
                                                {Array.from({ length: quantity }).map((_, i) => (
                                                    <div key={i} className="relative">
                                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <input
                                                            type="text"
                                                            placeholder={i === 0 ? `Ingresso 1 (você)` : `Ingresso ${i + 1}`}
                                                            value={holderNames[i] ?? ''}
                                                            onChange={(e) => setHolderNames(prev => {
                                                                const next = [...prev];
                                                                next[i] = e.target.value;
                                                                return next;
                                                            })}
                                                            className={inputClass}
                                                        />
                                                    </div>
                                                ))}
                                                <p className="text-[10px] text-slate-400">
                                                    Em branco, o ingresso fica no nome do responsável pela compra.
                                                </p>
                                            </div>
                                        )}

                                        {/* Campos personalizados do ingresso */}
                                        {customFields.length > 0 && (
                                            <div className="space-y-4 pt-2">
                                                {customFields.map(renderCustomField)}
                                            </div>
                                        )}

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
                                                            placeholder="CPF (obrigatório para eventos pagos)"
                                                            value={form.cpf}
                                                            onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                                                            className={inputClass}
                                                            maxLength={14}
                                                        />
                                                    </div>

                                                    {/* Forma de pagamento */}
                                                    {(() => {
                                                        const allowed = selectedTicket?.allowedBillingTypes ?? [];
                                                        const options = allowed.length === 0
                                                            ? PAYMENT_OPTIONS
                                                            : PAYMENT_OPTIONS.filter(o => allowed.includes(o.key));

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

                                                    {/* Parcelamento — só no cartão e se o ingresso permitir */}
                                                    {form.billingType === 'CREDIT_CARD' && (selectedTicket?.maxInstallments ?? 1) > 1 && (
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                Parcelamento
                                                            </label>
                                                            <select
                                                                value={installmentCount}
                                                                onChange={(e) => setInstallmentCount(Number(e.target.value))}
                                                                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-800 dark:text-white focus:outline-none focus:border-paraiso-green transition-colors"
                                                            >
                                                                {Array.from({ length: selectedTicket?.maxInstallments ?? 1 }).map((_, i) => (
                                                                    <option key={i + 1} value={i + 1}>
                                                                        {i + 1}x de {formatCurrency(Math.round(totalCents / (i + 1)))}
                                                                        {i === 0 ? ' (à vista)' : ''}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
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
                                                className={`${inputClass} resize-none`}
                                            />
                                        </div>

                                        {errorMessage && (
                                            <p className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 p-3 rounded-xl flex items-center gap-2">
                                                <AlertCircle size={14} className="shrink-0" /> {errorMessage}
                                            </p>
                                        )}

                                        {/* Total */}
                                        {isPaid && (
                                            <div className="flex items-center justify-between px-1 pt-2">
                                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</span>
                                                <span className="text-xl font-black text-paraiso-blue dark:text-white">{formatCurrency(totalCents)}</span>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={status === 'loading' || isLoadingTickets || (tickets.length > 0 && !selectedTicketId)}
                                            className="w-full py-4 mt-4 bg-paraiso-green text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-paraiso-blue transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
                                        >
                                            {status === 'loading' ? (
                                                <><Loader2 size={16} className="animate-spin" /> Processando...</>
                                            ) : (
                                                isPaid ? 'Ir para o pagamento' : 'Confirmar Inscrição'
                                            )}
                                        </button>

                                        {event.terms_url && (
                                            <p className="text-[10px] text-center text-slate-400">
                                                Ao continuar você concorda com os{' '}
                                                <a href={event.terms_url} target="_blank" rel="noreferrer" className="underline hover:text-paraiso-green">
                                                    termos do evento
                                                </a>.
                                            </p>
                                        )}
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

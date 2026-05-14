'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Tag, UserPlus, CheckCircle2, X, Loader2, AlertCircle, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface Event {
    id: string;
    title: string;
    description: string | null;
    date: string;
    time_start: string | null;
    time_end: string | null;
    location: string | null;
    image_url: string | null;
    tag: string | null;
}

interface Props {
    events: Event[];
    /** IDs dos eventos em que o usuário já está inscrito */
    registeredEventIds: string[];
}

const formatDate = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

type ModalStatus = 'idle' | 'loading' | 'success' | 'duplicate' | 'table_missing' | 'error';
type ErrorDetail = { code?: string; message?: string } | null;

export default function MembrosEventosClient({ events, registeredEventIds }: Props) {
    const supabase = createClient();
    const router = useRouter();

    // Mantém localmente quais eventos já estão inscritos (inicia com o que virou do server)
    const [registeredIds, setRegisteredIds] = useState<string[]>(registeredEventIds);

    // Modal
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [status, setStatus] = useState<ModalStatus>('idle');
    const [errorDetail, setErrorDetail] = useState<ErrorDetail>(null);

    // Hydration client-side: re-busca inscrições ao montar
    // garante que inscrições existentes sejam refletidas mesmo que
    // o servidor não tenha conseguido via RLS
    useEffect(() => {
        const fetchMyRegistrations = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('event_registrations')
                .select('event_id')
                .or(`user_id.eq.${user.id},email.eq.${user.email?.toLowerCase() ?? ''}`);

            if (data && data.length > 0) {
                setRegisteredIds(data.map((r) => r.event_id));
            }
        };
        fetchMyRegistrations();
    }, []);

    const openModal = (event: Event) => {
        setSelectedEvent(event);
        setForm({ name: '', email: '', phone: '', message: '' });
        setStatus('idle');
        setErrorDetail(null);
    };

    const closeModal = () => {
        setSelectedEvent(null);
        setStatus('idle');
        setErrorDetail(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEvent) return;
        setStatus('loading');

        const { error } = await supabase.from('event_registrations').insert({
            event_id: selectedEvent.id,
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim() || null,
            message: form.message.trim() || null,
            user_id: (await supabase.auth.getUser()).data.user?.id ?? null,
        });

        if (!error) {
            setStatus('success');
            setRegisteredIds((prev) => [...prev, selectedEvent.id]);
        } else if (error.code === '23505') {
            // Unique constraint: e-mail já inscrito nesse evento
            setStatus('duplicate');
        } else if (error.code === '42P01') {
            // Tabela não existe ainda — precisa rodar o SQL no Supabase
            console.error('[Supabase] Tabela event_registrations não encontrada. Execute supabase/event_registrations.sql no Supabase.');
            setStatus('table_missing');
        } else {
            // Exibe as propriedades reais do PostgrestError
            console.error('[Supabase error]', { code: error.code, message: error.message, details: error.details, hint: error.hint });
            setErrorDetail({ code: error.code, message: error.message });
            setStatus('error');
        }
    };

    const isRegistered = (id: string) => registeredIds.includes(id);

    return (
        <>
            {/* Events Grid */}
            {events.length === 0 ? (
                <div className="text-center py-24 text-slate-400 bg-white dark:bg-paraiso-blue rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-sm">
                    <Calendar size={56} className="mx-auto mb-4 opacity-30" />
                    <p className="text-xl font-bold">Nenhum evento programado no momento.</p>
                    <p className="text-sm mt-2">Fique atento às notificações!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => {
                        const registered = isRegistered(event.id);
                        return (
                            <div
                                key={event.id}
                                onClick={() => router.push(`/evento/${event.id}`)}
                                className="group cursor-pointer bg-white dark:bg-paraiso-blue rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 dark:border-white/10 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                {/* Imagem */}
                                <div className="relative h-52 w-full overflow-hidden">
                                    {event.image_url ? (
                                        <img
                                            src={event.image_url}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-paraiso-blue-dark/5">
                                            <Calendar size={40} className="text-paraiso-blue-dark/20" />
                                        </div>
                                    )}
                                    {event.tag && (
                                        <span className="absolute top-6 left-6 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-paraiso-blue-dark text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
                                            <Tag size={10} className="text-paraiso-green" />
                                            {event.tag}
                                        </span>
                                    )}
                                    {/* Badge de inscrito */}
                                    {registered && (
                                        <span className="absolute top-6 right-6 flex items-center gap-1.5 bg-paraiso-green text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                                            <CheckCircle2 size={11} />
                                            Inscrito
                                        </span>
                                    )}
                                </div>

                                {/* Conteúdo */}
                                <div className="p-8 flex flex-col grow">
                                    <div className="flex items-center gap-2 text-paraiso-green font-black text-xs uppercase tracking-widest mb-4">
                                        <Calendar size={14} />
                                        <span>{formatDate(event.date)}</span>
                                    </div>

                                    <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-3 group-hover:text-paraiso-blue-dark dark:group-hover:text-paraiso-green transition-colors leading-tight">
                                        {event.title}
                                    </h2>

                                    {event.description && (
                                        <p className="text-slate-500 dark:text-slate-300 text-sm leading-relaxed mb-6 grow line-clamp-3">
                                            {event.description}
                                        </p>
                                    )}

                                    {/* Horário / Local */}
                                    <div className="space-y-2 pt-6 border-t border-slate-100 dark:border-white/10 text-xs font-bold text-slate-400 dark:text-slate-300 mb-6">
                                        {(event.time_start || event.time_end) && (
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-paraiso-green" />
                                                <span>
                                                    {event.time_start?.slice(0, 5)}
                                                    {event.time_end && ` – ${event.time_end.slice(0, 5)}`}
                                                </span>
                                            </div>
                                        )}
                                        {event.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-paraiso-green" />
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Botão */}
                                    {registered ? (
                                        <div className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-paraiso-green/10 text-paraiso-green font-black text-xs uppercase tracking-widest border border-paraiso-green/20">
                                            <CheckCircle2 size={15} />
                                            Inscrição confirmada
                                        </div>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/evento/${event.id}`);
                                            }}
                                            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-paraiso-green text-white font-black text-xs uppercase tracking-widest hover:bg-paraiso-blue transition-all shadow-md mt-auto"
                                        >
                                            <UserPlus size={15} />
                                            Inscrever-se
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Modal de inscrição ── */}
            <AnimatePresence>
                {selectedEvent && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                            onClick={closeModal}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="relative w-full max-w-lg bg-white dark:bg-[#0f1a2a] rounded-3xl shadow-2xl overflow-hidden pointer-events-auto">

                                {/* Header com imagem do evento */}
                                <div
                                    className="relative h-36 flex items-end p-6"
                                    style={{
                                        background: selectedEvent.image_url
                                            ? `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.75) 100%), url(${selectedEvent.image_url}) center/cover`
                                            : 'linear-gradient(135deg, #2B4364 0%, #7C9A40 100%)',
                                    }}
                                >
                                    <div className="flex-1">
                                        {selectedEvent.tag && (
                                            <span className="px-3 py-1 bg-paraiso-green text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-2 inline-block">
                                                {selectedEvent.tag}
                                            </span>
                                        )}
                                        <h2 className="text-xl font-black text-white leading-tight">{selectedEvent.title}</h2>
                                        <p className="text-white/70 text-xs mt-1">
                                            {formatDate(selectedEvent.date)}
                                            {selectedEvent.time_start && ` · ${selectedEvent.time_start.slice(0, 5)}`}
                                            {selectedEvent.location && ` · ${selectedEvent.location}`}
                                        </p>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="p-6">

                                    {/* Sucesso */}
                                    {status === 'success' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6 space-y-4">
                                            <CheckCircle2 className="w-16 h-16 text-paraiso-green mx-auto" />
                                            <div>
                                                <h3 className="text-xl font-black text-paraiso-blue dark:text-white mb-2">Inscrição confirmada!</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                                    Você está inscrito em <strong>{selectedEvent.title}</strong>.
                                                </p>
                                            </div>
                                            <button onClick={closeModal} className="px-8 py-3 bg-paraiso-green text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-paraiso-blue transition-all">
                                                Fechar
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* Duplicado */}
                                    {status === 'duplicate' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6 space-y-4">
                                            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto" />
                                            <div>
                                                <h3 className="text-xl font-black text-paraiso-blue dark:text-white mb-2">Já inscrito!</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm">Este e-mail já foi cadastrado para este evento.</p>
                                            </div>
                                            <button onClick={closeModal} className="px-8 py-3 bg-paraiso-green text-white font-black uppercase tracking-widest text-xs rounded-full">
                                                Fechar
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* Tabela inexistente */}
                                    {status === 'table_missing' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6 space-y-4">
                                            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto" />
                                            <div>
                                                <h3 className="text-xl font-black text-paraiso-blue dark:text-white mb-2">Configuração pendente</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                                    A tabela de inscrições ainda não foi criada no banco de dados.<br />
                                                    <span className="font-bold text-orange-500">Execute o arquivo <code>supabase/event_registrations.sql</code> no Supabase.</span>
                                                </p>
                                            </div>
                                            <button onClick={() => setStatus('idle')} className="px-8 py-3 bg-slate-500 text-white font-black uppercase tracking-widest text-xs rounded-full">
                                                Fechar
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* Erro genérico */}
                                    {status === 'error' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6 space-y-4">
                                            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                                            <div>
                                                <h3 className="text-xl font-black text-paraiso-blue dark:text-white mb-2">Ocorreu um erro</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm">Não foi possível realizar a inscrição. Tente novamente.</p>
                                                {errorDetail?.message && (
                                                    <p className="text-xs text-red-400 mt-2 font-mono">{errorDetail.code}: {errorDetail.message}</p>
                                                )}
                                            </div>
                                            <button onClick={() => setStatus('idle')} className="px-8 py-3 bg-red-500 text-white font-black uppercase tracking-widest text-xs rounded-full">
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

                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input required type="text" placeholder="Nome completo" value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-paraiso-green transition-colors" />
                                            </div>

                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input required type="email" placeholder="E-mail" value={form.email}
                                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-paraiso-green transition-colors" />
                                            </div>

                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input type="tel" placeholder="Telefone / WhatsApp (opcional)" value={form.phone}
                                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-paraiso-green transition-colors" />
                                            </div>

                                            <div className="relative">
                                                <MessageSquare className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                                                <textarea rows={2} placeholder="Observação (opcional)" value={form.message}
                                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-paraiso-green transition-colors resize-none" />
                                            </div>

                                            <button type="submit" disabled={status === 'loading'}
                                                className="w-full py-4 bg-paraiso-green text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-paraiso-blue transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg">
                                                {status === 'loading' ? <><Loader2 size={16} className="animate-spin" /> Confirmando...</> : 'Confirmar Inscrição'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

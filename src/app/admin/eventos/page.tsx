'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Plus, Pencil, Trash2, Loader2, X, Check, Image as ImageIcon, CalendarDays, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

interface Event {
    id: string
    title: string
    description: string | null
    date: string
    time_start: string | null
    time_end: string | null
    location: string | null
    image_url: string | null
    tag: string | null
    published: boolean
}

const EMPTY_FORM: Omit<Event, 'id'> = {
    title: '',
    description: '',
    date: '',
    time_start: '',
    time_end: '',
    location: '',
    image_url: '',
    tag: '',
    published: true,
}

const TAGS = ['Especial', 'Família', 'Jovens', 'Crianças', 'Missões', 'Casais', 'Conferência', 'Retiro', 'Culto']

const DAYS_ORDER = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']

export default function AdminEventosPage() {
    const supabase = createClient()
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [editing, setEditing] = useState<Event | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(EMPTY_FORM)
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

    const load = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true })
        setEvents(data ?? [])
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    const openCreate = () => {
        setEditing(null)
        setForm(EMPTY_FORM)
        setShowForm(true)
    }

    const openEdit = (event: Event) => {
        setEditing(event)
        setForm({
            title: event.title,
            description: event.description ?? '',
            date: event.date,
            time_start: event.time_start ?? '',
            time_end: event.time_end ?? '',
            location: event.location ?? '',
            image_url: event.image_url ?? '',
            tag: event.tag ?? '',
            published: event.published,
        })
        setShowForm(true)
    }

    const closeForm = () => {
        setShowForm(false)
        setEditing(null)
        setForm(EMPTY_FORM)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        const payload = {
            ...form,
            time_start: form.time_start || null,
            time_end: form.time_end || null,
            description: form.description || null,
            location: form.location || null,
            image_url: form.image_url || null,
            tag: form.tag || null,
        }

        if (editing) {
            await supabase.from('events').update(payload).eq('id', editing.id)
        } else {
            await supabase.from('events').insert(payload)
        }

        setSaving(false)
        closeForm()
        await load()
    }

    const handleDelete = async (id: string) => {
        setDeleting(id)
        await supabase.from('events').delete().eq('id', id)
        setDeleting(null)
        setConfirmDelete(null)
        await load()
    }

    const formatDate = (d: string) =>
        new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-20">
            <div className="max-w-5xl mx-auto px-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/admin" className="text-slate-500 hover:text-slate-300 text-sm flex items-center gap-1 mb-3 transition-colors">
                            <ChevronLeft size={14} /> Painel Admin
                        </Link>
                        <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                            <CalendarDays className="text-blue-400" size={28} />
                            Eventos
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">{events.length} evento(s) cadastrado(s)</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-widest px-5 py-3 rounded-2xl transition-colors shadow-lg"
                    >
                        <Plus size={16} /> Novo Evento
                    </button>
                </div>

                {/* Event List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-blue-400" size={36} />
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 text-slate-600">
                        <CalendarDays size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-bold">Nenhum evento cadastrado.</p>
                        <p className="text-sm mt-1">Clique em "Novo Evento" para começar.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-700 transition-all"
                            >
                                {/* Image thumb */}
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                                    {event.image_url ? (
                                        <img src={event.image_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                                            <ImageIcon size={20} />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-black text-white truncate">{event.title}</p>
                                        {event.tag && (
                                            <span className="text-[10px] font-black uppercase tracking-widest bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-600/30">
                                                {event.tag}
                                            </span>
                                        )}
                                        {!event.published && (
                                            <span className="text-[10px] font-black uppercase tracking-widest bg-orange-600/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-600/30">
                                                Rascunho
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-400 text-sm mt-0.5">
                                        {formatDate(event.date)}
                                        {event.time_start && ` · ${event.time_start.slice(0, 5)}`}
                                        {event.time_end && `–${event.time_end.slice(0, 5)}`}
                                        {event.location && ` · ${event.location}`}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {confirmDelete === event.id ? (
                                        <>
                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                disabled={!!deleting}
                                                className="flex items-center gap-1 text-xs font-black uppercase tracking-widest bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-xl transition-colors"
                                            >
                                                {deleting === event.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                                Confirmar
                                            </button>
                                            <button
                                                onClick={() => setConfirmDelete(null)}
                                                className="text-slate-500 hover:text-slate-300 p-2 rounded-xl transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => openEdit(event)}
                                                className="text-slate-400 hover:text-blue-400 p-2 rounded-xl hover:bg-blue-400/10 transition-all"
                                                title="Editar"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => setConfirmDelete(event.id)}
                                                className="text-slate-400 hover:text-red-400 p-2 rounded-xl hover:bg-red-400/10 transition-all"
                                                title="Excluir"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Slide-in Form Panel */}
            {showForm && (
                <div className="fixed inset-0 z-[100] flex">
                    <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={closeForm} />
                    <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full overflow-y-auto shadow-2xl pb-32">
                        <div className="p-7">
                            <div className="flex items-center justify-between mb-7">
                                <h2 className="text-xl font-black text-white">
                                    {editing ? 'Editar Evento' : 'Novo Evento'}
                                </h2>
                                <button onClick={closeForm} className="text-slate-500 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-5">
                                <Field label="Título *">
                                    <input
                                        required
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        placeholder="Ex: Retiro de Jovens"
                                        className="input-dark"
                                    />
                                </Field>

                                <Field label="Descrição">
                                    <textarea
                                        value={form.description ?? ''}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        rows={3}
                                        placeholder="Descrição do evento..."
                                        className="input-dark resize-none"
                                    />
                                </Field>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Data *">
                                        <input
                                            required
                                            type="date"
                                            value={form.date}
                                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                                            className="input-dark"
                                        />
                                    </Field>
                                    <Field label="Categoria">
                                        <select
                                            value={form.tag ?? ''}
                                            onChange={(e) => setForm({ ...form, tag: e.target.value })}
                                            className="input-dark appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%2364748b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10"
                                        >
                                            <option value="">Sem categoria</option>
                                            {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </Field>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Horário início">
                                        <input
                                            type="time"
                                            value={form.time_start ?? ''}
                                            onChange={(e) => setForm({ ...form, time_start: e.target.value })}
                                            className="input-dark"
                                        />
                                    </Field>
                                    <Field label="Horário fim">
                                        <input
                                            type="time"
                                            value={form.time_end ?? ''}
                                            onChange={(e) => setForm({ ...form, time_end: e.target.value })}
                                            className="input-dark"
                                        />
                                    </Field>
                                </div>

                                <Field label="Local">
                                    <input
                                        value={form.location ?? ''}
                                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                                        placeholder="Ex: Templo Principal"
                                        className="input-dark"
                                    />
                                </Field>

                                <Field label="URL da imagem">
                                    <input
                                        type="url"
                                        value={form.image_url ?? ''}
                                        onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                        placeholder="https://..."
                                        className="input-dark"
                                    />
                                    {form.image_url && (
                                        <img src={form.image_url} alt="" className="mt-2 h-24 w-full object-cover rounded-lg opacity-80" />
                                    )}
                                </Field>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div
                                        onClick={() => setForm({ ...form, published: !form.published })}
                                        className={`w-11 h-6 rounded-full transition-colors duration-300 relative ${form.published ? 'bg-blue-600' : 'bg-slate-700'}`}
                                    >
                                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${form.published ? 'translate-x-5' : ''}`} />
                                    </div>
                                    <span className="text-slate-300 text-sm font-bold">
                                        {form.published ? 'Publicado' : 'Rascunho'}
                                    </span>
                                </label>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeForm}
                                        className="flex-1 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 font-bold text-sm py-3 rounded-2xl transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-widest py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                        {saving ? 'Salvando...' : 'Salvar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .input-dark {
                    display: block;
                    width: 100%;
                    box-sizing: border-box;
                    background: #0f172a;
                    border: 1px solid #1e293b;
                    border-radius: 0.75rem;
                    padding: 0.75rem 1rem;
                    color: #e2e8f0;
                    font-size: 0.95rem;
                    outline: none;
                    transition: border-color 0.2s, background-color 0.2s;
                    appearance: none;
                    -webkit-appearance: none;
                }
                .input-dark:focus { 
                    border-color: #3b82f6; 
                    background: #1e293b;
                }
                .input-dark option { background: #0f172a; }

                /* Ajuste específico para garantir que data e hora não "vazem" no mobile */
                input[type="date"].input-dark,
                input[type="time"].input-dark {
                    min-height: 3rem; /* Garante altura consistente */
                }
            `}</style>
        </div>
    )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">{label}</label>
            {children}
        </div>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Plus, Pencil, Trash2, Loader2, X, Check, ListChecks, ChevronLeft, GripVertical } from 'lucide-react'
import Link from 'next/link'

interface Schedule {
    id: string
    title: string
    day_of_week: string
    time_start: string
    location: string | null
    description: string | null
    active: boolean
    sort_order: number
}

const EMPTY_FORM: Omit<Schedule, 'id'> = {
    title: '',
    day_of_week: 'Domingo',
    time_start: '18:00',
    location: '',
    description: '',
    active: true,
    sort_order: 0,
}

const DAYS = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
]

const DAY_ORDER: Record<string, number> = {
    'Domingo': 0, 'Segunda-feira': 1, 'Terça-feira': 2,
    'Quarta-feira': 3, 'Quinta-feira': 4, 'Sexta-feira': 5, 'Sábado': 6,
}

export default function AdminProgramacaoPage() {
    const supabase = createClient()
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [editing, setEditing] = useState<Schedule | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(EMPTY_FORM)
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

    const load = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('schedules')
            .select('*')
            .order('sort_order', { ascending: true })
        setSchedules(data ?? [])
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    // Group by day
    const grouped = DAYS.reduce<Record<string, Schedule[]>>((acc, day) => {
        const items = schedules.filter((s) => s.day_of_week === day)
        if (items.length > 0) acc[day] = items
        return acc
    }, {})

    const openCreate = () => {
        setEditing(null)
        setForm(EMPTY_FORM)
        setShowForm(true)
    }

    const openEdit = (s: Schedule) => {
        setEditing(s)
        setForm({
            title: s.title,
            day_of_week: s.day_of_week,
            time_start: s.time_start,
            location: s.location ?? '',
            description: s.description ?? '',
            active: s.active,
            sort_order: s.sort_order,
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
            location: form.location || null,
            description: form.description || null,
            sort_order: form.sort_order || DAY_ORDER[form.day_of_week] * 10,
        }

        if (editing) {
            await supabase.from('schedules').update(payload).eq('id', editing.id)
        } else {
            await supabase.from('schedules').insert(payload)
        }

        setSaving(false)
        closeForm()
        await load()
    }

    const handleDelete = async (id: string) => {
        setDeleting(id)
        await supabase.from('schedules').delete().eq('id', id)
        setDeleting(null)
        setConfirmDelete(null)
        await load()
    }

    const toggleActive = async (s: Schedule) => {
        await supabase.from('schedules').update({ active: !s.active }).eq('id', s.id)
        await load()
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/admin" className="text-slate-500 hover:text-slate-300 text-sm flex items-center gap-1 mb-3 transition-colors">
                            <ChevronLeft size={14} /> Painel Admin
                        </Link>
                        <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                            <ListChecks className="text-emerald-400" size={28} />
                            Programação Semanal
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">{schedules.length} item(s) na programação</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-widest px-5 py-3 rounded-2xl transition-colors shadow-lg"
                    >
                        <Plus size={16} /> Novo Item
                    </button>
                </div>

                {/* Grouped schedule */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-emerald-400" size={36} />
                    </div>
                ) : schedules.length === 0 ? (
                    <div className="text-center py-20 text-slate-600">
                        <ListChecks size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-bold">Nenhum item cadastrado.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(grouped).map(([day, items]) => (
                            <div key={day}>
                                <h2 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-0.5 bg-emerald-700 inline-block" />
                                    {day}
                                </h2>
                                <div className="space-y-2">
                                    {items.map((s) => (
                                        <div
                                            key={s.id}
                                            className={`bg-slate-900 border rounded-2xl p-4 flex items-center gap-4 transition-all ${s.active ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/50 opacity-50'
                                                }`}
                                        >
                                            {/* Time pill */}
                                            <div className="bg-emerald-600/20 text-emerald-400 font-black text-sm px-3 py-1.5 rounded-xl shrink-0 border border-emerald-600/30">
                                                {s.time_start.slice(0, 5)}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-black text-white">{s.title}</p>
                                                {s.location && (
                                                    <p className="text-slate-500 text-xs mt-0.5">{s.location}</p>
                                                )}
                                            </div>

                                            {/* Active toggle */}
                                            <button
                                                onClick={() => toggleActive(s)}
                                                className={`text-xs font-bold px-2.5 py-1 rounded-full transition-all ${s.active
                                                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 hover:bg-red-600/10 hover:text-red-400 hover:border-red-600/30'
                                                    : 'bg-slate-800 text-slate-500 border border-slate-700 hover:bg-emerald-600/10 hover:text-emerald-400'
                                                    }`}
                                                title={s.active ? 'Desativar' : 'Ativar'}
                                            >
                                                {s.active ? 'Ativo' : 'Inativo'}
                                            </button>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1 shrink-0">
                                                {confirmDelete === s.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleDelete(s.id)}
                                                            disabled={!!deleting}
                                                            className="flex items-center gap-1 text-xs font-black bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-xl transition-colors"
                                                        >
                                                            {deleting === s.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                                            Confirmar
                                                        </button>
                                                        <button onClick={() => setConfirmDelete(null)} className="text-slate-500 hover:text-slate-300 p-2">
                                                            <X size={14} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => openEdit(s)} className="text-slate-500 hover:text-emerald-400 p-2 rounded-xl hover:bg-emerald-400/10 transition-all" title="Editar">
                                                            <Pencil size={15} />
                                                        </button>
                                                        <button onClick={() => setConfirmDelete(s.id)} className="text-slate-500 hover:text-red-400 p-2 rounded-xl hover:bg-red-400/10 transition-all" title="Excluir">
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
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
                    <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full overflow-y-auto shadow-2xl pb-32">
                        <div className="p-7">
                            <div className="flex items-center justify-between mb-7">
                                <h2 className="text-xl font-black text-white">
                                    {editing ? 'Editar Item' : 'Novo Item'}
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
                                        placeholder="Ex: Culto de Celebração"
                                        className="input-dark"
                                    />
                                </Field>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Dia da semana *">
                                        <select
                                            value={form.day_of_week}
                                            onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
                                            className="input-dark appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%2364748b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10"
                                        >
                                            {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </Field>
                                    <Field label="Horário *">
                                        <input
                                            required
                                            type="time"
                                            value={form.time_start}
                                            onChange={(e) => setForm({ ...form, time_start: e.target.value })}
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

                                <Field label="Descrição">
                                    <textarea
                                        value={form.description ?? ''}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        rows={2}
                                        placeholder="Informações adicionais..."
                                        className="input-dark resize-none"
                                    />
                                </Field>

                                <Field label="Ordem de exibição">
                                    <input
                                        type="number"
                                        value={form.sort_order}
                                        onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                                        className="input-dark"
                                        min={0}
                                    />
                                </Field>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div
                                        onClick={() => setForm({ ...form, active: !form.active })}
                                        className={`w-11 h-6 rounded-full transition-colors duration-300 relative ${form.active ? 'bg-emerald-600' : 'bg-slate-700'}`}
                                    >
                                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${form.active ? 'translate-x-5' : ''}`} />
                                    </div>
                                    <span className="text-slate-300 text-sm font-bold">
                                        {form.active ? 'Ativo' : 'Inativo'}
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
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-widest py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
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
                    color-scheme: dark; /* Garante que os ícones nativos (calendário/relógio) fiquem claros */
                }
                .input-dark:focus { 
                    border-color: #10b981; 
                    background: #1e293b;
                }
                .input-dark option { background: #0f172a; }

                /* Ajuste específico para garantir que os ícones nativos do navegador apareçam com contraste */
                .input-dark::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    opacity: 0.5;
                    cursor: pointer;
                }
                .input-dark::-webkit-calendar-picker-indicator:hover {
                    opacity: 1;
                }

                /* Ajuste específico para garantir que campos de tempo não "vazem" no mobile */
                input[type="time"].input-dark {
                    min-height: 3rem;
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

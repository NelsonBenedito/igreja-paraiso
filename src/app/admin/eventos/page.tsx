'use client'

import { useState, useEffect, useTransition, useRef } from 'react'
import { Plus, Pencil, Trash2, Loader2, X, Check, Image as ImageIcon, CalendarDays, ChevronLeft, AlertCircle, Upload } from 'lucide-react'
import Link from 'next/link'
import {
  fetchAdminEventsAction,
  createEventAction,
  updateEventAction,
  deleteEventAction,
} from './actions'
import type { AdminEventDto } from '@/lib/admin-api/client'

interface FormState {
  title: string
  description: string
  date: string
  time_start: string
  time_end: string
  location: string
  image_url: string
  tag: string
  published: boolean
}

const EMPTY_FORM: FormState = {
  title: '', description: '', date: '', time_start: '',
  time_end: '', location: '', image_url: '', tag: '', published: true,
}

async function uploadCoverImage(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/admin/upload-cover', { method: 'POST', body: fd })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Erro ${res.status}`)
  }
  const data = await res.json()
  return data.url as string
}

const TAGS = ['Especial', 'Família', 'Jovens', 'Crianças', 'Missões', 'Casais', 'Conferência', 'Retiro', 'Culto']

export default function AdminEventosPage() {
  const [events, setEvents] = useState<AdminEventDto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [editing, setEditing] = useState<AdminEventDto | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const load = async () => {
    setLoading(true)
    setApiError(null)
    const result = await fetchAdminEventsAction()
    if (result.useFallback && result.error) {
      setApiError('A API admin não está configurada ou indisponível. Configure CHURCHMANAGER_ADMIN_TOKEN.')
    }
    setEvents(result.items)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const openEdit = (event: AdminEventDto) => {
    setEditing(event)
    setForm({
      title: event.title,
      description: event.description ?? '',
      date: event.date,
      time_start: event.timeStart ?? '',
      time_end: event.timeEnd ?? '',
      location: event.location ?? '',
      image_url: event.imageUrl ?? '',
      tag: event.tags?.[0] ?? '',
      published: event.published,
    })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm(EMPTY_FORM)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const body = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      date: form.date,
      timeStart: form.time_start || null,
      timeEnd: form.time_end || null,
      location: form.location.trim() || null,
      imageUrl: form.image_url.trim() || null,
      tags: form.tag ? [form.tag] : [],
      published: form.published,
    }

    startTransition(async () => {
      try {
        if (editing) {
          await updateEventAction(editing.id, body)
        } else {
          await createEventAction(body)
        }
        closeForm()
        await load()
      } catch (err) {
        alert('Erro ao salvar: ' + (err instanceof Error ? err.message : String(err)))
      }
    })
  }

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecione um arquivo de imagem.')
      return
    }
    setUploadingImage(true)
    try {
      const url = await uploadCoverImage(file)
      setForm((f) => ({ ...f, image_url: url }))
    } catch (err) {
      alert('Erro no upload: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setUploadingImage(false)
    }
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteEventAction(id)
        setConfirmDelete(null)
        await load()
      } catch (err) {
        alert('Erro ao excluir: ' + (err instanceof Error ? err.message : String(err)))
      }
    })
  }

  const formatDate = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

  const isSaving = isPending && showForm
  const isDeleting = (id: string) => isPending && confirmDelete === id

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm flex items-center gap-1 mb-3 transition-colors">
              <ChevronLeft size={14} /> Painel Admin
            </Link>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-3">
              <CalendarDays className="text-blue-400" size={28} />
              Eventos
            </h1>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">{events.length} evento(s) cadastrado(s)</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-widest px-5 py-3 rounded-2xl transition-colors shadow-lg"
          >
            <Plus size={16} /> Novo Evento
          </button>
        </div>

        {/* API Warning */}
        {apiError && (
          <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-4 mb-6">
            <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-amber-700 dark:text-amber-300 text-sm font-medium">{apiError}</p>
          </div>
        )}

        {/* Event List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-400" size={36} />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-slate-600">
            <CalendarDays size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-bold">Nenhum evento cadastrado.</p>
            <p className="text-sm mt-1">Clique em &quot;Novo Evento&quot; para começar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm dark:shadow-none transition-all"
              >
                {/* Image thumb */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                  {event.imageUrl ? (
                    <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
                      <ImageIcon size={20} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-black text-slate-900 dark:text-white truncate">{event.title}</p>
                    {event.tag ? (
                      <span className="text-[10px] font-black uppercase tracking-widest bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-600/30">
                        {event.tag}
                      </span>
                    ) : null}
                    {!event.published && (
                      <span className="text-[10px] font-black uppercase tracking-widest bg-orange-600/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-600/30">
                        Rascunho
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                    {formatDate(event.date)}
                    {event.timeStart && ` · ${event.timeStart.slice(0, 5)}`}
                    {event.timeEnd && `–${event.timeEnd.slice(0, 5)}`}
                    {event.location && ` · ${event.location}`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {confirmDelete === event.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(event.id)}
                        disabled={isPending}
                        className="flex items-center gap-1 text-xs font-black uppercase tracking-widest bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-xl transition-colors"
                      >
                        {isDeleting(event.id) ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                        Confirmar
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 p-2 rounded-xl transition-colors"
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
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full overflow-y-auto shadow-2xl pb-32">
            <div className="p-7">
              <div className="flex items-center justify-between mb-7">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {editing ? 'Editar Evento' : 'Novo Evento'}
                </h2>
                <button onClick={closeForm} className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
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

                <Field label="Imagem da capa">
                  {/* Drop zone */}
                  <div
                    className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden cursor-pointer hover:border-blue-400 transition-colors"
                    style={{ minHeight: '96px' }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault() }}
                    onDrop={(e) => {
                      e.preventDefault()
                      const file = e.dataTransfer.files?.[0]
                      if (file) handleImageFile(file)
                    }}
                  >
                    {form.image_url ? (
                      <img src={form.image_url} alt="" className="w-full h-24 object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-24 text-slate-400 gap-2">
                        {uploadingImage ? <Loader2 size={24} className="animate-spin text-blue-400" /> : <Upload size={24} />}
                        <span className="text-xs font-bold">{uploadingImage ? 'Enviando...' : 'Clique ou arraste uma imagem'}</span>
                      </div>
                    )}
                    {form.image_url && uploadingImage && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 size={28} className="animate-spin text-white" />
                      </div>
                    )}
                    {form.image_url && !uploadingImage && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setForm((f) => ({ ...f, image_url: '' })) }}
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); e.target.value = '' }}
                  />
                  {/* URL manual (fallback) */}
                  <input
                    type="url"
                    value={form.image_url ?? ''}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="Ou cole uma URL de imagem..."
                    className="input-dark mt-2 text-xs"
                  />
                </Field>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setForm({ ...form, published: !form.published })}
                    className={`w-11 h-6 rounded-full transition-colors duration-300 relative ${form.published ? 'bg-blue-600' : 'bg-slate-700'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${form.published ? 'translate-x-5' : ''}`} />
                  </div>
                  <span className="text-slate-600 dark:text-slate-300 text-sm font-bold">
                    {form.published ? 'Publicado' : 'Rascunho'}
                  </span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-600 font-bold text-sm py-3 rounded-2xl transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-widest py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .input-dark {
          display: block; width: 100%; box-sizing: border-box;
          background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem;
          padding: 0.75rem 1rem; color: #1e293b; font-size: 0.95rem;
          outline: none; transition: border-color 0.2s, background-color 0.2s;
          appearance: none; -webkit-appearance: none; color-scheme: light;
        }
        .input-dark:focus { border-color: #3b82f6; background: #f1f5f9; }
        .input-dark option { background: #f8fafc; }
        .dark .input-dark { background: #0f172a; border-color: #1e293b; color: #e2e8f0; color-scheme: dark; }
        .dark .input-dark:focus { border-color: #3b82f6; background: #1e293b; }
        .dark .input-dark option { background: #0f172a; }
        .dark .input-dark::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.5; cursor: pointer; }
        .dark .input-dark::-webkit-calendar-picker-indicator:hover { opacity: 1; }
        input[type="date"].input-dark, input[type="time"].input-dark { min-height: 3rem; }
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

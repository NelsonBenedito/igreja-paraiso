'use client'

import { useState, useEffect } from 'react'
import { Users, ChevronLeft, Loader2, Download, Search, CalendarDays, Mail, Phone, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { fetchAdminRegistrationsAction } from './actions'
import type { AdminRegistrationDto } from '@/lib/admin-api/client'

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

const formatDateTime = (d: string) =>
  new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export default function AdminInscricoesPage() {
  const [registrations, setRegistrations] = useState<AdminRegistrationDto[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterEvent, setFilterEvent] = useState('')

  const load = async () => {
    setLoading(true)
    setApiError(null)
    const result = await fetchAdminRegistrationsAction()
    if (result.useFallback && result.error) {
      setApiError('A API admin não está configurada. Configure CHURCHMANAGER_ADMIN_TOKEN.')
    }
    setRegistrations(result.items)
    setLoading(false)
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load() }, [])

  const eventTitles = [...new Set(registrations.map((r) => r.event?.title).filter(Boolean))] as string[]

  const filtered = registrations.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
    const matchEvent = filterEvent ? r.event?.title === filterEvent : true
    return matchSearch && matchEvent
  })

  const exportCSV = () => {
    const headers = ['Nome', 'E-mail', 'Telefone', 'Evento', 'Data do Evento', 'Inscrição em', 'Mensagem']
    const rows = filtered.map((r) => [
      r.name,
      r.email,
      r.phone ?? '',
      r.event?.title ?? '',
      r.event?.date ? formatDate(r.event.date) : '',
      formatDateTime(r.createdAt),
      r.message ?? '',
    ])
    const csv = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inscricoes_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/admin" className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm flex items-center gap-1 mb-3 transition-colors">
              <ChevronLeft size={14} /> Painel Admin
            </Link>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-3">
              <Users className="text-paraiso-green" size={28} />
              Inscrições em Eventos
            </h1>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
              {registrations.length} inscrição(ões) no total
            </p>
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-paraiso-green hover:bg-paraiso-blue text-white font-black text-sm uppercase tracking-widest px-5 py-3 rounded-2xl transition-colors shadow-lg"
          >
            <Download size={16} /> Exportar CSV
          </button>
        </div>

        {/* API Warning */}
        {apiError && (
          <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-4 mb-6">
            <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-amber-700 dark:text-amber-300 text-sm font-medium">{apiError}</p>
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-paraiso-green transition-colors"
            />
          </div>
          <select
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:border-paraiso-green transition-colors"
          >
            <option value="">Todos os eventos</option>
            {eventTitles.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Tabela */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-paraiso-green" size={36} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500 dark:text-slate-600">
            <Users size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold">Nenhuma inscrição encontrada.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Nome</th>
                    <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Contato</th>
                    <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Evento</th>
                    <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Inscrição</th>
                    <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Obs.</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr
                      key={r.id}
                      className={`border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${i === filtered.length - 1 ? 'border-none' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-black text-slate-900 dark:text-white">{r.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
                          <Mail size={11} /><span>{r.email}</span>
                        </div>
                        {r.phone && (
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <Phone size={11} /><span>{r.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 dark:text-white text-xs">{r.event?.title}</p>
                        {r.event?.date && (
                          <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                            <CalendarDays size={10} />
                            {formatDate(r.event.date + 'T12:00:00')}
                          </div>
                        )}
                        {r.event?.tag && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-paraiso-green/10 text-paraiso-green text-[10px] font-black uppercase tracking-widest rounded-full">
                            {r.event.tag}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">
                        {formatDateTime(r.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs max-w-[160px]">
                        <p className="truncate">{r.message ?? '—'}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 font-bold">
              {filtered.length} resultado(s)
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

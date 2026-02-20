'use client'

import { useState, useEffect, useTransition } from 'react'
import type { Role, MemberWithRoles } from '@/types'
import { getAllRoles, getMembersWithRoles, assignRole, removeRole } from '@/services/roles'
import { RoleBadge } from './RoleBadge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Shield, Search, ChevronDown, ChevronUp, Loader2, UserCog, X, Check } from 'lucide-react'

interface ManageRolesModalProps {
    currentUserId: string
}

export default function ManageRolesModal({ currentUserId }: ManageRolesModalProps) {
    const [open, setOpen] = useState(false)
    const [members, setMembers] = useState<MemberWithRoles[]>([])
    const [allRoles, setAllRoles] = useState<Role[]>([])
    const [search, setSearch] = useState('')
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const load = async () => {
        setLoading(true)
        try {
            const [m, r] = await Promise.all([getMembersWithRoles(), getAllRoles()])
            setMembers(m)
            setAllRoles(r)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (open) load()
    }, [open])

    const filteredMembers = members.filter((m) =>
        (m.full_name || m.email).toLowerCase().includes(search.toLowerCase())
    )

    const hasRole = (member: MemberWithRoles, role: Role) =>
        member.roles.some((r) => r.id === role.id)

    const toggleRole = async (member: MemberWithRoles, role: Role) => {
        const key = `${member.id}-${role.id}`
        setActionLoading(key)
        try {
            if (hasRole(member, role)) {
                await removeRole(member.id, role.id)
            } else {
                await assignRole(member.id, role.id, currentUserId)
            }
            await load()
        } catch (e) {
            console.error('Erro ao alterar cargo:', e)
            alert('Erro ao alterar cargo. Verifique se você é administrador.')
        } finally {
            setActionLoading(null)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-violet-600 hover:text-violet-800 transition-colors cursor-pointer bg-transparent border-0 p-0">
                    <Shield size={14} />
                    Gerenciar Cargos
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-black text-slate-800">
                        <UserCog className="text-violet-600" size={22} />
                        Gerenciar Cargos de Membros
                    </DialogTitle>
                </DialogHeader>

                {/* Search */}
                <div className="relative mt-2">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar membro..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                    />
                </div>

                {/* Member List */}
                <div className="flex-1 overflow-y-auto mt-2 space-y-2 pr-1">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="animate-spin text-violet-500" size={32} />
                        </div>
                    ) : filteredMembers.length === 0 ? (
                        <p className="text-center text-slate-400 py-10 text-sm">Nenhum membro encontrado.</p>
                    ) : (
                        filteredMembers.map((member) => {
                            const isExpanded = expandedId === member.id
                            const displayName = member.full_name || member.email
                            const initials = displayName.slice(0, 2).toUpperCase()

                            return (
                                <div
                                    key={member.id}
                                    className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden"
                                >
                                    {/* Member Row */}
                                    <div
                                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                                        onClick={() => setExpandedId(isExpanded ? null : member.id)}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center overflow-hidden shrink-0">
                                                {member.avatar_url ? (
                                                    <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-violet-700 font-bold text-sm">{initials}</span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-800 text-sm truncate">{displayName}</p>
                                                <p className="text-slate-400 text-xs truncate">{member.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0 ml-3">
                                            <div className="hidden sm:flex flex-wrap gap-1 justify-end max-w-[200px]">
                                                {member.roles.slice(0, 3).map((r) => (
                                                    <RoleBadge key={r.id} role={r} size="sm" />
                                                ))}
                                                {member.roles.length > 3 && (
                                                    <span className="text-[10px] text-slate-400 font-bold">
                                                        +{member.roles.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                            {isExpanded ? (
                                                <ChevronUp size={16} className="text-slate-400" />
                                            ) : (
                                                <ChevronDown size={16} className="text-slate-400" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Roles Selector (expanded) */}
                                    {isExpanded && (
                                        <div className="border-t border-slate-100 px-4 py-4 bg-slate-50">
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                                                Cargos atribuídos
                                            </p>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {allRoles.map((role) => {
                                                    const active = hasRole(member, role)
                                                    const key = `${member.id}-${role.id}`
                                                    const isLoading = actionLoading === key

                                                    return (
                                                        <button
                                                            key={role.id}
                                                            onClick={() => toggleRole(member, role)}
                                                            disabled={!!actionLoading}
                                                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all duration-200 ${active
                                                                    ? 'border-transparent text-white shadow-md'
                                                                    : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white hover:bg-slate-50'
                                                                }`}
                                                            style={active ? { backgroundColor: role.color } : {}}
                                                        >
                                                            {isLoading ? (
                                                                <Loader2 size={14} className="animate-spin" />
                                                            ) : active ? (
                                                                <Check size={14} />
                                                            ) : (
                                                                <span
                                                                    className="w-3 h-3 rounded-full border-2"
                                                                    style={{ borderColor: role.color }}
                                                                />
                                                            )}
                                                            {role.label}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    )}
                </div>

                <p className="text-xs text-slate-400 text-center pt-2 border-t border-slate-100">
                    Apenas administradores podem atribuir e remover cargos.
                </p>
            </DialogContent>
        </Dialog>
    )
}

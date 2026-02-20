'use client'

import type { Role } from '@/types'

const roleIcons: Record<string, string> = {
    admin: '🛡️',
    pastor: '✝️',
    secretario: '📋',
    tesoureiro: '💰',
    instrutor: '📚',
    aluno: '🎓',
    membro: '⛪',
    visitante: '👋',
}

interface RoleBadgeProps {
    role: Role
    size?: 'sm' | 'md'
}

export function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
    const isSmall = size === 'sm'

    return (
        <span
            className={`inline-flex items-center gap-1 font-bold rounded-full border ${isSmall ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'
                }`}
            style={{
                backgroundColor: `${role.color}18`,
                borderColor: `${role.color}40`,
                color: role.color,
            }}
        >
            <span>{roleIcons[role.name] ?? '🏷️'}</span>
            <span className="uppercase tracking-wider">{role.label}</span>
        </span>
    )
}

interface RoleBadgeListProps {
    roles: Role[]
    size?: 'sm' | 'md'
    emptyLabel?: string
}

export function RoleBadgeList({ roles, size = 'md', emptyLabel = 'Sem cargo atribuído' }: RoleBadgeListProps) {
    if (!roles || roles.length === 0) {
        return (
            <span className="text-xs text-slate-400 italic">{emptyLabel}</span>
        )
    }

    return (
        <div className="flex flex-wrap gap-1.5">
            {roles.map((role) => (
                <RoleBadge key={role.id} role={role} size={size} />
            ))}
        </div>
    )
}

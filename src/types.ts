// ── Roles / Cargos ──────────────────────────────────────────
export type RoleName = 'admin' | 'pastor' | 'secretario' | 'tesoureiro' | 'instrutor' | 'aluno' | 'membro' | 'visitante'

export interface Role {
    id: number
    name: RoleName
    label: string
    description?: string
    color: string
    created_at?: string
}

export interface UserRole {
    id: number
    user_id: string
    role_id: number
    assigned_by?: string
    assigned_at: string
    role?: Role
}

export interface MemberWithRoles {
    id: string
    full_name: string | null
    avatar_url: string | null
    email: string
    member_since: string
    roles: Role[]
}

// ── Navigation ───────────────────────────────────────────────
export interface NavItem {
    label: string;
    href: string;
}

export interface ServiceTime {
    day: string;
    time: string;
    type: string;
}

export interface Event {
    id: string;
    title: string;
    date: string;
    description: string;
    image: string;
}

export interface Ministry {
    id: string;
    name: string;
    description: string;
    image: string;
    icon: string;
}

export interface Mission {
    id: string;
    name: string;
    role: string;
    location: string;
    image: string;
}

export interface MissionChurch {
    id: string;
    name: string;
    location: string;
    address: string;
    image: string;
    mapsUrl: string;
    pastor: string;
}

export interface Sermon {
    id: string;
    title: string;
    preacher: string;
    date: string;
    thumbnail: string;
    category: string;
}

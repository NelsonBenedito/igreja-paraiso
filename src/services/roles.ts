import { createClient } from '@/utils/supabase/client'
import type { Role, MemberWithRoles } from '@/types'

// Fetch all available roles
export async function getAllRoles(): Promise<Role[]> {
    const supabase = createClient()
    const { data, error } = await supabase.from('roles').select('*').order('label')
    if (error) throw error
    return data as Role[]
}

// Fetch current user's roles
export async function getMyRoles(userId: string): Promise<Role[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('user_roles')
        .select('role:roles(*)')
        .eq('user_id', userId)

    if (error) throw error
    return (data?.map((row: any) => row.role) ?? []) as Role[]
}

// Fetch all members with their roles (admin only)
export async function getMembersWithRoles(): Promise<MemberWithRoles[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('members_with_roles')
        .select('*')
        .order('full_name')

    if (error) throw error
    return data as MemberWithRoles[]
}

// Assign a role to a user (admin only)
export async function assignRole(userId: string, roleId: number, assignedBy: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role_id: roleId, assigned_by: assignedBy })

    if (error) throw error
}

// Remove a role from a user (admin only)
export async function removeRole(userId: string, roleId: number): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role_id', roleId)

    if (error) throw error
}

// Check if a user has a specific role
export async function userHasRole(userId: string, roleName: string): Promise<boolean> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('user_roles')
        .select('role:roles!inner(name)')
        .eq('user_id', userId)
        .eq('roles.name', roleName)
        .maybeSingle()

    if (error) return false
    return !!data
}

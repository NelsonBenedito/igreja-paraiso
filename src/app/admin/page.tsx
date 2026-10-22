import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    let membersCount = 0
    try {
        const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
        membersCount = count ?? 0
    } catch (err) {
        console.error("[admin-dashboard] Falha ao buscar contagem de membros:", err);
    }

    return <AdminDashboard user={user} membersCount={membersCount} />
}

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Count stats
    const [{ count: eventsCount }, { count: schedulesCount }, { count: membersCount }] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('schedules').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
    ])

    const stats = {
        eventsCount: eventsCount ?? 0,
        schedulesCount: schedulesCount ?? 0,
        membersCount: membersCount ?? 0,
    }

    return <AdminDashboard user={user} stats={stats} />
}

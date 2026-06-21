import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'
import { isAdminApiConfigured, adminGetEventsDashboard, adminListSchedules } from '@/lib/admin-api/client'

export default async function AdminPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    let stats = {
        eventsCount: 0,
        schedulesCount: 0,
        membersCount: 0,
        registrationsCount: 0,
    }

    if (isAdminApiConfigured()) {
        const [dashboardResult, schedules] = await Promise.all([
            adminGetEventsDashboard().catch((err) => {
                console.error("[admin-dashboard] Falha ao buscar contadores de eventos:", err);
                return null;
            }),
            adminListSchedules().catch((err) => {
                console.error("[admin-dashboard] Falha ao buscar programações:", err);
                return [];
            }),
        ])

        let membersCount = 0
        try {
            const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
            membersCount = count ?? 0
        } catch (err) {
            console.error("[admin-dashboard] Falha ao buscar contagem de membros:", err);
        }

        stats = {
            eventsCount: dashboardResult?.totalEvents ?? 0,
            registrationsCount: dashboardResult?.totalRegistrations ?? 0,
            schedulesCount: schedules.length,
            membersCount: membersCount,
        }
    } else {
        // Sem API administrativa configurada, exibe apenas os membros cadastrados locais do Supabase Auth
        let membersCount = 0
        try {
            const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
            membersCount = count ?? 0
        } catch (err) {
            console.error("[admin-dashboard] Falha ao buscar contagem de membros:", err);
        }

        stats = {
            eventsCount: 0,
            registrationsCount: 0,
            schedulesCount: 0,
            membersCount: membersCount,
        }
    }

    return <AdminDashboard user={user} stats={stats} />
}


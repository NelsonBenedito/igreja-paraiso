import BottomNav from "@/components/BottomNav";
import ThemeHandler from "@/components/ThemeHandler";
import MembrosTopBar from "@/components/MembrosTopBar";
import { createClient } from "@/utils/supabase/server";

export default async function MembrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', user.id)

    isAdmin = userRoles?.some((r: any) => r.roles?.name === 'admin') ?? false
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-paraiso-blue-deep">
      <ThemeHandler color="#ffffff" />
      <MembrosTopBar isAdmin={isAdmin} />

      <div className="flex-1 pb-20 md:pb-0">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}

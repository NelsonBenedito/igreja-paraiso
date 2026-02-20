import BottomNav from "@/components/BottomNav";
import ThemeHandler from "@/components/ThemeHandler";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <ThemeHandler color="#020617" />

            <div className="flex-1 pb-20 md:pb-0">
                {children}
            </div>
            <BottomNav />
        </div>
    )
}


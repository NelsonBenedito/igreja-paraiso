import BottomNav from "@/components/BottomNav";
import ThemeHandler from "@/components/ThemeHandler";

export default function MembrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <ThemeHandler color="#ffffff" />

      <div className="flex-1 pb-20 md:pb-0">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}

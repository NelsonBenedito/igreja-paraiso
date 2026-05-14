import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";
import ThemeHandler from "@/components/ThemeHandler";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 transition-colors">
      <ThemeHandler color="#f1f5f9" />

      <Header user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

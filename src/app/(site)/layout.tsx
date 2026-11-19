import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";
import ThemeHandler from "@/components/ThemeHandler";
import { getSiteContent } from "@/lib/site-content/data";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const site = await getSiteContent();

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-display transition-colors">
      <ThemeHandler color="#FAFAF7" darkColor="#111311" />

      <Header user={user} />
      <main className="flex-1">{children}</main>
      <Footer contact={site.contact} />
    </div>
  );
}

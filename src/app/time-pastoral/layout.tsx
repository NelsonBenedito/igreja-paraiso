import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeHandler from "@/components/ThemeHandler";
import { createClient } from "@/utils/supabase/server";
import { getSiteContent } from "@/lib/site-content/data";

// Mesma casca do layout (site): cabeçalho, papel/tinta e rodapé.
export default async function TimePastoralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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

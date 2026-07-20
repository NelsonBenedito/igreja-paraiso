import React from "react";
import Footer from "@/components/Footer";
import ThemeHandler from "@/components/ThemeHandler";
import { getSiteContent } from "@/lib/site-content/data";

export default async function TimePastoralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getSiteContent();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 transition-colors">
      <ThemeHandler color="#f1f5f9" />
      <main className="flex-1">{children}</main>
      <Footer contact={site.contact} />
    </div>
  );
}

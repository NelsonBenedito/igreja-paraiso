import React from "react";
import Footer from "@/components/Footer";
import ThemeHandler from "@/components/ThemeHandler";

export default function NossasIgrejasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 transition-colors">
      <ThemeHandler color="#f1f5f9" />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

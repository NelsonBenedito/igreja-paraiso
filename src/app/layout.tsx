import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AssistantAI from "@/components/AssistantAI";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Igreja Paraíso | Casa de Deus, Minha família",
  description: "Bem-vindo à Igreja Paraíso. Um lugar de restauração, amor e crescimento espiritual.",
};

// Fixed: Added React import to provide the React namespace for ReactNode
import { createClient } from "@/utils/supabase/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-white text-slate-900`} suppressHydrationWarning>
        <Header user={user} />
        <main>{children}</main>
        <AssistantAI />
        <Footer />
      </body>
    </html>
  );
}

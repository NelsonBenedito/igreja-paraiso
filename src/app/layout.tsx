import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import BackToTop from "@/components/BackToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Igreja Paraíso | Casa de Deus, Minha família",
  description: "Bem-vindo à Igreja Paraíso. Um lugar de restauração, amor e crescimento espiritual.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      {/* Blocking script: apply theme BEFORE React hydrates (prevents mobile FOUC) */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('paraiso-theme') || localStorage.getItem('theme') || 'dark';
                  document.documentElement.classList.add(theme);
                } catch(e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased text-slate-900`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          storageKey="paraiso-theme"
          disableTransitionOnChange={false}
        >
          {children}
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}

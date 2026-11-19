"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const noopSubscribe = () => () => {};

/** Botão claro/escuro da barra das cotas (mesmo tema salvo do site). */
export function CotasThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      className="cb-theme-toggle"
      aria-label="Alternar tema"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted &&
        (isDark ? (
          <Moon size={18} strokeWidth={1.6} aria-hidden />
        ) : (
          <Sun size={18} strokeWidth={1.6} aria-hidden />
        ))}
    </button>
  );
}

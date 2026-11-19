import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Peças do visual editorial do site público: fundo papel, texto tinta, linhas
 * finas e cor da marca só em detalhe (número da seção, ponto final, círculo
 * da seta). A numeração "01, 02…" vem do contador CSS `.secao-indice`
 * (globals.css), porque a ordem dos blocos da home é definida no painel.
 */

// tailwind-merge: classes passadas por quem usa (ex.: `hidden sm:inline-flex`)
// vencem as da base em vez de depender da ordem do CSS gerado.
const cx = cn;

/** Rótulo pequeno em caixa-alta: "01 — Nossa missão". */
export function SectionLabel({
  children,
  numbered = true,
  className,
}: {
  children: React.ReactNode;
  numbered?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cx(
        "text-xs font-medium uppercase tracking-[0.16em] text-ink-muted",
        className,
      )}
    >
      {numbered ? (
        <>
          <span className="secao-indice" /> —{" "}
        </>
      ) : (
        <>
          <span className="text-detail" aria-hidden="true">
            ●
          </span>{" "}
        </>
      )}
      {children}
    </p>
  );
}

/** Ponto final verde dos títulos. */
export function Period() {
  return (
    <span className="text-detail" aria-hidden="true">
      .
    </span>
  );
}

/** Trecho de destaque do título: itálico fino. */
export function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="font-light italic">{children}</span>;
}

const TITLE_SIZES = {
  xl: "text-[2.75rem] md:text-[5.5rem] leading-[0.98] tracking-[-0.045em]",
  lg: "text-[2.375rem] md:text-[4rem] leading-none tracking-[-0.04em]",
} as const;

export function SectionTitle({
  children,
  size = "lg",
  as: Tag = "h2",
  className,
}: {
  children: React.ReactNode;
  size?: keyof typeof TITLE_SIZES;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag className={cx("m-0 font-semibold text-ink", TITLE_SIZES[size], className)}>
      {children}
    </Tag>
  );
}

/**
 * Casca de seção: largura total, linha fina no topo, conteúdo em contêiner.
 * `layout="split"` põe o rótulo numa coluna estreita à esquerda (desktop).
 */
export function EditorialSection({
  id,
  label,
  numbered = true,
  tone = "paper",
  layout = "split",
  className,
  innerClassName,
  children,
}: {
  id?: string;
  label?: React.ReactNode;
  numbered?: boolean;
  tone?: "paper" | "soft";
  layout?: "split" | "stack";
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cx(
        "border-t border-hairline text-ink",
        tone === "soft" ? "bg-paper-soft" : "bg-paper",
        className,
      )}
    >
      <div
        className={cx(
          "mx-auto max-w-[82rem] px-5 py-20 md:px-16 md:py-28",
          layout === "split" && "flex flex-col gap-8 lg:flex-row lg:gap-12",
          innerClassName,
        )}
      >
        {label != null &&
          (layout === "split" ? (
            <div className="lg:w-56 lg:shrink-0">
              <SectionLabel numbered={numbered}>{label}</SectionLabel>
            </div>
          ) : (
            <SectionLabel numbered={numbered} className="mb-6">
              {label}
            </SectionLabel>
          ))}
        {layout === "split" ? <div className="min-w-0 flex-1">{children}</div> : children}
      </div>
    </section>
  );
}

function ArrowIcon({ direction }: { direction: "right" | "down" | "up-right" }) {
  const d =
    direction === "down"
      ? "M12 5v14M6 13l6 6 6-6"
      : direction === "up-right"
        ? "M7 17L17 7M9 7h8v8"
        : "M5 12h14M13 6l6 6-6 6";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const PILL_VARIANTS = {
  ink: "bg-ink text-paper hover:opacity-90",
  soft: "bg-paper-soft text-ink border border-hairline hover:border-ink/30",
  glass: "bg-white/12 text-white hover:bg-white/20",
} as const;

/**
 * Botão em pílula com círculo verde e seta (padrão de CTA do site).
 * Links externos (`http…`) abrem em nova aba.
 */
export function PillLink({
  href,
  children,
  variant = "ink",
  arrow = "right",
  className,
  external,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof PILL_VARIANTS;
  arrow?: "right" | "down" | "up-right";
  className?: string;
  external?: boolean;
  onClick?: () => void;
}) {
  const isExternal = external ?? /^https?:\/\//.test(href);
  const classes = cx(
    "inline-flex min-h-12 items-center gap-3.5 rounded-full py-1.5 pl-1.5 pr-6 text-sm font-medium transition-[opacity,border-color,background-color] duration-300",
    PILL_VARIANTS[variant],
    className,
  );
  const inner = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paraiso-green text-white">
        <ArrowIcon direction={arrow} />
      </span>
      {children}
    </>
  );
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} onClick={onClick}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} onClick={onClick}>
      {inner}
    </Link>
  );
}

/** Link de texto sublinhado com seta ↗. */
export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const isExternal = /^https?:\/\//.test(href);
  const classes = cx(
    "inline-flex items-center gap-1.5 border-b border-current pb-1 text-sm font-medium text-ink transition-colors hover:text-detail",
    className,
  );
  return isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {children} <span aria-hidden="true">↗</span>
    </a>
  ) : (
    <Link href={href} className={classes}>
      {children} <span aria-hidden="true">↗</span>
    </Link>
  );
}

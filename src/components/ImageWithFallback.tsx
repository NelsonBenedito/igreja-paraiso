"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

interface ImageWithFallbackProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  /** `next/image` com `fill` (usa `sizes`); sem isso, `<img>` comum. */
  fill?: boolean;
  sizes?: string;
  draggable?: boolean;
}

/**
 * Imagem do painel com substituto quando a URL vem vazia ou falha ao carregar.
 * O substituto ocupa a área do contêiner pai (`absolute inset-0`), então o layout não muda.
 */
export default function ImageWithFallback({
  src,
  alt,
  className,
  fill,
  sizes,
  draggable,
}: ImageWithFallbackProps) {
  const url = src?.trim() ?? "";
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  // O erro pode ocorrer antes da hidratação, sem disparar o onError do React.
  const ref = (el: HTMLImageElement | null) => {
    if (el && el.complete && el.naturalWidth === 0) setFailedUrl(url);
  };

  if (!url || failedUrl === url) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-400 dark:bg-white/5 dark:text-white/30"
      >
        <ImageOff className="h-8 w-8" aria-hidden />
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        ref={ref}
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        onError={() => setFailedUrl(url)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={url}
      alt={alt}
      className={className}
      draggable={draggable}
      onError={() => setFailedUrl(url)}
    />
  );
}

import React from "react";
import type { SiteContact } from "@/lib/site-content/types";

/** Arroba do Instagram a partir da URL do perfil ("" se não der para extrair). */
function instagramHandle(url: string): string {
  const match = url.trim().match(/instagram\.com\/([^/?#]+)/i);
  return match ? `@${match[1]}` : "";
}

/**
 * Faixa fina de informações logo abaixo do Hero. Só mostra o que veio do
 * painel (`contact.*`); campo vazio não aparece.
 */
export default function InfoStrip({ contact }: { contact: SiteContact }) {
  const address = contact.address.trim();
  const handle = instagramHandle(contact.instagramUrl);

  return (
    <div className="border-b border-hairline bg-paper">
      <div className="mx-auto flex max-w-[82rem] flex-wrap justify-between gap-x-10 gap-y-3 px-5 py-4 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted md:px-16 md:text-xs">
        <span>
          <span className="text-detail" aria-hidden="true">
            ●
          </span>{" "}
          Casa de Deus. Minha família.
        </span>
        {address && <span className="hidden md:inline">{address}</span>}
        {handle && (
          <a
            href={contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-detail"
          >
            {handle}
          </a>
        )}
      </div>
    </div>
  );
}

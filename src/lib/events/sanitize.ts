import DOMPurify from "isomorphic-dompurify";

// Links do HTML do painel não dão acesso a `window.opener` nem passam o referrer.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A") node.setAttribute("rel", "noopener noreferrer");
});

/**
 * Só no servidor (ex.: `evento/[id]/page.tsx`): importar num componente cliente
 * levaria o DOMPurify para o bundle do navegador.
 *
 * `details_html` do painel pela allowlist padrão do DOMPurify (sem scripts,
 * handlers nem iframes). `target` é mantido para links que abrem em nova aba —
 * seguro porque todo link recebe `rel="noopener noreferrer"`.
 */
export function sanitizeEventHtml(html: string): string {
  return DOMPurify.sanitize(html, { ADD_ATTR: ["target"] });
}

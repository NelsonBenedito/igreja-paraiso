export type RemotePattern = {
  protocol: "https";
  hostname: string;
  pathname: string;
};

/** Hosts de imagem externos sempre liberados (independem de variável). */
const DEFAULT_HOSTNAMES = ["images.unsplash.com", "upload.wikimedia.org"];

/** Hostname puro (aceita subdomínios e `*.` no início); sem esquema, porta ou caminho. */
const HOSTNAME_RE = /^(\*\.)?([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i;

/**
 * Extrai hostnames válidos de `SITE_MEDIA_HOSTNAMES` (lista separada por vírgula).
 * Aceita `host` ou `https://host`; ignora `http://`, caminhos, portas e valores inválidos.
 */
export function parseMediaHostnames(raw: string | undefined): string[] {
  if (!raw) return [];
  const hosts: string[] = [];
  for (const part of raw.split(",")) {
    let value = part.trim().toLowerCase();
    if (!value) continue;
    if (value.startsWith("http://")) continue;
    if (value.startsWith("https://")) value = value.slice("https://".length);
    value = value.replace(/\/+$/, "");
    if (!HOSTNAME_RE.test(value)) continue;
    hosts.push(value);
  }
  return hosts;
}

/** Monta `images.remotePatterns` do Next: hosts atuais + hosts de mídia do painel (R2). */
export function buildRemotePatterns(raw: string | undefined): RemotePattern[] {
  const hostnames = [...new Set([...DEFAULT_HOSTNAMES, ...parseMediaHostnames(raw)])];
  return hostnames.map((hostname) => ({ protocol: "https", hostname, pathname: "/**" }));
}

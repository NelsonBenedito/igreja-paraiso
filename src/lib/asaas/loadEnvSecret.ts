import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Lê segredos do .env sem expansão de `$` (Next/dotenv-expand apaga chaves Asaas).
 * Em produção (Vercel etc.) use variáveis definidas no painel — não depende de ficheiro.
 */
export function readEnvSecretFromFiles(key: string): string | null {
  if (typeof process === "undefined") return null;

  for (const filename of [".env.local", ".env"]) {
    const path = resolve(process.cwd(), filename);
    if (!existsSync(path)) continue;

    const text = readFileSync(path, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      if (!trimmed.startsWith(`${key}=`)) continue;

      let val = trimmed.slice(key.length + 1).trim();
      if (
        (val.startsWith("'") && val.endsWith("'")) ||
        (val.startsWith('"') && val.endsWith('"'))
      ) {
        val = val.slice(1, -1);
      }
      return val.trim() || null;
    }
  }
  return null;
}

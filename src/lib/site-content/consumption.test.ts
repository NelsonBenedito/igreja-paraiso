import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SITE_CONTENT_CONSUMPTION } from "./consumption";
import { CONTRACT_SECTIONS } from "./__fixtures__/site-content.contract";
import { normalizeSiteSections } from "./normalize";

const fixture = CONTRACT_SECTIONS as unknown as Record<string, Record<string, unknown>>;
const read = (files: string[]) => files.map((f) => readFileSync(f, "utf8")).join("\n");

describe("mapa de consumo × fixture do contrato", () => {
  for (const c of SITE_CONTENT_CONSUMPTION) {
    it(`${c.section}: campos declarados existem no contrato e são usados`, () => {
      const section = fixture[c.section];
      expect(section, `seção ${c.section} ausente na fixture`).toBeDefined();
      for (const f of [...c.fields, ...(c.unused ?? [])]) expect(section, `${c.section}.${f}`).toHaveProperty(f);
      const item = (section.items as Record<string, unknown>[] | undefined)?.[0];
      for (const f of c.itemFields ?? []) expect(item, `${c.section}.items[].${f}`).toHaveProperty(f);

      const src = read(c.files);
      for (const f of [...c.fields, ...(c.itemFields ?? [])]) {
        expect(src, `${f} declarado mas não usado em ${c.files}`).toMatch(new RegExp(`\\.${f}\\b`));
      }
    });
  }

  it("o site não carrega campo que o contrato não manda", () => {
    const out = normalizeSiteSections(CONTRACT_SECTIONS) as unknown as Record<string, Record<string, unknown>>;
    for (const [name, section] of Object.entries(out)) {
      expect(Object.keys(section).sort(), name).toEqual(Object.keys(fixture[name]).sort());
      const items = section.items as Record<string, unknown>[] | undefined;
      if (items?.[0]) {
        const fx = (fixture[name].items as Record<string, unknown>[])[0];
        expect(Object.keys(items[0]).sort(), `${name}.items[]`).toEqual(Object.keys(fx).sort());
      }
    }
  });

  it("todo campo da fixture em seção exibida está declarado no mapa", () => {
    for (const c of SITE_CONTENT_CONSUMPTION.filter((x) => x.files.length)) {
      const declared = new Set([...c.fields, ...(c.unused ?? []), ...(c.itemFields ?? []), "items", "benefits", "active"]);
      for (const key of Object.keys(fixture[c.section])) {
        expect(declared.has(key), `${c.section}.${key} não declarado`).toBe(true);
      }
    }
  });

  it("docs/consumo-do-painel.md cobre todas as seções", () => {
    const doc = readFileSync("docs/consumo-do-painel.md", "utf8");
    for (const c of SITE_CONTENT_CONSUMPTION) expect(doc).toContain(`\`${c.section}\``);
  });
});

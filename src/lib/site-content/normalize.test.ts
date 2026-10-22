import { describe, expect, it } from "vitest";
import { CONTRACT_SECTIONS } from "./__fixtures__/site-content.contract";
import { SITE_CONTENT_FALLBACK } from "./fallbacks";
import { normalizeSiteSections } from "./normalize";

describe("política de reserva", () => {
  it("listas da reserva ficam vazias; textos permanecem", () => {
    const f = SITE_CONTENT_FALLBACK;
    expect(f.churches.items).toEqual([]);
    expect(f.pastors.items).toEqual([]);
    expect(f.ministries.items).toEqual([]);
    expect(f.mission.badge).not.toBe("");
    expect(f.contact.phone).not.toBe("");
  });
});

describe("normalizeSiteSections", () => {
  it("preserva uma resposta completa do contrato", () => {
    expect(normalizeSiteSections(CONTRACT_SECTIONS)).toEqual(CONTRACT_SECTIONS);
  });

  it.each([null, undefined, 42, "x", [], {}])("entrada inválida (%j) → reserva, sem lançar", (raw) => {
    expect(normalizeSiteSections(raw)).toEqual(SITE_CONTENT_FALLBACK);
  });

  it("campos ausentes viram default; strings vazias da API são preservadas", () => {
    const out = normalizeSiteSections({
      contact: { phone: "" },
      giving: { pixKey: "abc" },
    });
    expect(out.contact.phone).toBe("");
    expect(out.contact.email).toBe(SITE_CONTENT_FALLBACK.contact.email);
    expect(out.giving.pixKey).toBe("abc");
    expect(out.churches.items).toEqual([]);
  });

  it("tipo errado vira default", () => {
    const out = normalizeSiteSections({ contact: { phone: 123 }, churches: { items: "x" } });
    expect(out.contact.phone).toBe(SITE_CONTENT_FALLBACK.contact.phone);
    expect(out.churches.items).toEqual([]);
  });

  it("seção desconhecida e campo extra são ignorados", () => {
    const out = normalizeSiteSections({
      ...CONTRACT_SECTIONS,
      novaSecao: { a: 1 },
      youtube: { ...CONTRACT_SECTIONS.youtube, extra: true },
    });
    expect(out).not.toHaveProperty("novaSecao");
    expect(out.youtube).toEqual(CONTRACT_SECTIONS.youtube);
  });

  it("itens inativos, sem nome ou inválidos não aparecem", () => {
    const out = normalizeSiteSections({
      pastors: {
        items: [
          { name: "Ativo", image: "/a.jpg", active: true },
          { name: "Inativo", image: "/b.jpg", active: false },
          { image: "/c.jpg", active: true },
          null,
          "x",
          { name: "Sem foto" },
        ],
      },
    });
    expect(out.pastors.items).toEqual([
      { name: "Ativo", image: "/a.jpg", active: true },
      { name: "Sem foto", image: "", active: true },
    ]);
  });

  it("igreja: campo ausente vira default e `pastor` do formato antigo é descartado", () => {
    const out = normalizeSiteSections({
      churches: { items: [{ name: "Sede", isHeadquarters: true, pastor: "Pr. X" }] },
    });
    expect(out.churches.items[0]).toEqual({
      name: "Sede", location: "", address: "", image: "", mapsUrl: "",
      isHeadquarters: true, active: true,
    });
  });
});

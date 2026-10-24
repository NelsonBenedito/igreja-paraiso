import { describe, expect, it } from "vitest";
import { HOME_BLOCKS_DEFAULT, resolveHomeOrder } from "./home-order";

const DEFAULT = [...HOME_BLOCKS_DEFAULT];

describe("resolveHomeOrder", () => {
  it("ordem padrão é a de hoje no site", () => {
    expect(DEFAULT).toEqual([
      "mission", "schedules", "celulas", "events", "churches", "giving", "youtube",
    ]);
  });

  it.each([undefined, null, 42, "x", [], {}])("layout ausente ou inválido (%j) → ordem padrão", (layout) => {
    expect(resolveHomeOrder(layout)).toEqual(DEFAULT);
  });

  it.each([undefined, null, "mission", 1, { 0: "mission" }])("`home` não-array (%j) → ordem padrão", (home) => {
    expect(resolveHomeOrder({ home })).toEqual(DEFAULT);
  });

  it("permutação válida é respeitada", () => {
    const home = ["youtube", "giving", "churches", "events", "celulas", "schedules", "mission"];
    expect(resolveHomeOrder({ home })).toEqual(home);
  });

  it("id desconhecido e não-string são ignorados", () => {
    const home = ["hero", "youtube", 7, null, ...DEFAULT.slice(0, 6), "contact", "novoBloco"];
    expect(resolveHomeOrder({ home })).toEqual(["youtube", ...DEFAULT.slice(0, 6)]);
  });

  it("id repetido: vale a primeira ocorrência", () => {
    const home = ["giving", "mission", "giving", ...DEFAULT, "mission"];
    expect(resolveHomeOrder({ home })).toEqual([
      "giving", "mission", "schedules", "celulas", "events", "churches", "youtube",
    ]);
  });

  it("id faltando entra na posição padrão (logo após o anterior presente)", () => {
    const home = ["youtube", "mission", "celulas", "events", "churches", "giving"];
    expect(resolveHomeOrder({ home })).toEqual([
      "youtube", "mission", "schedules", "celulas", "events", "churches", "giving",
    ]);
  });

  it("faltando sem anterior presente entra no início; faltantes seguidos mantêm a ordem padrão", () => {
    expect(resolveHomeOrder({ home: ["youtube", "events"] })).toEqual([
      "mission", "schedules", "celulas", "youtube", "events", "churches", "giving",
    ]);
  });

  it("lista só com desconhecidos → ordem padrão", () => {
    expect(resolveHomeOrder({ home: ["a", "b"] })).toEqual(DEFAULT);
  });

  it("não altera a entrada", () => {
    const home = ["youtube", "mission"];
    resolveHomeOrder({ home });
    expect(home).toEqual(["youtube", "mission"]);
  });
});

import { describe, expect, it } from "vitest";
import {
  CONTRIBUIR_IDENTITY_STORAGE_KEY,
  buildContribuirBody,
  buildContribuirQuery,
  loadIdentity,
  normalizeIdentity,
  parseStoredIdentity,
  saveIdentity,
} from "./contribuirPayload";

const CPF = "52998224725";
const identity = { name: "Maria Silva", cpf: CPF };

function memoryStorage() {
  const map = new Map<string, string>();
  return {
    map,
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
  };
}

describe("normalizeIdentity", () => {
  it("limpa espaços e máscara", () => {
    expect(normalizeIdentity("  Maria   Silva ", "529.982.247-25")).toEqual(identity);
  });
  it("rejeita nome curto ou CPF inválido", () => {
    expect(normalizeIdentity("Al", CPF)).toBeNull();
    expect(normalizeIdentity("Maria", "52998224724")).toBeNull();
  });
});

describe("parseStoredIdentity", () => {
  it("lê o JSON gravado", () => {
    expect(parseStoredIdentity(JSON.stringify(identity))).toEqual(identity);
  });
  it("devolve null para vazio, JSON inválido, formato errado ou dados inválidos", () => {
    expect(parseStoredIdentity(null)).toBeNull();
    expect(parseStoredIdentity("")).toBeNull();
    expect(parseStoredIdentity("{oops")).toBeNull();
    expect(parseStoredIdentity("[]")).toBeNull();
    expect(parseStoredIdentity(JSON.stringify({ name: 1, cpf: CPF }))).toBeNull();
    expect(parseStoredIdentity(JSON.stringify({ name: "Maria", cpf: "123" }))).toBeNull();
  });
});

describe("saveIdentity / loadIdentity", () => {
  it("grava e lê na chave única", () => {
    const s = memoryStorage();
    expect(saveIdentity(s, identity)).toBe(true);
    expect([...s.map.keys()]).toEqual([CONTRIBUIR_IDENTITY_STORAGE_KEY]);
    expect(loadIdentity(s)).toEqual(identity);
  });
  it("não lança quando o armazenamento está bloqueado", () => {
    const blocked = {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    };
    expect(saveIdentity(blocked, identity)).toBe(false);
    expect(loadIdentity(blocked)).toBeNull();
    expect(saveIdentity(null, identity)).toBe(false);
    expect(loadIdentity(undefined)).toBeNull();
  });
});

describe("buildContribuirQuery", () => {
  it("leva só valor, mensal e meses (sem nome/CPF)", () => {
    const q = buildContribuirQuery(100, 12);
    expect(q).toBe("valor=100&mensal=true&meses=12");
    expect(q).not.toMatch(/cpf|name/);
  });
});

describe("buildContribuirBody", () => {
  const params = (q: string) => new URLSearchParams(q);

  it("sem identidade → erro de validação", () => {
    expect(buildContribuirBody(params("valor=100&mensal=true"), null)).toEqual({
      ok: false,
      reason: "identity",
    });
  });

  it("sempre usa cpf_custom com nome/CPF da identidade", () => {
    const r = buildContribuirBody(params("valor=100&mensal=true&meses=12"), identity);
    expect(r).toEqual({
      ok: true,
      body: {
        isMonthly: true,
        reuseMode: "cpf_custom",
        name: "Maria Silva",
        cpf: CPF,
        value: 100,
        subscriptionDurationMonths: 12,
      },
    });
  });

  it("ignora name/cpf da URL", () => {
    const r = buildContribuirBody(
      params(`valor=50&mensal=true&name=Outro&cpf=11144477735`),
      identity,
    );
    expect(r.ok && r.body.name).toBe("Maria Silva");
    expect(r.ok && r.body.cpf).toBe(CPF);
  });

  it("limita meses a 12 e usa 12 por padrão", () => {
    const a = buildContribuirBody(params("valor=50&mensal=true&meses=60"), identity);
    const b = buildContribuirBody(params("valor=50&mensal=true"), identity);
    const c = buildContribuirBody(params("valor=50&mensal=true&meses=3"), identity);
    expect(a.ok && a.body.subscriptionDurationMonths).toBe(12);
    expect(b.ok && b.body.subscriptionDurationMonths).toBe(12);
    expect(c.ok && c.body.subscriptionDurationMonths).toBe(3);
  });

  it("arredonda valor a centavos e omite valor inválido; não mensal sem meses", () => {
    const a = buildContribuirBody(params("valor=10.555"), identity);
    expect(a.ok && a.body.value).toBe(10.56);
    expect(a.ok && a.body.isMonthly).toBe(false);
    expect(a.ok && "subscriptionDurationMonths" in a.body).toBe(false);
    const b = buildContribuirBody(params("valor=abc&mensal=true"), identity);
    expect(b.ok && "value" in b.body).toBe(false);
  });

  it("inclui confirmAdditional só quando pedido", () => {
    const a = buildContribuirBody(params("valor=50&mensal=true"), identity);
    const b = buildContribuirBody(params("valor=50&mensal=true"), identity, {
      confirmAdditional: true,
    });
    expect(a.ok && "confirmAdditional" in a.body).toBe(false);
    expect(b.ok && b.body.confirmAdditional).toBe(true);
  });
});

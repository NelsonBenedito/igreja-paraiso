import { describe, expect, it } from "vitest";
import { isValidCpf, isValidDonorName, maskCpf, onlyDigits } from "./cpf";

describe("onlyDigits", () => {
  it("remove tudo que não é dígito", () => {
    expect(onlyDigits("529.982.247-25")).toBe("52998224725");
    expect(onlyDigits("abc")).toBe("");
  });
});

describe("maskCpf", () => {
  it("aplica a máscara de forma progressiva", () => {
    expect(maskCpf("")).toBe("");
    expect(maskCpf("529")).toBe("529");
    expect(maskCpf("5299")).toBe("529.9");
    expect(maskCpf("5299822")).toBe("529.982.2");
    expect(maskCpf("52998224725")).toBe("529.982.247-25");
  });

  it("ignora dígitos além de 11 e caracteres não numéricos", () => {
    expect(maskCpf("529.982.247-2599")).toBe("529.982.247-25");
  });
});

describe("isValidCpf", () => {
  it("aceita CPF válido com ou sem máscara", () => {
    expect(isValidCpf("52998224725")).toBe(true);
    expect(isValidCpf("529.982.247-25")).toBe(true);
  });

  it("rejeita dígito verificador errado, tamanho errado e sequência repetida", () => {
    expect(isValidCpf("52998224724")).toBe(false);
    expect(isValidCpf("5299822472")).toBe(false);
    expect(isValidCpf("11111111111")).toBe(false);
    expect(isValidCpf("")).toBe(false);
  });
});

describe("isValidDonorName", () => {
  it("exige pelo menos 3 caracteres além dos espaços", () => {
    expect(isValidDonorName("  Al ")).toBe(false);
    expect(isValidDonorName("Ana")).toBe(true);
  });
});

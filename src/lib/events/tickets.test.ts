import { describe, expect, it } from "vitest";
import { selectableTicketId } from "./tickets";

const ingresso = (id: string, isSoldOut = false) => ({ id, isSoldOut });

describe("selectableTicketId", () => {
  it("seleciona o primeiro ingresso não esgotado", () => {
    expect(selectableTicketId([ingresso("a", true), ingresso("b"), ingresso("c")], null)).toBe("b");
  });

  it("mantém a seleção atual se ela continua disponível", () => {
    expect(selectableTicketId([ingresso("a"), ingresso("b")], "b")).toBe("b");
  });

  it("troca a seleção atual se ela esgotou", () => {
    expect(selectableTicketId([ingresso("a"), ingresso("b", true)], "b")).toBe("a");
  });

  it("sem ingressos disponíveis, nada fica selecionado", () => {
    expect(selectableTicketId([ingresso("a", true), ingresso("b", true)], "a")).toBeNull();
    expect(selectableTicketId([], null)).toBeNull();
  });
});

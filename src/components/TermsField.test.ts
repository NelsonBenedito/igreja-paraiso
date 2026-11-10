import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TermsField } from "./TermsField";
import type { PublicTicketFieldDto } from "@/lib/events/types";

const mockTermsField: PublicTicketFieldDto = {
  fieldId: "field-terms-1",
  key: "termo_imagem",
  label: "Termo de Imagem e Voz",
  type: "TERMS",
  options: null,
  termText: "Autorizo expressamente o uso da minha imagem e voz para fins institucionais da igreja.",
  required: true,
};

describe("TermsField", () => {
  it("renderiza o label, a etiqueta 'Termo' e o asterisco obrigatório quando required: true", () => {
    const html = renderToStaticMarkup(
      createElement(TermsField, {
        field: mockTermsField,
        value: false,
        onChange: () => {},
      })
    );

    expect(html).toContain("Termo de Imagem e Voz");
    expect(html).toContain("Termo");
    expect(html).toContain("text-red-500");
    expect(html).toContain("*");
    expect(html).toContain("required");
  });

  it("não exibe asterisco obrigatório nem atributo required quando required: false", () => {
    const html = renderToStaticMarkup(
      createElement(TermsField, {
        field: { ...mockTermsField, required: false },
        value: false,
        onChange: () => {},
      })
    );

    expect(html).toContain("Termo de Imagem e Voz");
    expect(html).not.toContain("text-red-500");
    expect(html).not.toContain('required=""');
  });

  it("renderiza o texto do termo dentro da caixa com scroll", () => {
    const html = renderToStaticMarkup(
      createElement(TermsField, {
        field: mockTermsField,
        value: false,
        onChange: () => {},
      })
    );

    expect(html).toContain("Autorizo expressamente o uso da minha imagem e voz");
    expect(html).toContain("max-h-36");
    expect(html).toContain("overflow-y-auto");
  });

  it("exibe texto padrão quando termText for nulo ou vazio", () => {
    const html = renderToStaticMarkup(
      createElement(TermsField, {
        field: { ...mockTermsField, termText: null },
        value: false,
        onChange: () => {},
      })
    );

    expect(html).toContain("Nenhum texto informado para este termo.");
  });

  it("renderiza o checkbox de consentimento e respeita o estado checked", () => {
    const htmlUnchecked = renderToStaticMarkup(
      createElement(TermsField, {
        field: mockTermsField,
        value: false,
        onChange: () => {},
      })
    );
    expect(htmlUnchecked).toContain("Li e concordo com os termos acima");
    expect(htmlUnchecked).not.toContain('checked=""');

    const htmlChecked = renderToStaticMarkup(
      createElement(TermsField, {
        field: mockTermsField,
        value: true,
        onChange: () => {},
      })
    );
    expect(htmlChecked).toContain('checked=""');
  });

  it("renderiza a mensagem de erro quando informada", () => {
    const html = renderToStaticMarkup(
      createElement(TermsField, {
        field: mockTermsField,
        value: false,
        onChange: () => {},
        error: "É necessário aceitar os termos: Termo de Imagem e Voz",
      })
    );

    expect(html).toContain("É necessário aceitar os termos: Termo de Imagem e Voz");
    expect(html).toContain("text-red-600");
  });
});

import { describe, expect, it } from "vitest";
import { sanitizeEventHtml } from "./sanitize";

describe("sanitizeEventHtml", () => {
  it("mantém a formatação do painel", () => {
    const html = "<h2>Programação</h2><p>Olá <strong>mundo</strong> e <em>todos</em></p><ul><li>Item</li></ul>";
    expect(sanitizeEventHtml(html)).toBe(html);
  });

  it("remove scripts, handlers e iframes", () => {
    const out = sanitizeEventHtml(
      '<p>Texto</p><script>alert(1)</script><img src="https://media.example/a.jpg" onerror="alert(2)"><iframe src="https://evil.example"></iframe>',
    );
    expect(out).toContain("<p>Texto</p>");
    expect(out).toContain('src="https://media.example/a.jpg"');
    expect(out).not.toMatch(/script|onerror|iframe|alert/);
  });

  it("remove formulário, controles e mídia embutida, mantendo o texto", () => {
    const out = sanitizeEventHtml(
      '<p><strong>texto</strong></p><form action="https://evil.example"><input><button>Pagar</button></form><video autoplay src="x"></video>',
    );
    // O DOMPurify descarta as tags e mantém só o texto interno ("Pagar" vira texto solto).
    expect(out).toBe("<p><strong>texto</strong></p>Pagar");
    expect(out).not.toMatch(/form|input|button|video|evil\.example/);
  });

  it("remove links javascript:", () => {
    expect(sanitizeEventHtml('<a href="javascript:alert(1)">x</a>')).not.toContain("javascript:");
  });

  it("links recebem rel=\"noopener noreferrer\"", () => {
    const out = sanitizeEventHtml(
      '<a href="https://exemplo.com" target="_blank" rel="opener">site</a> e <a href="/eventos">eventos</a>',
    );
    expect(out).toBe(
      '<a href="https://exemplo.com" target="_blank" rel="noopener noreferrer">site</a> e <a href="/eventos" rel="noopener noreferrer">eventos</a>',
    );
  });
});

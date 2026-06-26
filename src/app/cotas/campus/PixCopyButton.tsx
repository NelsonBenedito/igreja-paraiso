"use client";

import { useState } from "react";

const PIX_KEY = "projeto@visaodofuturo.com.br";

export function PixCopyButton() {
  const [label, setLabel] = useState("📋 Copiar chave Pix");

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      setLabel("✅ Chave copiada!");
      setTimeout(() => setLabel("📋 Copiar chave Pix"), 2000);
    } catch {
      setLabel("Não foi possível copiar");
      setTimeout(() => setLabel("📋 Copiar chave Pix"), 2000);
    }
  }

  return (
    <button type="button" className="pix-key" onClick={handleClick}>
      {label}
    </button>
  );
}

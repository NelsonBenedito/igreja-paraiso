'use server';

import { GoogleGenAI } from "@google/genai";

export const askChurchAssistant = async (question: string) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("GEMINI_API_KEY is not set");
            return "Desculpe, o serviço de assistência não está configurado corretamente no momento.";
        }

        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: question,
            config: {
                systemInstruction: `Você é o assistente espiritual da 'Igreja Paraíso'. 
        Suas cores são o Verde (#7C9A40) e Azul (#2B4364). 
        Seu tom é pastoral, acolhedor e focado na restauração de vidas.
        Responda dúvidas sobre a igreja, sugira versículos bíblicos de esperança e encoraje a participação nos GVs (Grupos de Vida).
        Cultos: Domingos 09h e 18:30h.
        Mantenha as respostas concisas e sempre em Português do Brasil.`,
            },
        });

        // Fixed: Accessing text as a property on GenerateContentResponse
        return response.text || "Paz! Não consegui processar agora, mas Deus te abençoe.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Desculpe, ocorreu um erro na conexão. Tente novamente mais tarde.";
    }
};

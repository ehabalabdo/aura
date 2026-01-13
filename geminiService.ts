
import { ClosetItem, AIDesignResult, Language, StylingResult } from "./types";

const callGemini = async <T>(action: string, payload: Record<string, unknown>): Promise<T> => {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload })
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.error || "Gemini request failed.";
    throw new Error(message);
  }

  return response.json() as Promise<T>;
};

/**
 * NEW: Analyze uploaded image to detect real fashion attributes.
 * This ensures the stylist "sees" what you actually uploaded.
 */
export const analyzeClothingImage = async (base64Image: string): Promise<{ color: string, style: string }> => {
  return callGemini("analyzeClothingImage", { image: base64Image });
};

/**
 * Aura: Style Architect.
 * Uses real detected metadata for color theory coordination.
 */
export const getStylingRecommendation = async (items: ClosetItem[], prompt: string, lang: Language): Promise<StylingResult> => {
  const result = await callGemini<StylingResult>("getStylingRecommendation", { items, prompt, lang });
  const validIds = items.map(i => i.id);
  result.picks = result.picks.filter(p => validIds.includes(p.itemId));
  return result;
};

export const generateFashionDesign = async (description: string, budget: number, lang: Language): Promise<AIDesignResult> => {
  return callGemini<AIDesignResult>("generateFashionDesign", { description, budget, lang });
};

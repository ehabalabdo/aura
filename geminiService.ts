
import { GoogleGenAI, Type } from "@google/genai";
import { ClosetItem, AIDesignResult, Language, StylingResult } from "./types";

const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not configured. Please check your .env file.');
  }
  return apiKey;
};

/**
 * NEW: Analyze uploaded image to detect real fashion attributes.
 * This ensures the stylist "sees" what you actually uploaded.
 */
export const analyzeClothingImage = async (base64Image: string): Promise<{ color: string, style: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const prompt = "Analyze this clothing item. Return ONLY a JSON with 'color' (be specific, e.g. 'Emerald Green', 'Pastel Pink') and 'style' (e.g. 'Oversized Streetwear', 'Formal Silk', 'Boho Knit').";
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] } }
        ]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            color: { type: Type.STRING },
            style: { type: Type.STRING }
          },
          required: ["color", "style"]
        }
      }
    });

    try {
      return JSON.parse(response.text || '{"color": "Unknown", "style": "Modern"}');
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return { color: "Classic", style: "Modern" };
    }
  } catch (error) {
    console.error('Error analyzing clothing image:', error);
    throw new Error('Failed to analyze clothing image. Please try again.');
  }
};

/**
 * Aura: Style Architect.
 * Uses real detected metadata for color theory coordination.
 */
export const getStylingRecommendation = async (items: ClosetItem[], prompt: string, lang: Language): Promise<StylingResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  // Create a detailed manifest of the user's specific items with their DETECTED attributes
  const wardrobeManifest = items.map(item => ({
    id: item.id,
    category: item.category,
    detectedColor: item.color,
    detectedStyle: item.style
  }));
  
  const fullPrompt = `You are "Aura", a world-class fashion stylist. 
The user wants a look for: "${prompt}".

WARDROBE DATA (Actual items uploaded by user):
${JSON.stringify(wardrobeManifest)}

MATCHING CRITERIA:
1. COLOR COORDINATION: Match items based on their 'detectedColor'. Use high-end color matching rules (Complementary, Monochromatic, etc.).
2. STYLE COHESION: Ensure the 'detectedStyle' of the Top matches the 'detectedStyle' of the Bottom.
3. SEARCH ALL: Do not pick sequentially. Evaluate every single item in the inventory to find the BEST color match for the vibe.
4. EXPLANATION: In ${lang === 'ar' ? 'Arabic' : 'English'}, justify why these SPECIFIC colors were chosen together.

OUTPUT FORMAT (JSON):
{
  "picks": [
    {
      "itemId": "exact-id",
      "role": "Top | Bottom | Outerwear | Shoes | Accessory",
      "explanation": "Stylist note about color/style match"
    }
  ],
  "overallDescription": "Summary of the aesthetic"
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ parts: [{ text: fullPrompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          picks: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                itemId: { type: Type.STRING },
                role: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["itemId", "role", "explanation"]
            }
          },
          overallDescription: { type: Type.STRING }
        },
        required: ["picks", "overallDescription"]
      }
    }
  });

    try {
      const result = JSON.parse(response.text || "{}") as StylingResult;
      const validIds = items.map(i => i.id);
      result.picks = result.picks.filter(p => validIds.includes(p.itemId));
      return result;
    } catch (parseError) {
      console.error('Failed to parse styling recommendation:', parseError);
      throw new Error('Failed to generate styling recommendation.');
    }
  } catch (error) {
    console.error('Error generating styling recommendation:', error);
    return { picks: [], overallDescription: "Unable to generate recommendations. Please try again." };
  }
};

export const generateFashionDesign = async (description: string, budget: number, lang: Language): Promise<AIDesignResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const textResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ parts: [{ text: `Design a garment based on: "${description}" with a budget of ${budget} USD. Return JSON.` }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          materials: { type: Type.ARRAY, items: { type: Type.STRING } },
          estimatedCost: { type: Type.NUMBER },
          description: { type: Type.STRING }
        }
      }
    }
    });
    const details = JSON.parse(textResponse.text || "{}");
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `High-fashion sketch: ${description}` }] }
    });
    let imageUrl = "";
    if (imageResponse.candidates?.[0].content.parts) {
      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return { ...details, imageUrl };
  } catch (error) {
    console.error('Error generating fashion design:', error);
    throw new Error('Failed to generate design. Please try again.');
  }
};

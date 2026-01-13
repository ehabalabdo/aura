import { GoogleGenAI, Type } from "@google/genai";

// Simple server-side proxy to keep the Gemini key off the client.
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    return;
  }

  const ai = new GoogleGenAI({ apiKey });
  const { action, ...payload } = req.body || {};

  try {
    if (action === "analyzeClothingImage") {
      const base64 = (payload.image as string | undefined) || "";
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{
          parts: [
            {
              text: "Analyze this clothing item. Return ONLY a JSON with 'color' and 'style' that are specific (e.g. 'Emerald Green', 'Oversized Streetwear')."
            },
            { inlineData: { mimeType: "image/jpeg", data: base64.split(",")[1] || base64 } }
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

      const json = JSON.parse(response.text || "{\"color\":\"Unknown\",\"style\":\"Modern\"}");
      res.status(200).json(json);
      return;
    }

    if (action === "getStylingRecommendation") {
      const { items, prompt, lang } = payload as any;
      const wardrobeManifest = (items as any[]).map((item) => ({
        id: item.id,
        category: item.category,
        detectedColor: item.color,
        detectedStyle: item.style
      }));

      const fullPrompt = `You are "FitFusion", a world-class fashion stylist. \nThe user wants a look for: "${prompt}".\n\nWARDROBE DATA (Actual items uploaded by user):\n${JSON.stringify(wardrobeManifest)}\n\nMATCHING CRITERIA:\n1. COLOR COORDINATION: Match items based on their 'detectedColor'. Use high-end color matching rules (Complementary, Monochromatic, etc.).\n2. STYLE COHESION: Ensure the 'detectedStyle' of the Top matches the 'detectedStyle' of the Bottom.\n3. SEARCH ALL: Do not pick sequentially. Evaluate every single item in the inventory to find the BEST color match for the vibe.\n4. EXPLANATION: In ${lang === "ar" ? "Arabic" : "English"}, justify why these SPECIFIC colors were chosen together.\n\nOUTPUT FORMAT (JSON):\n{\n  "picks": [\n    {\n      "itemId": "exact-id",\n      "role": "Top | Bottom | Outerwear | Shoes | Accessory",\n      "explanation": "Stylist note about color/style match"\n    }\n  ],\n  "overallDescription": "Summary of the aesthetic"\n}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
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

      const json = JSON.parse(response.text || "{\"picks\":[],\"overallDescription\":\"\"}");
      res.status(200).json(json);
      return;
    }

    if (action === "generateFashionDesign") {
      const { description, budget } = payload as any;
      const textResponse = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
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
        model: "gemini-2.5-flash-image",
        contents: { parts: [{ text: `High-fashion sketch: ${description}` }] }
      });

      let imageUrl = "";
      if (imageResponse.candidates?.[0].content.parts) {
        for (const part of imageResponse.candidates[0].content.parts) {
          if (part.inlineData) imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        }
      }

      res.status(200).json({ ...details, imageUrl });
      return;
    }

    res.status(400).json({ error: "Unknown action" });
  } catch (error: any) {
    console.error("Gemini proxy error", error);
    res.status(500).json({ error: error?.message || "Gemini request failed." });
  }
}

import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFamilyAdvice = async (prompt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are Lumina, a friendly family AI assistant. You help parents coordinate schedules, suggest healthy meals, and provide age-appropriate advice for children. Keep responses concise, supportive, and safe.",
        temperature: 0.7,
      }
    });
    return response.text || "I'm having trouble connecting to the family network right now. Try again shortly!";
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm having trouble connecting to the family network right now. Try again shortly!";
  }
};

export const getSafetyReview = async (activityLog: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analyze this activity log for safety concerns: ${activityLog}`,
      config: {
        systemInstruction: "You are a child safety expert. Review digital activity and flag potential risks (cyberbullying, inappropriate content, etc.) while respecting privacy. Output a concise summary for parents.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, description: "Low, Medium, High" },
            summary: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["riskLevel", "summary", "recommendations"],
          propertyOrdering: ["riskLevel", "summary", "recommendations"]
        }
      }
    });
    const text = response.text?.trim();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Safety Review Error:", error);
    return null;
  }
};
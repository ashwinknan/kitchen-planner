
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, CookingPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCookingPlan = async (selectedRecipes: Recipe[]): Promise<CookingPlan> => {
  const recipesPrompt = selectedRecipes.map(r => ({
    name: r.name,
    steps: r.steps.map(s => `${s.instruction} (${s.durationMinutes}m, Stove: ${s.requiresStove})`).join(', ')
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze these recipes and create a combined, highly efficient cooking plan for ONE person with THREE gas stoves.
    
    Recipes: ${JSON.stringify(recipesPrompt)}
    
    Constraints:
    1. Maximum 3 stoves can be used at any given time.
    2. Only 1 person is cooking. They can only do one manual task (chopping, stirring, cleaning) at a time, but items can cook on the stove unattended if it's a simmer/boil step.
    3. Parallelize as much as possible (e.g., chop vegetables for Dish B while Dish A is simmering on a stove).
    4. Provide a sequential timeline of actions.
    
    Return the plan in the specified JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          totalTime: { type: Type.NUMBER, description: "Total minutes from start to finish" },
          prepSummary: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "A few high-level prep steps to do before starting anything else"
          },
          timeline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timeStart: { type: Type.NUMBER },
                timeEnd: { type: Type.NUMBER },
                action: { type: Type.STRING },
                dishName: { type: Type.STRING },
                isStoveActive: { type: Type.BOOLEAN },
                stoveNumber: { type: Type.NUMBER, description: "1, 2, or 3 if stove is used" }
              },
              required: ["timeStart", "timeEnd", "action", "dishName", "isStoveActive"]
            }
          }
        },
        required: ["totalTime", "timeline", "prepSummary"]
      }
    }
  });

  return JSON.parse(response.text.trim()) as CookingPlan;
};

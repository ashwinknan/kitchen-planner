
export interface Ingredient {
  item: string;
  amount: string;
}

export interface RecipeStep {
  instruction: string;
  durationMinutes: number;
  requiresStove: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  variation?: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  category: string;
}

export interface PlanStep {
  timeStart: number;
  timeEnd: number;
  action: string;
  dishName: string;
  isStoveActive: boolean;
  stoveNumber?: number;
}

export interface CookingPlan {
  totalTime: number;
  timeline: PlanStep[];
  prepSummary: string[];
}

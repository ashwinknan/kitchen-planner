
import React, { useState } from 'react';
import DishSearch from './components/DishSearch';
import SelectedDishes from './components/SelectedDishes';
import CookingPlanDisplay from './components/CookingPlanDisplay';
import { Recipe, CookingPlan } from './types';
import { generateCookingPlan } from './services/geminiService';
import { fetchFullRecipe } from './services/firebaseService';

const App: React.FC = () => {
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [cookingPlan, setCookingPlan] = useState<CookingPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddRecipe = async (recipeInfo: Partial<Recipe>) => {
    if (!recipeInfo.id) return;
    if (selectedRecipes.find(r => r.id === recipeInfo.id)) return;

    setIsLoadingRecipe(true);
    setError(null);

    try {
      const fullRecipe = await fetchFullRecipe(recipeInfo.id);
      setSelectedRecipes(prev => [...prev, fullRecipe]);
    } catch (err) {
      console.error(err);
      setError("Could not load dish details. Please check connection.");
    } finally {
      setIsLoadingRecipe(false);
    }
  };

  const handleRemoveRecipe = (id: string) => {
    setSelectedRecipes(prev => prev.filter(r => r.id !== id));
  };

  const handleGenerate = async () => {
    if (selectedRecipes.length === 0) {
      setError("Please select at least one dish.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const plan = await generateCookingPlan(selectedRecipes);
      setCookingPlan(plan);
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setSelectedRecipes([]);
    setCookingPlan(null);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-xl text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">Kitchen Planner</h1>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Live DB Connected</p>
            </div>
          </div>
          {selectedRecipes.length > 0 && !cookingPlan && (
             <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-black">
              {selectedRecipes.length} Selected
            </span>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-8">
        {!cookingPlan ? (
          <div className="space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              {isLoadingRecipe && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-orange-600 font-bold">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Dish...
                  </div>
                </div>
              )}
              <h2 className="text-lg font-bold text-gray-800 mb-2">What are we cooking today?</h2>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Start typing to see dishes from your cooking database.
              </p>
              <DishSearch onSelect={handleAddRecipe} />
            </section>

            <SelectedDishes 
              recipes={selectedRecipes} 
              onRemove={handleRemoveRecipe} 
            />

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            {selectedRecipes.length > 0 && (
              <button
                onClick={handleGenerate}
                disabled={isGenerating || isLoadingRecipe}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-3 ${
                  isGenerating 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Efficiency...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Calculate 1-Person Timeline
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          <CookingPlanDisplay plan={cookingPlan} onReset={handleReset} />
        )}
      </main>

      {/* Helper Footer for Tablet/Mobile */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 text-center md:hidden">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Cook Smarter, Not Harder
        </p>
      </footer>
    </div>
  );
};

export default App;

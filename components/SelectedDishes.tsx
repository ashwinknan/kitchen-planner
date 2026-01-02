
import React from 'react';
import { Recipe } from '../types';

interface SelectedDishesProps {
  recipes: Recipe[];
  onRemove: (id: string) => void;
}

const SelectedDishes: React.FC<SelectedDishesProps> = ({ recipes, onRemove }) => {
  if (recipes.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Dishes to Prepare</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 group hover:border-orange-200 transition-all">
            <div>
              <div className="font-bold text-gray-800">{recipe.name}</div>
              <div className="text-xs text-gray-500">{recipe.steps.length} steps</div>
            </div>
            <button
              onClick={() => onRemove(recipe.id)}
              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedDishes;

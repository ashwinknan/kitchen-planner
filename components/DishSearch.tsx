
import React, { useState, useEffect, useRef } from 'react';
import { Recipe } from '../types';
import { fetchRecipeIndex } from '../services/firebaseService';

interface DishSearchProps {
  onSelect: (recipeInfo: Partial<Recipe>) => void;
}

const DishSearch: React.FC<DishSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [recipeIndex, setRecipeIndex] = useState<Partial<Recipe>[]>([]);
  const [suggestions, setSuggestions] = useState<Partial<Recipe>[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Load recipe list on mount
  useEffect(() => {
    const loadIndex = async () => {
      try {
        const data = await fetchRecipeIndex();
        setRecipeIndex(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load recipes index", err);
        setIsLoading(false);
      }
    };
    loadIndex();
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = recipeIndex.filter(r => 
        r.name?.toLowerCase().includes(query.toLowerCase()) || 
        r.variation?.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query, recipeIndex]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isLoading ? "Loading menu..." : "Type a dish (e.g. Paneer, Dal...)"}
          disabled={isLoading}
          className="w-full px-4 py-3 text-lg border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors shadow-sm disabled:bg-gray-50"
        />
        <div className="absolute right-4 top-3.5 text-orange-400">
          {isLoading ? (
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-30 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-72 overflow-auto divide-y divide-gray-100">
          {suggestions.map((recipe) => (
            <li
              key={recipe.id}
              onClick={() => {
                onSelect(recipe);
                setQuery('');
                setIsOpen(false);
              }}
              className="px-5 py-4 hover:bg-orange-50 cursor-pointer transition-colors group"
            >
              <div className="font-bold text-gray-800 group-hover:text-orange-700">{recipe.name}</div>
              <div className="text-sm text-gray-500 flex items-center justify-between">
                <span>{recipe.variation || "Classic Style"}</span>
                {recipe.category && <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full font-black uppercase">{recipe.category}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DishSearch;

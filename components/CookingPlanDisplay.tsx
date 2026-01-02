
import React from 'react';
import { CookingPlan } from '../types';

interface CookingPlanDisplayProps {
  plan: CookingPlan;
  onReset: () => void;
}

const CookingPlanDisplay: React.FC<CookingPlanDisplayProps> = ({ plan, onReset }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-orange-600 p-6 rounded-2xl text-white shadow-lg">
        <div>
          <h2 className="text-2xl font-bold">Chef's Efficient Plan</h2>
          <p className="opacity-90">Optimized for 1 cook & 3 stoves</p>
        </div>
        <div className="text-center sm:text-right">
          <div className="text-3xl font-black">{plan.totalTime} mins</div>
          <div className="text-sm opacity-80 uppercase tracking-tighter">Total Duration</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-orange-100 p-1.5 rounded-lg text-orange-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.57l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.57l7-10a1 1 0 011.12-.384z" clipRule="evenodd" />
            </svg>
          </span>
          Early Prep Checklist
        </h3>
        <ul className="space-y-2">
          {plan.prepSummary.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700">
              <span className="w-5 h-5 flex-shrink-0 mt-0.5 border-2 border-orange-200 rounded flex items-center justify-center text-[10px] font-bold text-orange-500">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-blue-100 p-1.5 rounded-lg text-blue-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </span>
          Cooking Sequence
        </h3>
        <div className="relative border-l-4 border-orange-100 ml-4 pl-8 space-y-8">
          {plan.timeline.sort((a,b) => a.timeStart - b.timeStart).map((step, idx) => (
            <div key={idx} className="relative">
              {/* Dot on line */}
              <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-orange-500 shadow-sm" />
              
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-md uppercase">
                    {step.timeStart} - {step.timeEnd} min
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {step.dishName}
                  </span>
                </div>
                <p className="text-gray-800 font-medium text-lg leading-relaxed">
                  {step.action}
                </p>
                {step.isStoveActive && (
                  <div className="mt-3 flex items-center gap-2 text-blue-600 text-sm font-semibold bg-blue-50 w-fit px-3 py-1 rounded-full border border-blue-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1014 0c0-1.187-.234-2.32-.656-3.354a6.993 6.993 0 00-3.95-3.95zM10 18a5 5 0 110-10 5 5 0 010 10z" clipRule="evenodd" />
                    </svg>
                    Stove {step.stoveNumber || "active"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full py-4 text-gray-500 font-bold hover:text-orange-600 transition-colors"
      >
        Create New Plan
      </button>
    </div>
  );
};

export default CookingPlanDisplay;

import React from 'react';
import { ScenarioContent } from '@/simulations/types';
import { Search, MoreVertical, Globe } from 'lucide-react';

interface Props {
  content: ScenarioContent;
  highlight?: boolean;
}

export const SearchView: React.FC<Props> = ({ content, highlight }) => {
  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
      {/* Fake Browser Header */}
      <div className="bg-slate-100 p-1.5 md:p-2 border-b border-slate-200 flex items-center gap-2">
        <div className="flex gap-1 ml-1">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1 bg-white h-7 rounded border border-slate-300 flex items-center px-2 text-xs text-slate-600 mx-2">
          <Globe className="w-3 h-3 mr-1 text-slate-400" />
          google.com/search?q={encodeURIComponent(content.searchQuery || '')}
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 md:p-4 border-b border-slate-100">
        <div className="flex items-center bg-white border border-slate-300 rounded-full px-3 md:px-4 py-1.5 md:py-2 shadow-sm">
          <span className="text-blue-500 font-bold text-base md:text-lg mr-2">G</span>
          <div className="flex-1 text-xs md:text-sm text-slate-700 truncate">{content.searchQuery}</div>
          <Search className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
        </div>
      </div>

      {/* Results */}
      <div className="p-3 md:p-4 space-y-4 md:space-y-6">
        {content.results?.map((result, index) => (
          <div 
            key={index} 
            className={`font-sans ${highlight && result.isMalicious ? 'bg-red-50 p-2 -m-2 rounded ring-1 ring-red-200' : ''}`}
          >
            <div className="flex items-center gap-1 text-xs md:text-sm text-slate-700 mb-1">
               <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] text-slate-500 border border-slate-200">
                 W
               </div>
               <div className="flex flex-col leading-tight">
                  <span className="text-xs font-medium">{result.title.split(' ')[0]}</span>
                  <span className="text-[11px] text-slate-500">{result.url}</span>
               </div>
               <MoreVertical className="w-4 h-4 text-slate-400 ml-auto" />
            </div>
            <h3 className="text-xl text-blue-700 hover:underline cursor-pointer visited:text-purple-800">
              {result.title}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {result.snippet}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

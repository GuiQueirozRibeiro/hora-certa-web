'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isSearching: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  onSearchChange, 
  isSearching 
}) => {
  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <input
          type="text"
          className="w-full bg-[#0000009a] border border-[#3a3a3a] rounded-lg px-5 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
          placeholder="Buscar Barbearia"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
          </div>
        )}
      </div>
      <button className="bg-indigo-500 rounded-lg w-12 h-12 flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer">
        <Search size={20} className="text-white" />
      </button>
    </div>
  );
};

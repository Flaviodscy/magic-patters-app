import React from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
export const SearchBar = ({
  onSearch,
  value = ''
}) => {
  return <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input type="text" placeholder="Search for pillows, features, brands..." value={value} onChange={e => onSearch(e.target.value)} className="w-full pl-10 pr-10 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
      {value && <button onClick={() => onSearch('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
          <XIcon className="h-5 w-5" />
        </button>}
    </div>;
};
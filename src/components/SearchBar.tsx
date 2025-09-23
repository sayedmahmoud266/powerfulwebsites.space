import React, { useState, useEffect } from 'react';
import { Search, Command } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = '' }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('#search-input') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5 transition-all duration-200 group-focus-within:text-orange-300" />
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search powerful websites..."
          className="w-full bg-gray-900/50 border-2 border-gray-700 rounded-xl pl-12 pr-16 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-gray-900/70 transition-all duration-300 backdrop-blur-sm"
          aria-label="Search websites"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 text-gray-400 text-sm">
          <Command className="w-4 h-4" />
          <span>K</span>
        </div>
        {isFocused && (
          <div className="absolute inset-0 rounded-xl bg-orange-400/10 border-2 border-orange-400/30 pointer-events-none animate-pulse"></div>
        )}
      </div>
    </form>
  );
};
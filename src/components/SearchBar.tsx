import React, { useState } from "react";
import { Search, Sparkles } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full px-2 sm:px-0">
      <div className="relative flex items-center group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything..."
          className="w-full px-3 sm:px-4 py-3 sm:py-4 pl-10 sm:pl-12 pr-12 sm:pr-16 text-gray-100 
                   bg-gray-900/50 border border-gray-800 rounded-xl sm:rounded-2xl 
                   focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 
                   placeholder:text-gray-500 font-satoshi transition-all backdrop-blur-sm
                   text-sm sm:text-base"
        />
        <Search
          className="absolute left-3 sm:left-4 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 
                        group-focus-within:text-purple-400 transition-colors"
        />
        <button
          type="submit"
          className="absolute right-3 p-2 bg-purple-500/10 rounded-lg text-purple-400 
                   hover:bg-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

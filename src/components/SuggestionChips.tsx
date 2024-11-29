import { Code, Globe, BookOpen, MessageSquare } from "lucide-react";

interface SuggestionChipsProps {
  onSelect: (suggestion: string) => void;
}

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  const suggestions = [
    {
      icon: <Code className="w-4 h-4" />,
      text: "Help me write a React component",
    },
    {
      icon: <Globe className="w-4 h-4" />,
      text: "What's happening in tech today?",
    },
    {
      icon: <BookOpen className="w-4 h-4" />,
      text: "Teach me about quantum computing",
    },
    {
      icon: <MessageSquare className="w-4 h-4" />,
      text: "Let's discuss interesting ideas",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion.text)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/50 
                   text-gray-300 hover:bg-gray-900 transition-colors text-sm
                   border border-gray-800 hover:border-gray-700"
        >
          {suggestion.icon}
          <span>{suggestion.text}</span>
        </button>
      ))}
    </div>
  );
}

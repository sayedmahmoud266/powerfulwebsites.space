import React from "react";
import { X } from "lucide-react";

interface TagFilterProps {
  selectedTags: string[];
  availableTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
  hideHeader?: boolean;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  selectedTags,
  availableTags,
  onTagToggle,
  onClearAll,
  hideHeader = false,
}) => {
  if (availableTags.length === 0) return null;

  return (
    <div>
      {/* Sidebar header */}
      {!hideHeader && (
        <div className="sticky top-0 z-10 bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Categories
          </span>
          {selectedTags.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-zinc-500 hover:text-white transition-colors duration-150"
              aria-label="Clear all filters"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Tag list */}
      <nav className="py-1">
        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left transition-colors duration-150 ${
                isSelected
                  ? "bg-white text-black font-medium"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
              aria-label={
                isSelected ? `Remove ${tag} filter` : `Filter by ${tag}`
              }
              aria-pressed={isSelected}
            >
              <span className="truncate">{tag}</span>
              {isSelected && <X className="w-3 h-3 shrink-0 ml-2" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

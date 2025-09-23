import React from 'react';
import { X, Filter } from 'lucide-react';

interface TagFilterProps {
  selectedTags: string[];
  availableTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  selectedTags,
  availableTags,
  onTagToggle,
  onClearAll,
}) => {
  const isTagSelected = (tag: string) => selectedTags.includes(tag);

  if (availableTags.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Filter by Tags</h3>
        </div>
        {selectedTags.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-orange-400/20 border border-orange-400/40 text-orange-400 text-sm rounded-full hover:bg-orange-400/30 transition-all duration-200"
                aria-label={`Remove ${tag} filter`}
              >
                <span>{tag}</span>
                <X className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Available Tags */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">All Tags:</h4>
        <div className="flex flex-wrap gap-2">
          {availableTags
            .filter((tag) => !isTagSelected(tag))
            .map((tag) => (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className="px-3 py-1.5 bg-gray-700/30 border border-gray-600/50 text-gray-300 text-sm rounded-full hover:bg-orange-400/10 hover:border-orange-400/30 hover:text-orange-400 transition-all duration-200"
                aria-label={`Add ${tag} filter`}
              >
                {tag}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};
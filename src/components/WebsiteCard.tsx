import React, { useState } from 'react';
import { ExternalLink, Expand, Calendar, User } from 'lucide-react';

export interface Website {
  name: string;
  url: string;
  icon_url?: string;
  screenshot_url?: string;
  tags_list: string[];
  description: string;
  added_at: string;
  added_by: {
    user_alias: string;
    user_link: string;
  };
  sources: Array<{
    source_url: string;
    url_metadata: {
      og_title: string;
      og_description: string;
      og_image?: string;
    };
  }>;
}

interface WebsiteCardProps {
  website: Website;
  onExpand: (website: Website) => void;
  onTagClick: (tag: string) => void;
}

export const WebsiteCard: React.FC<WebsiteCardProps> = ({ website, onExpand, onTagClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-prevent-card-click]')) {
      return;
    }
    window.open(website.url, '_blank', 'noopener,noreferrer');
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExpand(website);
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    onTagClick(tag);
  };

  const displayImage = website.screenshot_url || website.icon_url;

  return (
    <div
      className="group bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-orange-400/50 hover:bg-gray-900/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-400/10"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`Visit ${website.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick(e);
        }
      }}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        {displayImage && !imageError ? (
          <>
            <img
              src={displayImage}
              alt={`${website.name} screenshot`}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-500/20 animate-pulse"></div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-500/20 flex items-center justify-center">
            <ExternalLink className="w-12 h-12 text-orange-400/60" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <button
          onClick={handleExpandClick}
          className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-orange-400/20 hover:text-orange-400"
          data-prevent-card-click
          aria-label="Expand details"
        >
          <Expand className="w-4 h-4" />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-200 line-clamp-1">
            {website.name}
          </h3>
          <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
            {website.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {website.tags_list.slice(0, 3).map((tag, index) => (
            <button
              key={index}
              onClick={(e) => handleTagClick(e, tag)}
              className="px-3 py-1 bg-orange-400/10 border border-orange-400/20 text-orange-400 text-xs rounded-full hover:bg-orange-400/20 hover:border-orange-400/40 transition-all duration-200"
              data-prevent-card-click
              aria-label={`Filter by ${tag}`}
            >
              {tag}
            </button>
          ))}
          {website.tags_list.length > 3 && (
            <span className="px-3 py-1 bg-gray-700/30 text-gray-400 text-xs rounded-full">
              +{website.tags_list.length - 3}
            </span>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-700/30">
          <div className="flex items-center space-x-2">
            <Calendar className="w-3 h-3" />
            <span>{new Date(website.added_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-3 h-3" />
            <span className="truncate max-w-20">{website.added_by.user_alias}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
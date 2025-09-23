import React, { useEffect } from 'react';
import { X, ExternalLink, Calendar, User, Link as LinkIcon } from 'lucide-react';
import { Website } from './WebsiteCard';

interface WebsiteModalProps {
  website: Website;
  isOpen: boolean;
  onClose: () => void;
  onTagClick: (tag: string) => void;
}

export const WebsiteModal: React.FC<WebsiteModalProps> = ({ website, isOpen, onClose, onTagClick }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleTagClick = (tag: string) => {
    onTagClick(tag);
    onClose();
  };

  const displayImage = website.screenshot_url || website.icon_url;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white p-2 rounded-xl hover:bg-orange-400/20 hover:text-orange-400 transition-all duration-200"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* Image Section */}
          <div className="lg:w-1/2 h-64 lg:h-auto relative bg-gradient-to-br from-gray-800 to-gray-900">
            {displayImage ? (
              <img
                src={displayImage}
                alt={`${website.name} screenshot`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-500/20 flex items-center justify-center">
                <ExternalLink className="w-16 h-16 text-orange-400/60" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 p-8 overflow-y-auto">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <h2 id="modal-title" className="text-2xl lg:text-3xl font-bold text-white">
                  {website.name}
                </h2>
                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors duration-200"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span className="text-sm truncate">{website.url}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Description</h3>
                <p className="text-gray-300 leading-relaxed">
                  {website.description}
                </p>
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {website.tags_list.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => handleTagClick(tag)}
                      className="px-4 py-2 bg-orange-400/10 border border-orange-400/20 text-orange-400 text-sm rounded-full hover:bg-orange-400/20 hover:border-orange-400/40 transition-all duration-200"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sources */}
              {website.sources && website.sources.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Sources</h3>
                  <div className="space-y-3">
                    {website.sources.map((source, index) => (
                      <a
                        key={index}
                        href={source.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-amber-400/30 hover:bg-gray-800/70 transition-all duration-200 group"
                      >
                        <div className="flex items-start space-x-3">
                          {source.url_metadata.og_image && (
                            <img
                              src={source.url_metadata.og_image}
                              alt=""
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium group-hover:text-orange-400 transition-colors duration-200 line-clamp-1">
                              {source.url_metadata.og_title}
                            </h4>
                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                              {source.url_metadata.og_description}
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-colors duration-200 flex-shrink-0" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-6 border-t border-gray-700/30 space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Added {new Date(website.added_at).toLocaleDateString()}</span>
                  </div>
                  <a
                    href={website.added_by.user_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 hover:text-orange-400 transition-colors duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span>@{website.added_by.user_alias}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Visit Button */}
              <div className="pt-4">
                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-orange-400 hover:bg-orange-500 text-black font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 hover:shadow-lg hover:shadow-orange-400/20"
                >
                  <span>Visit {website.name}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
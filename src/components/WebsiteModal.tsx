import React, { useEffect } from 'react';
import { X, ExternalLink, Calendar, User, Link as LinkIcon } from 'lucide-react';
import { Website } from './WebsiteCard';
import { CloudinaryPresets, generateCloudinarySrcSet } from '../utils/cloudinary';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative bg-gray-900 rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden border border-gray-700 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-sm text-white p-2 rounded-xl hover:bg-orange-400/20 hover:text-orange-400 transition-all duration-200 shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col xl:flex-row h-full max-h-[95vh]">
          {/* Image Section */}
          <div className="xl:w-3/5 h-80 xl:h-auto relative bg-gradient-to-br from-gray-800 via-gray-900 to-black overflow-hidden">
            {displayImage ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Enhanced multi-layer gradient background */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                      radial-gradient(ellipse at top left,
                        rgba(251, 146, 60, 0.6) 0%,
                        rgba(234, 88, 12, 0.4) 25%,
                        rgba(0, 0, 0, 0.8) 50%
                      ),
                      radial-gradient(ellipse at bottom right,
                        rgba(251, 146, 60, 0.5) 0%,
                        rgba(234, 88, 12, 0.3) 30%,
                        rgba(0, 0, 0, 0.9) 60%
                      ),
                      linear-gradient(135deg,
                        rgba(251, 146, 60, 0.3) 0%,
                        rgba(234, 88, 12, 0.2) 25%,
                        rgba(0, 0, 0, 0.7) 50%,
                        rgba(0, 0, 0, 1) 100%
                      )
                    `
                  }}
                />

                {/* Additional vibrant gradient overlay */}
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    background: `conic-gradient(from 0deg at 30% 40%,
                      rgba(251, 146, 60, 0.8) 0deg,
                      rgba(234, 88, 12, 0.6) 60deg,
                      rgba(251, 146, 60, 0.4) 120deg,
                      rgba(234, 88, 12, 0.3) 180deg,
                      rgba(0, 0, 0, 0.9) 240deg,
                      rgba(251, 146, 60, 0.5) 300deg,
                      rgba(234, 88, 12, 0.7) 360deg
                    )`
                  }}
                />

                {/* Centered image container */}
                <div className="relative z-10 flex items-center justify-center w-full h-full p-4 sm:p-8">
                  <img
                    src={CloudinaryPresets.modalImage(displayImage)}
                    srcSet={generateCloudinarySrcSet(displayImage, 800, {
                      crop: 'limit'
                    })}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                    alt={`${website.name} screenshot`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-gray-600/30 backdrop-blur-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>

                {/* Enhanced gradient overlays for better contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/40"></div>

                {/* Additional mesh-like gradient for texture */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 20% 20%, rgba(251, 146, 60, 0.4) 2px, transparent 2px),
                      radial-gradient(circle at 80% 80%, rgba(234, 88, 12, 0.3) 1px, transparent 1px),
                      radial-gradient(circle at 40% 60%, rgba(251, 146, 60, 0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px, 30px 30px, 40px 40px'
                  }}
                />
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-red-500/10 to-black/60 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <ExternalLink className="w-20 h-20 text-orange-400/40 mx-auto" />
                  <p className="text-gray-400 text-lg">No preview available</p>
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="xl:w-2/5 p-6 sm:p-8 overflow-y-auto bg-gray-900/90 backdrop-blur-sm border-l border-gray-700/40">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <h2 id="modal-title" className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                  {website.name}
                </h2>
                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors duration-200 group"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span className="text-sm truncate">{website.url}</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Description</h3>
                <p className="text-gray-300 leading-relaxed text-base">
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
                      className="px-3 py-1.5 bg-orange-400/10 border border-orange-400/20 text-orange-400 text-sm rounded-full hover:bg-orange-400/20 hover:border-orange-400/40 transition-all duration-200 hover:scale-105"
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
                              src={CloudinaryPresets.modalThumbnail(source.url_metadata.og_image)}
                              srcSet={generateCloudinarySrcSet(source.url_metadata.og_image, 64, {
                                height: 64,
                                crop: 'fit'
                              })}
                              sizes="64px"
                              alt=""
                              className="w-16 h-16 object-contain rounded-lg flex-shrink-0 bg-gray-800"
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
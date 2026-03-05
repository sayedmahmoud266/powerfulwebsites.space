import React, { useEffect } from "react";
import {
  X,
  ExternalLink,
  Calendar,
  User,
  Link as LinkIcon,
} from "lucide-react";
import { Website } from "./WebsiteCard";
import {
  CloudinaryPresets,
  generateCloudinarySrcSet,
} from "../utils/cloudinary";

interface WebsiteModalProps {
  website: Website;
  isOpen: boolean;
  onClose: () => void;
  onTagClick: (tag: string) => void;
}

export const WebsiteModal: React.FC<WebsiteModalProps> = ({
  website,
  isOpen,
  onClose,
  onTagClick,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
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
      <div className="relative bg-zinc-950 rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden border border-zinc-800 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-sm text-zinc-400 p-2 rounded hover:bg-white/10 hover:text-white transition-all duration-200 shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col xl:flex-row h-full max-h-[95vh]">
          {/* Image Section */}
          <div className="xl:w-3/5 h-80 xl:h-auto relative bg-zinc-950 overflow-hidden">
            {displayImage ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Dark gradient background */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                      radial-gradient(ellipse at top left,
                        rgba(80, 80, 80, 0.15) 0%,
                        rgba(40, 40, 40, 0.08) 30%,
                        rgba(0, 0, 0, 0.9) 70%
                      ),
                      radial-gradient(ellipse at bottom right,
                        rgba(60, 60, 60, 0.12) 0%,
                        rgba(30, 30, 30, 0.06) 40%,
                        rgba(0, 0, 0, 0.95) 80%
                      )
                    `,
                  }}
                />

                {/* Subtle vignette overlay */}
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)`,
                  }}
                />

                {/* Centered image container */}
                <div className="relative z-10 flex items-center justify-center w-full h-full p-4 sm:p-8">
                  <img
                    src={CloudinaryPresets.modalImage(displayImage)}
                    srcSet={generateCloudinarySrcSet(displayImage, 800, {
                      crop: "limit",
                    })}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                    alt={`${website.name} screenshot`}
                    className="max-w-full max-h-full object-contain rounded shadow-2xl border border-gray-600/30 backdrop-blur-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                {/* Edge fade overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70"></div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <ExternalLink className="w-20 h-20 text-zinc-700 mx-auto" />
                  <p className="text-zinc-500 text-lg">No preview available</p>
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="xl:w-2/5 p-6 sm:p-8 overflow-y-auto bg-zinc-950 backdrop-blur-sm border-l border-zinc-800/60">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <h2
                  id="modal-title"
                  className="text-2xl lg:text-3xl font-bold text-white leading-tight"
                >
                  {website.name}
                </h2>
                <a
                  href={website.url + "?ref=powerfulwebsites.space"}
                  target="_blank"
                  className="inline-flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors duration-200 group"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span className="text-sm truncate">{website.url}</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">
                  Description
                </h3>
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
                      className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded hover:bg-zinc-700 hover:border-zinc-500 hover:text-white transition-all duration-200 hover:scale-105"
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
                        href={source.source_url + "?ref=powerfulwebsites.space"}
                        target="_blank"
                        className="block p-4 bg-zinc-900 border border-zinc-800 rounded hover:border-zinc-600 hover:bg-zinc-800/80 transition-all duration-200 group"
                      >
                        <div className="flex items-start space-x-3">
                          {source.url_metadata.og_image && (
                            <img
                              src={CloudinaryPresets.modalThumbnail(
                                source.url_metadata.og_image,
                              )}
                              srcSet={generateCloudinarySrcSet(
                                source.url_metadata.og_image,
                                64,
                                {
                                  height: 64,
                                  crop: "fit",
                                },
                              )}
                              sizes="64px"
                              alt=""
                              className="w-16 h-16 object-contain rounded flex-shrink-0 bg-gray-800"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium group-hover:text-gray-200 transition-colors duration-200 line-clamp-1">
                              {source.url_metadata.og_title}
                            </h4>
                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                              {source.url_metadata.og_description}
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors duration-200 flex-shrink-0" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-6 border-t border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-sm text-zinc-500">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Added {new Date(website.added_at).toLocaleDateString()}
                    </span>
                  </div>
                  <a
                    href={
                      website.added_by.user_link + "?ref=powerfulwebsites.space"
                    }
                    target="_blank"
                    className="flex items-center space-x-2 hover:text-white transition-colors duration-200"
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
                  href={website.url + "?ref=powerfulwebsites.space"}
                  target="_blank"
                  className="w-full bg-white hover:bg-zinc-100 text-black font-bold py-3 px-6 rounded transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/10"
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

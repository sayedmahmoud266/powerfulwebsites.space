import React, { useState } from "react";
import { ExternalLink, Expand, Calendar, User } from "lucide-react";
import {
  CloudinaryPresets,
  generateCloudinarySrcSet,
} from "../utils/cloudinary";
import { useViewport } from "../hooks/useViewport";

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

export const WebsiteCard: React.FC<WebsiteCardProps> = ({
  website,
  onExpand,
  onTagClick,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isMobile } = useViewport();

  // Function to extract dominant colors from image data
  const extractDominantColors = (
    imageData: Uint8ClampedArray,
    colorCount: number,
  ): string[] => {
    const colorMap = new Map<string, number>();

    // Sample pixels more densely for better color detection
    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const a = imageData[i + 3];

      // Skip transparent pixels but allow darker colors
      if (a < 50) continue;

      // Skip pure white and very light colors (likely background)
      if (r > 240 && g > 240 && b > 240) continue;

      // Group similar colors together (reduce precision for better clustering)
      const rGroup = Math.floor(r / 20) * 20;
      const gGroup = Math.floor(g / 20) * 20;
      const bGroup = Math.floor(b / 20) * 20;

      const colorKey = `${rGroup},${gGroup},${bGroup}`;
      colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
    }

    // Sort by frequency and return top colors
    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, colorCount)
      .map(([colorKey]) => {
        const [r, g, b] = colorKey.split(",").map(Number);
        return `rgba(${r}, ${g}, ${b}, 0.6)`;
      });

    return sortedColors;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-prevent-card-click]")) {
      return;
    }
    onExpand(website);
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExpand(website);
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    onTagClick(tag);
  };

  return (
    <div
      className="group bg-zinc-950/60 backdrop-blur-sm border border-zinc-800 rounded-md overflow-hidden hover:border-zinc-500 hover:bg-zinc-900/60 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-white/5"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${website.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick(e as any);
        }
      }}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-zinc-900 to-black overflow-hidden">
        {website.screenshot_url && !imageError ? (
          // Screenshot available - use full cover
          <>
            <img
              src={
                isMobile
                  ? CloudinaryPresets.mobileCardScreenshot(
                      website.screenshot_url,
                    )
                  : CloudinaryPresets.cardScreenshot(website.screenshot_url)
              }
              srcSet={generateCloudinarySrcSet(
                website.screenshot_url,
                isMobile ? 320 : 400,
                {
                  crop: "limit",
                },
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              alt={`${website.name} screenshot`}
              className={`w-full h-full object-cover transition-all duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-zinc-900 animate-pulse"></div>
            )}
          </>
        ) : website.icon_url && !imageError ? (
          // Only logo available - center it with dynamic gradient based on logo colors
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/40 via-zinc-800/10 to-black/80 flex items-center justify-center">
            {/* Dynamic gradient background that adapts to logo colors */}
            <div
              className="dynamic-gradient absolute inset-0 opacity-50"
              style={{
                background: `
                  radial-gradient(ellipse at 30% 30%,
                    rgba(100, 100, 100, 0.2) 0%,
                    rgba(80, 80, 80, 0.1) 30%,
                    rgba(0, 0, 0, 0.7) 70%
                  ),
                  radial-gradient(ellipse at 70% 70%,
                    rgba(100, 100, 100, 0.15) 0%,
                    rgba(80, 80, 80, 0.1) 40%,
                    rgba(0, 0, 0, 0.8) 80%
                  )
                `,
              }}
            />

            {/* Color-adaptive overlay using CSS filters */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `radial-gradient(circle at center, transparent 20%, rgba(0, 0, 0, 0.4) 100%)`,
                mixBlendMode: "multiply" as const,
              }}
            />

            {/* Centered logo container */}
            <div className="relative z-10 flex items-center justify-center p-4">
              <img
                src={CloudinaryPresets.cardLogo(website.icon_url)}
                srcSet={generateCloudinarySrcSet(website.icon_url, 96, {
                  height: 96,
                  crop: "fit",
                })}
                sizes="96px"
                alt={`${website.name} logo`}
                className="max-w-24 max-h-24 w-auto h-auto object-contain rounded shadow-lg border border-zinc-700/20 backdrop-blur-sm filter drop-shadow-lg"
                onLoad={(e) => {
                  setImageLoaded(true);
                  // Try to extract colors from the logo for dynamic gradient
                  try {
                    const img = e.currentTarget;
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    // Use a smaller canvas for better performance
                    const maxSize = 100;
                    const scale = Math.min(
                      maxSize / img.naturalWidth,
                      maxSize / img.naturalHeight,
                    );
                    canvas.width = img.naturalWidth * scale;
                    canvas.height = img.naturalHeight * scale;

                    if (ctx) {
                      // Enable better image quality
                      ctx.imageSmoothingEnabled = true;
                      ctx.imageSmoothingQuality = "high";
                      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                      // Get image data for color analysis
                      const imageData = ctx.getImageData(
                        0,
                        0,
                        canvas.width,
                        canvas.height,
                      );
                      const colors = extractDominantColors(imageData.data, 2);

                      if (colors.length > 0) {
                        // Update gradient with desaturated (greyscale) tones
                        const gradientDiv =
                          img.parentElement?.parentElement?.parentElement?.querySelector(
                            ".dynamic-gradient",
                          ) as HTMLElement;
                        if (gradientDiv) {
                          // Convert extracted colors to greyscale luminance values
                          const toGreyscale = (color: string) => {
                            const match = color.match(
                              /rgba\((\d+),\s*(\d+),\s*(\d+)/,
                            );
                            if (!match) return "rgba(80, 80, 80, 0.4)";
                            const r = parseInt(match[1]);
                            const g = parseInt(match[2]);
                            const b = parseInt(match[3]);
                            const lum = Math.round(
                              0.299 * r + 0.587 * g + 0.114 * b,
                            );
                            return `rgba(${lum}, ${lum}, ${lum}, 0.3)`;
                          };
                          const primaryGrey = toGreyscale(colors[0]);
                          const secondaryGrey = toGreyscale(
                            colors[1] || colors[0],
                          );

                          gradientDiv.style.background = `
                            radial-gradient(ellipse at 30% 30%,
                              ${primaryGrey} 0%,
                              ${secondaryGrey.replace("0.3", "0.15")} 30%,
                              rgba(0, 0, 0, 0.8) 70%
                            ),
                            radial-gradient(ellipse at 70% 70%,
                              ${primaryGrey.replace("0.3", "0.2")} 0%,
                              ${secondaryGrey.replace("0.3", "0.1")} 40%,
                              rgba(0, 0, 0, 0.9) 80%
                            )
                          `;
                          gradientDiv.style.opacity = "0.5";
                        }
                      }
                    }
                  } catch (error) {
                    console.log(
                      "Could not extract logo colors, using default gradient",
                    );
                  }
                }}
                onError={() => setImageError(true)}
                loading="lazy"
              />
            </div>

            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          </div>
        ) : (
          // No image available - show fallback
          <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
            <ExternalLink className="w-12 h-12 text-zinc-600" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <button
          onClick={handleExpandClick}
          className="absolute top-3 right-3 bg-zinc-900 text-zinc-300 p-2 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-zinc-700 hover:text-white shadow-md cursor-pointer"
          data-prevent-card-click
          aria-label="Expand details"
        >
          <Expand className="w-4 h-4" />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-3 space-y-2">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white group-hover:text-gray-100 transition-colors duration-200 line-clamp-1">
            {website.name}
          </h3>
          <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
            {website.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {website.tags_list.slice(0, 3).map((tag, index) => (
            <button
              key={index}
              onClick={(e) => handleTagClick(e, tag)}
              className="px-2.5 py-1 bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs rounded hover:bg-zinc-700 hover:border-zinc-500 hover:text-white transition-all duration-200"
              data-prevent-card-click
              aria-label={`Filter by ${tag}`}
            >
              {tag}
            </button>
          ))}
          {website.tags_list.length > 3 && (
            <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-700 text-zinc-500 text-xs rounded">
              +{website.tags_list.length - 3}
            </span>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-zinc-500 pt-1.5 border-t border-zinc-800">
          <div className="flex items-center space-x-2">
            <Calendar className="w-3 h-3" />
            <span>{new Date(website.added_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-3 h-3" />
            <span className="truncate max-w-20">
              {website.added_by.user_alias}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

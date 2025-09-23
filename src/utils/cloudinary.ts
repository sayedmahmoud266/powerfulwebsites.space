/**
 * Cloudinary image optimization utility
 * Transforms Cloudinary URLs to serve optimized versions based on viewport and usage context
 */

interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'limit' | 'lfill';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
  dpr?: 'auto' | number;
}

/**
 * Optimizes a Cloudinary URL with the specified transformations
 */
export function optimizeCloudinaryImage(
  url: string, 
  options: CloudinaryOptions = {}
): string {
  // Check if it's a Cloudinary URL
  if (!url || !url.includes('res.cloudinary.com')) {
    return url;
  }

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
    dpr = 'auto'
  } = options;

  try {
    // Parse the Cloudinary URL
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) {
      return url;
    }

    // Build transformation parameters
    const params: string[] = [];
    
    // Add sizing first
    if (width) params.push(`w_${width}`);
    if (height) params.push(`h_${height}`);
    if (width || height) params.push(`c_${crop}`);
    
    // Add gravity for fill/crop modes
    if (gravity && (crop === 'fill' || crop === 'crop') && (width || height)) {
      params.push(`g_${gravity}`);
    }
    
    // Add quality and format
    if (quality) params.push(`q_${quality}`);
    if (format) params.push(`f_${format}`);
    
    // Add DPR for responsive images
    if (dpr) params.push(`dpr_${dpr}`);

    // Only add transformations if we have any
    if (params.length === 0) {
      return url;
    }
    
    // Insert transformations into URL
    const transformationString = params.join(',');
    const newUrlParts = [
      ...urlParts.slice(0, uploadIndex + 1),
      transformationString,
      ...urlParts.slice(uploadIndex + 1)
    ];

    return newUrlParts.join('/');
  } catch (error) {
    console.warn('Failed to optimize Cloudinary URL:', error);
    return url;
  }
}

/**
 * Predefined optimization presets for common use cases
 */
export const CloudinaryPresets = {
  // Website card screenshot (fits within 400px width, maintains aspect ratio)
  cardScreenshot: (url: string) => optimizeCloudinaryImage(url, {
    width: 400,
    quality: 'auto',
    format: 'auto',
    crop: 'limit' // Only resize if larger, maintains aspect ratio
  }),

  // Website card logo (fits within 96px, maintains aspect ratio)
  cardLogo: (url: string) => optimizeCloudinaryImage(url, {
    width: 96,
    height: 96,
    quality: 'auto',
    format: 'auto',
    crop: 'fit' // Fits within bounds, maintains aspect ratio
  }),

  // Modal large image (responsive, max 800px width)
  modalImage: (url: string) => optimizeCloudinaryImage(url, {
    width: 800,
    quality: 'auto',
    format: 'auto',
    crop: 'limit'
  }),

  // Modal thumbnail in sources (fits within 64px, maintains aspect ratio)
  modalThumbnail: (url: string) => optimizeCloudinaryImage(url, {
    width: 64,
    height: 64,
    quality: 'auto',
    format: 'auto',
    crop: 'fit' // Fits within bounds, maintains aspect ratio
  }),

  // Mobile optimized card screenshot (fits within 320px width, maintains aspect ratio)
  mobileCardScreenshot: (url: string) => optimizeCloudinaryImage(url, {
    width: 320,
    quality: 'auto',
    format: 'auto',
    crop: 'limit' // Only resize if larger, maintains aspect ratio
  }),

  // Low quality placeholder for progressive loading
  placeholder: (url: string) => optimizeCloudinaryImage(url, {
    width: 50,
    quality: 30,
    format: 'auto',
    crop: 'scale'
  })
};

/**
 * Generates responsive srcSet for Cloudinary images
 */
export function generateCloudinarySrcSet(
  url: string,
  baseWidth: number,
  options: Omit<CloudinaryOptions, 'width'> = {}
): string {
  if (!url || !url.includes('res.cloudinary.com')) {
    return '';
  }

  // Simplified srcset with just 1x and 2x variants
  const widths = [baseWidth, baseWidth * 2];
  
  return widths
    .map(width => {
      const optimizedUrl = optimizeCloudinaryImage(url, { ...options, width: Math.round(width) });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
}

/**
 * Custom Image Loader for Optimized Images
 * 
 * This loader provides intelligent image optimization and loading strategies
 */

export interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export interface OptimizedImageSources {
  avif?: string;
  webp?: string;
  jpeg?: string;
  png?: string;
}

/**
 * Default image loader that supports multiple formats and CDN optimization
 */
export const optimizedImageLoader = ({ src, width, quality = 85 }: ImageLoaderProps): string => {
  // Handle external URLs (pass through)
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Handle absolute paths
  if (src.startsWith('/')) {
    // Check if we have environment-specific CDN configuration
    const cdnBaseUrl = process.env.NEXT_PUBLIC_IMAGE_CDN_URL;
    
    if (cdnBaseUrl) {
      // Use CDN with optimization parameters
      const params = new URLSearchParams({
        w: width.toString(),
        q: quality.toString(),
        f: 'auto', // Auto-detect best format
      });
      
      return `${cdnBaseUrl}${src}?${params.toString()}`;
    }
    
    // Fallback to Next.js default optimization
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
  }

  // Handle relative paths
  return src;
};

/**
 * Get optimized image sources for different formats
 */
export const getOptimizedSources = (
  baseSrc: string, 
  width: number, 
  quality: number = 85
): OptimizedImageSources => {
  const sources: OptimizedImageSources = {};
  
  // Remove file extension from base source
  const basePath = baseSrc.replace(/\.[^/.]+$/, '');
  
  // Generate sources for different formats
  const formats = ['avif', 'webp', 'jpeg'];
  
  formats.forEach(format => {
    const src = `${basePath}.${format}`;
    sources[format as keyof OptimizedImageSources] = optimizedImageLoader({
      src,
      width,
      quality
    });
  });
  
  return sources;
};

/**
 * Generate responsive image srcset
 */
export const generateSrcSet = (
  baseSrc: string,
  sizes: number[] = [640, 768, 1024, 1280, 1920],
  format: string = 'webp',
  quality: number = 85
): string => {
  const basePath = baseSrc.replace(/\.[^/.]+$/, '');
  
  return sizes
    .map(width => {
      const src = optimizedImageLoader({
        src: `${basePath}.${format}`,
        width,
        quality
      });
      return `${src} ${width}w`;
    })
    .join(', ');
};

/**
 * Get responsive image sizes attribute
 */
export const getResponsiveSizes = (breakpoints: {
  [key: string]: string;
} = {
  '(max-width: 640px)': '100vw',
  '(max-width: 1024px)': '50vw',
  '(max-width: 1280px)': '33vw'
}): string => {
  const sizeEntries = Object.entries(breakpoints);
  const sizes = sizeEntries.map(([breakpoint, size]) => `${breakpoint} ${size}`);
  
  // Add default fallback
  sizes.push('25vw');
  
  return sizes.join(', ');
};

/**
 * Image optimization configuration
 */
export const imageConfig = {
  // Quality settings for different image types
  quality: {
    thumbnail: 75,
    card: 80,
    hero: 90,
    gallery: 85,
    avatar: 80,
  },
  
  // Standard responsive sizes
  sizes: {
    thumbnail: [150, 300],
    card: [300, 600, 900],
    hero: [640, 768, 1024, 1280, 1920, 2560],
    gallery: [400, 800, 1200],
    avatar: [50, 100, 150],
  },
  
  // Format preferences
  formats: ['avif', 'webp', 'jpeg'],
  
  // Device pixel ratio considerations
  densities: [1, 2, 3],
};

/**
 * Generate blur placeholder for images
 */
export const generateBlurPlaceholder = (width: number, height: number): string => {
  // Simple SVG-based blur placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string, crossOrigin?: string): void => {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  
  if (crossOrigin) {
    link.crossOrigin = crossOrigin;
  }
  
  document.head.appendChild(link);
};

/**
 * Lazy load image with intersection observer
 */
export const createLazyImageObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1
  }
): IntersectionObserver => {
  return new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, options);
};

/**
 * Image performance monitoring
 */
export const trackImagePerformance = (src: string, startTime: number): void => {
  if (typeof window === 'undefined' || !window.performance) return;
  
  const loadTime = performance.now() - startTime;
  
  // Send performance data to analytics
  if ((window as any).gtag) {
    (window as any).gtag('event', 'image_load_time', {
      custom_parameter_1: src,
      custom_parameter_2: Math.round(loadTime),
    });
  }
  
  // Log performance data in development
  if (process.env.NODE_ENV === 'development') {
    // Debug log removed for production
  }
};

/**
 * Utility to determine if WebP is supported
 */
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    canvas.toBlob((blob) => {
      resolve(blob?.type === 'image/webp');
    }, 'image/webp');
  });
};

/**
 * Utility to determine if AVIF is supported
 */
export const supportsAVIF = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = () => resolve(true);
    avif.onerror = () => resolve(false);
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgS0AAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
};

export default optimizedImageLoader;
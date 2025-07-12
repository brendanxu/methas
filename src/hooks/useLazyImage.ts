'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseLazyImageOptions {
  /** Intersection observer root margin */
  rootMargin?: string;
  /** Intersection observer threshold */
  threshold?: number | number[];
  /** Enable lazy loading */
  enabled?: boolean;
  /** Callback when image enters viewport */
  onEnterView?: () => void;
  /** Callback when image loads */
  onLoad?: () => void;
  /** Callback when image fails to load */
  onError?: (error: Event) => void;
}

export interface UseLazyImageReturn {
  /** Ref to attach to image container */
  ref: React.RefObject<HTMLElement>;
  /** Whether image is in viewport */
  isInView: boolean;
  /** Whether image has loaded */
  isLoaded: boolean;
  /** Whether image failed to load */
  hasError: boolean;
  /** Load the image manually */
  load: () => void;
  /** Reset the lazy loading state */
  reset: () => void;
}

/**
 * Hook for implementing lazy loading with Intersection Observer
 */
export const useLazyImage = (options: UseLazyImageOptions = {}): UseLazyImageReturn => {
  const {
    rootMargin = '50px',
    threshold = 0.1,
    enabled = true,
    onEnterView,
    onLoad,
    onError,
  } = options;

  const [isInView, setIsInView] = useState(!enabled);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const ref = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Intersection Observer callback
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (entry.isIntersecting) {
        setIsInView(true);
        onEnterView?.();
        
        // Disconnect observer once image is in view
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      }
    },
    [onEnterView]
  );

  // Set up Intersection Observer
  useEffect(() => {
    if (!enabled || !ref.current) return;

    if ('IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        rootMargin,
        threshold,
      });

      observerRef.current.observe(ref.current);
    } else {
      // Fallback for older browsers
      setIsInView(true);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enabled, handleIntersection, rootMargin, threshold]);

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  // Handle image error
  const handleError = useCallback(
    (error: Event) => {
      setHasError(true);
      setIsLoaded(false);
      onError?.(error);
    },
    [onError]
  );

  // Manual load function
  const load = useCallback(() => {
    setIsInView(true);
  }, []);

  // Reset function
  const reset = useCallback(() => {
    setIsInView(!enabled);
    setIsLoaded(false);
    setHasError(false);
  }, [enabled]);

  // Attach load and error handlers to images within the ref
  useEffect(() => {
    if (!ref.current || !isInView) return;

    const images = ref.current.querySelectorAll('img');
    
    images.forEach((img) => {
      if (img.complete) {
        handleLoad();
      } else {
        img.addEventListener('load', handleLoad);
        img.addEventListener('error', handleError);
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleError);
      });
    };
  }, [isInView, handleLoad, handleError]);

  return {
    ref,
    isInView,
    isLoaded,
    hasError,
    load,
    reset,
  };
};

/**
 * Hook for lazy loading background images
 */
export const useLazyBackgroundImage = (
  imageUrl: string,
  options: UseLazyImageOptions = {}
) => {
  const lazyImage = useLazyImage(options);
  const [backgroundImage, setBackgroundImage] = useState<string>('none');

  useEffect(() => {
    if (lazyImage.isInView && imageUrl) {
      // Preload the image
      const img = new Image();
      
      img.onload = () => {
        setBackgroundImage(`url(${imageUrl})`);
        lazyImage.load();
      };
      
      img.onerror = (error) => {
        options.onError?.(error as Event);
      };
      
      img.src = imageUrl;
    }
  }, [lazyImage.isInView, imageUrl, lazyImage, options]);

  return {
    ...lazyImage,
    backgroundImage,
    style: {
      backgroundImage,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    },
  };
};

/**
 * Hook for progressive image loading (low quality -> high quality)
 */
export const useProgressiveImage = (
  lowQualitySrc: string,
  highQualitySrc: string,
  options: UseLazyImageOptions = {}
) => {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc);
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);
  const lazyImage = useLazyImage({
    ...options,
    onEnterView: () => {
      // Load high quality image when in view
      const img = new Image();
      img.onload = () => {
        setCurrentSrc(highQualitySrc);
        setIsHighQualityLoaded(true);
        options.onLoad?.();
      };
      if (options.onError) {
        img.onerror = (event) => options.onError!(event as Event);
      }
      img.src = highQualitySrc;
      
      options.onEnterView?.();
    },
  });

  return {
    ...lazyImage,
    currentSrc,
    isHighQualityLoaded,
  };
};

/**
 * Hook for batch lazy loading multiple images
 */
export const useLazyImageBatch = (
  imageUrls: string[],
  options: UseLazyImageOptions = {}
) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const lazyImage = useLazyImage({
    ...options,
    onEnterView: () => {
      // Start loading all images when in view
      imageUrls.forEach((url) => {
        const img = new Image();
        
        img.onload = () => {
          setLoadedImages((prev) => new Set(prev).add(url));
        };
        
        img.onerror = () => {
          setFailedImages((prev) => new Set(prev).add(url));
        };
        
        img.src = url;
      });
      
      options.onEnterView?.();
    },
  });

  const allLoaded = loadedImages.size === imageUrls.length;
  const someLoaded = loadedImages.size > 0;
  const loadingProgress = imageUrls.length > 0 ? loadedImages.size / imageUrls.length : 0;

  return {
    ...lazyImage,
    loadedImages,
    failedImages,
    allLoaded,
    someLoaded,
    loadingProgress,
  };
};

export default useLazyImage;
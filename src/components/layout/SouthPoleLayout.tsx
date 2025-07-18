'use client';

import React from 'react';
import { SouthPoleOfficialNav } from '@/components/navigation/SouthPoleOfficialNav';
import { Footer } from '@/components/layouts/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface SouthPoleLayoutProps {
  children: React.ReactNode;
  className?: string;
  showNavigation?: boolean;
  showFooter?: boolean;
}

export const SouthPoleLayout: React.FC<SouthPoleLayoutProps> = ({
  children,
  className = '',
  showNavigation = true,
  showFooter = true,
}) => {
  const { ref: mainRef } = useScrollAnimation({
    threshold: 0.1,
    delay: 200,
  });

  return (
    <div 
      className={`min-h-screen flex flex-col ${className}`}
      style={{
        fontFamily: 'var(--sp-font-primary)',
        color: 'var(--sp-text-primary)',
        backgroundColor: 'var(--sp-bg-primary)',
      }}
    >
      {/* Navigation */}
      {showNavigation && <SouthPoleOfficialNav />}

      {/* Main Content */}
      <main
        ref={mainRef}
        className="flex-1 sp-scroll-reveal"
        style={{
          paddingTop: showNavigation ? 'var(--sp-nav-height)' : '0',
        }}
      >
        {children}
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

// Container component for consistent spacing
export const SouthPoleContainer: React.FC<{
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}> = ({ children, size = 'xl', className = '' }) => {
  const getContainerClass = () => {
    switch (size) {
      case 'sm':
        return 'max-w-screen-sm';
      case 'md':
        return 'max-w-screen-md';
      case 'lg':
        return 'max-w-screen-lg';
      case 'xl':
        return 'max-w-screen-xl';
      case '2xl':
        return 'max-w-screen-2xl';
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-screen-xl';
    }
  };

  return (
    <div 
      className={`${getContainerClass()} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
      style={{
        maxWidth: size === '2xl' ? 'var(--sp-container-2xl)' : undefined,
        padding: `0 var(--sp-space-container)`,
      }}
    >
      {children}
    </div>
  );
};

// Section component for consistent spacing
export const SouthPoleSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  background?: 'primary' | 'secondary' | 'light' | 'dark';
  padding?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  animate?: boolean;
}> = ({ 
  children, 
  className = '', 
  background = 'primary',
  padding = 'xl',
  animate = true,
}) => {
  const { ref } = useScrollAnimation({
    threshold: 0.1,
    delay: 100,
  });

  const getBackgroundStyle = () => {
    switch (background) {
      case 'secondary':
        return { backgroundColor: 'var(--sp-bg-secondary)' };
      case 'light':
        return { backgroundColor: 'var(--sp-bg-light)' };
      case 'dark':
        return { backgroundColor: 'var(--sp-bg-dark)', color: 'var(--sp-white)' };
      default:
        return { backgroundColor: 'var(--sp-bg-primary)' };
    }
  };

  const getPaddingStyle = () => {
    switch (padding) {
      case 'sm':
        return { padding: 'var(--sp-space-8) 0' };
      case 'md':
        return { padding: 'var(--sp-space-12) 0' };
      case 'lg':
        return { padding: 'var(--sp-space-16) 0' };
      case 'xl':
        return { padding: 'var(--sp-space-20) 0' };
      case '2xl':
        return { padding: 'var(--sp-space-24) 0' };
      default:
        return { padding: 'var(--sp-space-20) 0' };
    }
  };

  return (
    <section
      ref={animate ? ref : undefined}
      className={`${animate ? 'sp-scroll-reveal' : ''} ${className}`}
      style={{
        ...getBackgroundStyle(),
        ...getPaddingStyle(),
      }}
    >
      {children}
    </section>
  );
};

// Grid component for card layouts
export const SouthPoleGrid: React.FC<{
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ children, columns = 3, gap = 'lg', className = '' }) => {
  const getGridCols = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      case 6:
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  const getGapStyle = () => {
    switch (gap) {
      case 'sm':
        return { gap: 'var(--sp-space-4)' };
      case 'md':
        return { gap: 'var(--sp-space-6)' };
      case 'lg':
        return { gap: 'var(--sp-space-8)' };
      case 'xl':
        return { gap: 'var(--sp-space-10)' };
      default:
        return { gap: 'var(--sp-space-8)' };
    }
  };

  return (
    <div
      className={`grid ${getGridCols()} ${className}`}
      style={getGapStyle()}
    >
      {children}
    </div>
  );
};

// Hero section component
export const SouthPoleHero: React.FC<{
  children: React.ReactNode;
  backgroundImage?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  className?: string;
  minHeight?: string;
}> = ({ 
  children, 
  backgroundImage,
  overlay = false,
  overlayOpacity = 0.5,
  className = '',
  minHeight = '600px',
}) => {
  const { ref } = useScrollAnimation({
    threshold: 0.1,
    delay: 300,
  });

  return (
    <section
      ref={ref}
      className={`relative flex items-center justify-center sp-scroll-reveal ${className}`}
      style={{
        minHeight,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: 'var(--sp-black)',
            opacity: overlayOpacity,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 text-center">
        {children}
      </div>
    </section>
  );
};

export default SouthPoleLayout;
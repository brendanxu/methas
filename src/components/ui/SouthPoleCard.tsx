'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from '@/lib/modern-animations';

interface SouthPoleCardProps {
  id: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  href: string;
  ctaText?: string;
  badge?: string;
  category?: string;
  className?: string;
  variant?: 'default' | 'featured' | 'compact';
  imageAspectRatio?: '16:9' | '1:1' | '4:3';
}

export const SouthPoleCard: React.FC<SouthPoleCardProps> = ({
  id,
  title,
  description,
  image,
  imageAlt,
  href,
  ctaText = 'Learn more',
  badge,
  category,
  className = '',
  variant = 'default',
  imageAspectRatio = '16:9',
}) => {
  const getAspectRatioClass = () => {
    switch (imageAspectRatio) {
      case '1:1':
        return 'aspect-[1/1]';
      case '4:3':
        return 'aspect-[4/3]';
      default:
        return 'aspect-[16/9]';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'featured':
        return {
          card: 'sp-card-featured',
          padding: 'var(--sp-space-8)',
          titleSize: 'var(--sp-text-3xl)',
          descriptionSize: 'var(--sp-text-lg)',
        };
      case 'compact':
        return {
          card: 'sp-card-compact',
          padding: 'var(--sp-space-4)',
          titleSize: 'var(--sp-text-lg)',
          descriptionSize: 'var(--sp-text-base)',
        };
      default:
        return {
          card: 'sp-card',
          padding: 'var(--sp-space-6)',
          titleSize: 'var(--sp-text-xl)',
          descriptionSize: 'var(--sp-text-base)',
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <motion.div
      className={`${variantStyles.card} ${className}`}
      style={{
        backgroundColor: 'var(--sp-bg-primary)',
        borderRadius: 'var(--sp-radius-base)',
        boxShadow: 'var(--sp-shadow-base)',
        overflow: 'hidden',
        transition: 'var(--sp-transition-base)',
      }}
      whileHover={{
        y: -4,
        boxShadow: 'var(--sp-shadow-lg)',
      }}
      transition={{ duration: 0.2 }}
    >
      <Link href={href} className="block">
        {/* Image Section */}
        {image && (
          <div 
            className={`relative ${getAspectRatioClass()} overflow-hidden`}
            style={{
              backgroundColor: 'var(--sp-bg-light)',
            }}
          >
            <Image
              src={image}
              alt={imageAlt || title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Badge */}
            {badge && (
              <div
                style={{
                  position: 'absolute',
                  top: 'var(--sp-space-3)',
                  right: 'var(--sp-space-3)',
                  backgroundColor: 'var(--sp-accent)',
                  color: 'var(--sp-white)',
                  padding: 'var(--sp-space-1) var(--sp-space-3)',
                  borderRadius: 'var(--sp-radius-sm)',
                  fontSize: 'var(--sp-text-xs)',
                  fontWeight: 'var(--sp-fw-medium)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {badge}
              </div>
            )}
          </div>
        )}

        {/* Content Section */}
        <div style={{ padding: variantStyles.padding }}>
          {/* Category */}
          {category && (
            <div
              style={{
                fontSize: 'var(--sp-text-sm)',
                fontWeight: 'var(--sp-fw-medium)',
                color: 'var(--sp-accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: 'var(--sp-space-2)',
              }}
            >
              {category}
            </div>
          )}

          {/* Title */}
          <h3
            style={{
              fontSize: variantStyles.titleSize,
              fontWeight: 'var(--sp-fw-semibold)',
              color: 'var(--sp-text-primary)',
              lineHeight: 'var(--sp-leading-tight)',
              marginBottom: 'var(--sp-space-3)',
              fontFamily: 'var(--sp-font-condensed)',
            }}
          >
            {title}
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: variantStyles.descriptionSize,
              color: 'var(--sp-text-secondary)',
              lineHeight: 'var(--sp-leading-relaxed)',
              marginBottom: 'var(--sp-space-4)',
            }}
          >
            {description}
          </p>

          {/* CTA Link */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sp-space-2)',
              color: 'var(--sp-accent)',
              fontSize: 'var(--sp-text-base)',
              fontWeight: 'var(--sp-fw-medium)',
              transition: 'var(--sp-transition-base)',
            }}
          >
            <span>{ctaText}</span>
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: 'currentColor' }}
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <path
                d="M9 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Pre-configured card variants for common use cases
export const SouthPoleFeaturedCard: React.FC<Omit<SouthPoleCardProps, 'variant'>> = (props) => (
  <SouthPoleCard {...props} variant="featured" />
);

export const SouthPoleCompactCard: React.FC<Omit<SouthPoleCardProps, 'variant'>> = (props) => (
  <SouthPoleCard {...props} variant="compact" />
);

export default SouthPoleCard;
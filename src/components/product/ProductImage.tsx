/**
 * Product Image Component - Mobile Optimized for Samsung S24+
 * 
 * Features:
 * - Responsive images with srcset
 * - Lazy loading for performance
 * - Fallback placeholders
 * - Optimized for high-DPI screens (516 DPI on S24+)
 */

import { useState } from 'react';
import type { ProductImages } from '../../types/enhancedPrice';

interface ProductImageProps {
  images?: ProductImages;
  productName: string;
  size?: 'thumbnail' | 'card' | 'full';
  className?: string;
  alt?: string;
  loading?: 'lazy' | 'eager';
}

export default function ProductImage({
  images,
  productName,
  size = 'card',
  className = '',
  alt,
  loading = 'lazy',
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Get appropriate image URL based on size
  const getImageUrl = () => {
    if (!images || imageError) {
      return images?.fallback || `https://via.placeholder.com/400x400/e0e0e0/757575?text=${encodeURIComponent(productName)}`;
    }
    
    switch (size) {
      case 'thumbnail':
        return images.thumbnail;
      case 'card':
        return images.card;
      case 'full':
        return images.full;
      default:
        return images.card;
    }
  };
  
  // Build srcset for responsive images
  const getSrcSet = () => {
    if (!images || imageError || !images.srcset) {
      return undefined;
    }
    
    return images.srcset
      .map(src => `${src.url} ${src.descriptor}`)
      .join(', ');
  };
  
  // Handle image load error
  const handleError = () => {
    setImageError(true);
    setImageLoaded(true);
  };
  
  // Handle image load success
  const handleLoad = () => {
    setImageLoaded(true);
  };
  
  const imageUrl = getImageUrl();
  const srcset = getSrcSet();
  const imageAlt = alt || productName;
  
  // Size classes for different display modes
  const sizeClasses = {
    thumbnail: 'w-20 h-20',
    card: 'w-full h-48 md:h-56',
    full: 'w-full h-auto',
  };
  
  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {/* Loading skeleton */}
      {!imageLoaded && (
        <div className={`absolute inset-0 ${sizeClasses[size]} animate-pulse bg-gray-200`}>
          <div className="flex items-center justify-center h-full">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={imageUrl}
        srcSet={srcset}
        alt={imageAlt}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
        className={`${sizeClasses[size]} object-contain transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Attribution badge (for Open Food Facts images) */}
      {images && !imageError && images.source === 'openfoodfacts' && size === 'full' && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
          📸 Open Food Facts
        </div>
      )}
      
      {/* Error state indicator */}
      {imageError && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
          Image non disponible
        </div>
      )}
    </div>
  );
}

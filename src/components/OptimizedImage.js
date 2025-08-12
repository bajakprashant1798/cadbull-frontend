import { useState } from 'react';
import Image from 'next/image';
import { getSafeImageUrl } from '@/utils/imageUtils';

// Simple static blur placeholder - no canvas operations
const BLUR_PLACEHOLDER = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

/**
 * Fast image component - prioritizes loading speed over fancy animations
 * 
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text
 * @param {number} props.width - Image width
 * @param {number} props.height - Image height
 * @param {boolean} props.priority - Whether image should be prioritized for LCP
 * @param {string} props.className - CSS classes
 * @param {Object} props.style - Inline styles
 * @param {string} props.sizes - Custom sizes attribute
 * @param {number} props.quality - Image quality (1-100)
 * @param {Function} props.onLoad - Image load callback
 * @param {Function} props.onError - Image error callback
 */
const OptimizedImage = ({
  src,
  alt,
  width = 800,
  height = 600,
  priority = false,
  className = '',
  style = {},
  sizes,
  quality = 85,
  onLoad,
  onError,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const handleLoadError = (e) => {
    setImageError(true);
    if (onError) onError(e);
  };

  const handleLoadSuccess = (e) => {
    if (onLoad) onLoad(e);
  };

  // Simple, fast image loading - no double loading or complex state management
  return (
    <Image
      src={getSafeImageUrl(src)}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      quality={quality}
      className={className}
      style={style}
      sizes={sizes}
      onLoad={handleLoadSuccess}
      onError={handleLoadError}
      placeholder="blur"
      blurDataURL={BLUR_PLACEHOLDER}
      {...props}
    />
  );
};

export default OptimizedImage;

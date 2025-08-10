import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  getSafeImageUrl, 
  handleImageError, 
  getResponsiveImageUrls, 
  getDeviceType,
  getImageSizes
} from '@/utils/imageUtils';

// Skeleton loading component with animated background
const ImageSkeleton = ({ width, height, className, style }) => (
  <div 
    className={`image-skeleton ${className || ''}`}
    style={{
      width: width || '100%',
      height: height || 'auto',
      aspectRatio: width && height ? `${width}/${height}` : '16/9',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeleton-loading 1.5s infinite',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#999',
      fontSize: '14px',
      position: 'relative',
      ...style
    }}
  >
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      opacity: 0.6
    }}>
      📸
    </div>
    <style jsx>{`
      @keyframes skeleton-loading {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `}</style>
  </div>
);

// Generate a simple blur placeholder
const generateBlurPlaceholder = (width = 8, height = 8) => {
  // Create a simple gradient blur placeholder
  const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null;
  if (!canvas) {
    return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";
  }
  
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Create a subtle gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f5f5f5');
  gradient.addColorStop(1, '#e5e5e5');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL('image/jpeg', 0.1);
};

/**
 * High-performance image component with beautiful loading states
 * Features skeleton loading, WebP support, and device-specific optimizations
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
 * @param {boolean} props.responsive - Whether to use responsive sizing (default: true)
 * @param {number} props.quality - Image quality (1-100)
 * @param {Function} props.onLoad - Image load callback
 * @param {Function} props.onError - Image error callback
 * @param {boolean} props.showSkeleton - Whether to show skeleton loading (default: true)
 */
const OptimizedImage = ({
  src,
  alt,
  width = 800,
  height = 600,
  priority = false,
  className = '',
  style = {},
  sizes: customSizes,
  responsive = true,
  quality = 85,
  onLoad,
  onError,
  showSkeleton = true,
  ...props
}) => {
  const [deviceType, setDeviceType] = useState('desktop');
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState(src);

  // Detect device type on mount and resize
  useEffect(() => {
    const detectDevice = () => {
      setDeviceType(getDeviceType());
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  // Update optimized source when src or device type changes
  useEffect(() => {
    if (!responsive) {
      setOptimizedSrc(getSafeImageUrl(src));
      return;
    }

    const responsiveUrls = getResponsiveImageUrls(src, { quality });
    
    switch (deviceType) {
      case 'mobile':
        setOptimizedSrc(responsiveUrls.mobile);
        break;
      case 'tablet':
        setOptimizedSrc(responsiveUrls.tablet);
        break;
      default:
        setOptimizedSrc(responsiveUrls.desktop);
    }
  }, [src, deviceType, responsive, quality]);

  // Reset loading state when src changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [src]);

  const handleLoadError = (e) => {
    if (!imageError) {
      setImageError(true);
      setImageLoaded(false);
      handleImageError(e);
      if (onError) onError(e);
    }
  };

  const handleLoadSuccess = (e) => {
    setImageLoaded(true);
    setImageError(false);
    if (onLoad) onLoad(e);
  };

  // Generate appropriate sizes attribute
  const sizesAttribute = customSizes || (responsive ? getImageSizes({
    mobileSize: deviceType === 'mobile' ? '100vw' : '50vw',
    tabletSize: '50vw',
    desktopSize: '33vw'
  }) : undefined);

  // Show skeleton while loading
  if (showSkeleton && !imageLoaded && !imageError) {
    return (
      <div style={{ position: 'relative', ...style }}>
        <ImageSkeleton 
          width={width} 
          height={height} 
          className={className}
        />
        <Image
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          quality={quality}
          className={className}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: 0,
            pointerEvents: 'none'
          }}
          sizes={responsive ? sizesAttribute : undefined}
          onLoad={handleLoadSuccess}
          onError={handleLoadError}
          placeholder="blur"
          blurDataURL={generateBlurPlaceholder(Math.min(width, 20), Math.min(height, 20))}
          {...props}
        />
      </div>
    );
  }

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      quality={quality}
      className={className}
      style={style}
      sizes={responsive ? sizesAttribute : undefined}
      onLoad={handleLoadSuccess}
      onError={handleLoadError}
      placeholder="blur"
      blurDataURL={generateBlurPlaceholder(Math.min(width, 20), Math.min(height, 20))}
      {...props}
    />
  );
};

export default OptimizedImage;

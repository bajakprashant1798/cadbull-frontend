import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  getSafeImageUrl, 
  handleImageError, 
  getResponsiveImageUrls, 
  getDeviceType,
  getImageSizes
} from '@/utils/imageUtils';

/**
 * High-performance image component optimized for mobile and different screen sizes
 * Automatically serves appropriately sized images based on device type
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
 * @param {string} props.quality - Image quality (1-100)
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
  sizes: customSizes,
  responsive = true,
  quality = 85,
  onLoad,
  onError,
  ...props
}) => {
  const [deviceType, setDeviceType] = useState('desktop');
  const [imageError, setImageError] = useState(false);
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

  const handleLoadError = (e) => {
    if (!imageError) {
      setImageError(true);
      handleImageError(e);
      if (onError) onError(e);
    }
  };

  const handleLoadSuccess = (e) => {
    setImageError(false);
    if (onLoad) onLoad(e);
  };

  // Generate appropriate sizes attribute
  const sizesAttribute = customSizes || (responsive ? getImageSizes({
    mobileSize: deviceType === 'mobile' ? '100vw' : '50vw',
    tabletSize: '50vw',
    desktopSize: '33vw'
  }) : undefined);

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
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      {...props}
    />
  );
};

export default OptimizedImage;

import { useRef, useEffect, useCallback } from "react";
import { imageCache } from "../utils/ImageCache";

export const useProductImagePreloader = (products, batchSize = 5) => {
    const hasStartedRef = useRef(false);
  
    useEffect(() => {
      if (hasStartedRef.current || !products || products.length === 0) return;
      hasStartedRef.current = true;
  
      const imageUrls = products
        .filter(product => product.image)
        .map(product => product.image);
  
      if (imageUrls.length === 0) return;
  
      imageCache.preloadBatch(imageUrls.slice(0, batchSize * 2));
  
      const timeoutId = setTimeout(() => {
        if (imageUrls.length > batchSize * 2) {
          imageCache.preloadBatch(imageUrls.slice(batchSize * 2));
        }
      }, 3000); 
  
      return () => clearTimeout(timeoutId);
    }, [products, batchSize]);
  
    const preloadNextBatch = useCallback((startIndex = 0) => {
      if (!products || products.length === 0) return;
      
      const imageUrls = products
        .slice(startIndex, startIndex + batchSize)
        .filter(product => product.image)
        .map(product => product.image);
      
      if (imageUrls.length > 0) {
        imageCache.preloadBatch(imageUrls);
      }
    }, [products, batchSize]);
  
    return { preloadNextBatch };
  };
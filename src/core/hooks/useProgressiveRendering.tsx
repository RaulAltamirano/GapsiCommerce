import { useState, useEffect } from "react";

export const useProgressiveRendering = (totalItems, options = {}) => {
    const { 
      initialBatch = 12, 
      subsequentBatches = 8, 
      interval = 100 
    } = options;
    
    const [visibleItems, setVisibleItems] = useState(
      Math.min(initialBatch, totalItems)
    );
  
    useEffect(() => {
      if (visibleItems >= totalItems) return;
      
      const timeoutId = setTimeout(() => {
        setVisibleItems(prev => 
          Math.min(prev + subsequentBatches, totalItems)
        );
      }, interval);
      
      return () => clearTimeout(timeoutId);
    }, [visibleItems, totalItems, subsequentBatches, interval]);
  
    useEffect(() => {
      setVisibleItems(Math.min(initialBatch, totalItems));
    }, [totalItems, initialBatch]);
  
    return { visibleItems };
  };
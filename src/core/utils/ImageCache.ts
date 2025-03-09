import React from "react";

export class ImageCache {
    constructor(maxSize = 100) {
      this.cache = new Map();
      this.maxSize = maxSize;
    }
  

    set(url, image) {
      if (this.cache.size >= this.maxSize) {
        const oldestKey = this.cache.keys().next().value;
        this.cache.delete(oldestKey);
      }
      
      this.cache.set(url, {
        image,
        timestamp: Date.now()
      });
    }
  

    get(url) {
      const cached = this.cache.get(url);
      if (cached) {
        cached.timestamp = Date.now();
        return cached.image;
      }
      return null;
    }

    preload(url) {
      return new Promise((resolve, reject) => {
        const cached = this.get(url);
        if (cached) {
          resolve(cached);
          return;
        }
  
        const img = new Image();
        img.onload = () => {
          this.set(url, img);
          resolve(img);
        };
        img.onerror = reject;
        img.src = url;
      });
    }
  

    preloadBatch(urls) {
      const batchSize = 5;
      let index = 0;
  
      const loadNext = () => {
        if (index >= urls.length) return;
        
        const url = urls[index++];
        this.preload(url)
          .catch(() => {}) 
          .finally(() => {
            loadNext();
          });
      };
  
      for (let i = 0; i < batchSize && i < urls.length; i++) {
        loadNext();
      }
    }
  
    cleanup(maxAge = 5 * 60 * 1000) {
      const now = Date.now();
      for (const [url, entry] of this.cache.entries()) {
        if (now - entry.timestamp > maxAge) {
          this.cache.delete(url);
        }
      }
    }
  }

  export const compressImage = (src, maxWidth = 600, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; 
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedUrl);
      };
      
      img.onerror = reject;
      img.src = src;
    });
  };
  
  export const imageCache = new ImageCache(200);
  
  export const useOptimizedImage = (originalUrl, options = {}) => {
    const { width = 300, quality = 0.8, placeholder = true } = options;
    const [status, setStatus] = React.useState({
      loading: true,
      error: false,
      url: placeholder ? originalUrl : null
    });
  
    React.useEffect(() => {
      if (!originalUrl) {
        setStatus({ loading: false, error: true, url: null });
        return;
      }
  
      const cached = imageCache.get(originalUrl);
      if (cached) {
        setStatus({ loading: false, error: false, url: originalUrl });
        return;
      }
  
      if (placeholder) {
        setStatus({ loading: true, error: false, url: originalUrl });
      } else {
        setStatus({ loading: true, error: false, url: null });
      }
  
      if (width) {
        compressImage(originalUrl, width, quality)
          .then(optimizedUrl => {
            setStatus({ loading: false, error: false, url: optimizedUrl });
            const img = new Image();
            img.src = optimizedUrl;
            imageCache.set(originalUrl, img);
          })
          .catch(() => {
            setStatus({ loading: false, error: false, url: originalUrl });
          });
      } else {
        imageCache.preload(originalUrl)
          .then(() => {
            setStatus({ loading: false, error: false, url: originalUrl });
          })
          .catch(() => {
            setStatus({ loading: false, error: true, url: null });
          });
      }
    }, [originalUrl, width, quality, placeholder]);
  
    return status;
  };
import { useState, useEffect, useCallback, useRef } from 'react';

export const useInfiniteScroll = (fetchCallback, options = {}) => {
  const { threshold = 200, initialPage = 1 } = options;
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          setPage(prevPage => prevPage + 1);
        }
      },
      {
        root: containerRef.current,
        rootMargin: `0px 0px ${threshold}px 0px`,
        threshold: 0.1,
      }
    );

    const container = containerRef.current;
    if (container) {
      const sentinel = container.querySelector('[data-infinite-scroll-sentinel]');
      if (sentinel && hasMore) {
        observerRef.current.observe(sentinel);
      }
    }
  }, [threshold, hasMore, loading]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!hasMore || loading) return;

      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchCallback(page);
        
        if (isMounted) {
          setHasMore(result.hasMore);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [page, fetchCallback, hasMore]);

  useEffect(() => {
    setupObserver();
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [setupObserver, containerRef.current, hasMore, loading]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setHasMore(true);
    setError(null);
  }, [initialPage]);

  return {
    containerRef,
    loading,
    hasMore,
    error,
    reset,
    page,
    Sentinel: () => hasMore && <div data-infinite-scroll-sentinel style={{ height: '10px' }} />,
  };
};

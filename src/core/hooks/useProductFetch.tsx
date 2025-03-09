import { useState, useEffect, useCallback } from 'react';
import walmartService from '../../services/walmartService';

const useProductFetch = (searchTerm: string) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoreProducts = useCallback(async () => {
    if (isLoading || !hasNextPage || !searchTerm) return; 

    setIsLoading(true);
    setError(null);

    try {
      const data = await walmartService.searchProducts(searchTerm, page);
      let items = data?.item?.props?.pageProps?.initialData?.searchResult?.itemStacks?.[0]?.items || [];

      if (!items.length) {
        items = data?.item?.props?.pageProps?.initialData?.contentLayout?.modules || [];
      }

      const totalItems = data?.item?.props?.pageProps?.initialData?.searchResult?.count || 0;

      if (!items.length) {
        setHasNextPage(false); 
        return;
      }

      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newItems = items.filter((item) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });

      if (products.length + items.length >= totalItems) {
        setHasNextPage(false);
      }
    } catch (err) {
      setError(err);
      console.error('Error al cargar productos:', err.message || 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, page, isLoading, hasNextPage, products.length]);

  useEffect(() => {
    fetchMoreProducts();
  }, [searchTerm, page, fetchMoreProducts]);

  useEffect(() => {
    if (searchTerm) {
      setProducts([]); 
      setPage(1);
      setHasNextPage(true); 
    }
  }, [searchTerm]);

  return {
    products,
    hasNextPage,
    isLoading,
    error,
    fetchMoreProducts,
  };
};

export default useProductFetch;
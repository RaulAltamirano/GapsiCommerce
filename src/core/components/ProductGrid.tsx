import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Container, Box, TextField, Typography, Grid, Snackbar, Alert, CircularProgress } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useDebounce from '../hooks/useDebounce';
import useProductFetch from '../hooks/useProductFetch';
import CartDropZone from './CartDropZone';
import ProductItem from './ProductItem';
import { useCartManager } from '../hooks/useCartManager';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { imageCache } from '../utils/ImageCache';
import { useProductImagePreloader } from '../hooks/useProductImagePreloader';
import { useProgressiveRendering } from '../hooks/useProgressiveRendering';

const ProductGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const loadingTimeoutRef = useRef(null);
  const [forceHideLoading, setForceHideLoading] = useState(false);
  
  const { 
    products, 
    fetchMoreProducts, 
    isLoading, 
    error,
    hasNextPage 
  } = useProductFetch(debouncedSearchTerm);
  
  const { 
    cartItems, 
    cartItemIds, 
    addToCart, 
    removeFromCart, 
    notification, 
    closeNotification 
  } = useCartManager();
  
  const availableProducts = useMemo(() => 
    products.filter(product => !cartItemIds.includes(product.id)),
    [products, cartItemIds]
  );
  
  const { 
    containerRef, 
    loading: loadingMore, 
    reset: resetScroll 
  } = useInfiniteScroll(fetchMoreProducts, { 
    threshold: 300,
    disabled: !hasNextPage || isLoading
  });
  
  useProductImagePreloader(availableProducts, 8);
  
  const { visibleItems } = useProgressiveRendering(availableProducts.length, {
    initialBatch: 8,
    subsequentBatches: 4
  });
  
  const visibleProducts = useMemo(() => 
    availableProducts.slice(0, visibleItems),
    [availableProducts, visibleItems]
  );
  
  useEffect(() => {
    if (loadingMore) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = setTimeout(() => {
        setForceHideLoading(true);
      }, 10000); 
    } else {
      clearTimeout(loadingTimeoutRef.current);
      setForceHideLoading(false);
    }
    
    return () => {
      clearTimeout(loadingTimeoutRef.current);
    };
  }, [loadingMore]);
  
  useEffect(() => {
    if (error) {
      setForceHideLoading(true);
    }
  }, [error]);
  
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
    resetScroll();
    imageCache.cleanup(0);
  }, [resetScroll]);
  
  
  const renderProducts = () => {
    if (isLoading && products.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={40} />
        </Box>
      );
    }
    
    if (visibleProducts.length === 0 && !isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography variant="body1">
            {products.length === 0 
              ? 'No se encontraron productos. Intenta con otra búsqueda.' 
              : 'Todos los productos disponibles ya están en tu carrito.'}
          </Typography>
        </Box>
      );
    }
    
    return (
      <Grid container spacing={2}>
        {visibleProducts.map((product) => (
          <Grid item key={product.usItemId || product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductItem 
              product={product} 
              addToCart={addToCart}
            />
          </Grid>
        ))}
      </Grid>
    );
  };
  
  useEffect(() => {
    setForceHideLoading(false);
  }, [debouncedSearchTerm]);
  
  return (
    <DndProvider backend={HTML5Backend}>
      <Container 
        ref={containerRef}
        sx={{ 
          height: 'calc(100vh - 64px)', 
          pt: 2, 
          pb: 2, 
          overflow: 'auto',
          overscrollBehavior: 'contain'
        }}
      >
        <Box 
          sx={{ 
            mb: 2, 
            position: 'sticky', 
            top: 0, 
            zIndex: 10, 
            backgroundColor: 'background.default', 
            py: 1,
            backdropFilter: 'blur(8px)'
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ backgroundColor: 'background.paper' }}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          />
        
        <CartDropZone 
          cartItems={cartItems}
          onItemDrop={addToCart}
          removeFromCart={removeFromCart}
          />
          </Box>
        
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Mostrando {visibleProducts.length} 
            {visibleProducts.length < availableProducts.length && 
              ` de ${availableProducts.length}`} productos disponibles
          </Typography>
          {cartItems.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              {cartItems.length} productos en carrito
            </Typography>
          )}
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Ocurrió un error al cargar los productos. Por favor, intenta nuevamente.
          </Alert>
        )}
        
        {renderProducts()}
        
        
        <Snackbar 
          open={notification.open} 
          autoHideDuration={3000} 
          onClose={closeNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={closeNotification} 
            severity={notification.severity}
            variant="filled"
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </DndProvider>
  );
};

export default React.memo(ProductGrid);
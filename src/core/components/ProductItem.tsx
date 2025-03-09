import React, { useState, useRef, useEffect, memo } from 'react';
import { Card, CardMedia, CardContent, Typography, Box, IconButton, Skeleton } from '@mui/material';
import { useDrag } from 'react-dnd';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ITEM_TYPE = 'PRODUCT';

const getOptimizedImageUrl = (originalUrl, width = 300) => {
  return originalUrl;
};

const ProductItem = ({ product, addToCart }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [shouldLoadImage, setShouldLoadImage] = useState(false);
  const itemRef = useRef(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { product },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [product]);

  const setRefs = (element) => {
    itemRef.current = element;
    drag(element);
  };

  useEffect(() => {
    const options = {
      root: null, 
      rootMargin: '200px', 
      threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setShouldLoadImage(true);
        observer.disconnect();
      }
    }, options);

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  const handleAddToCart = (e) => {
    e.stopPropagation(); 
    addToCart(product);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true); 
  };

  const thumbnailUrl = product.thumbnailImage || product.image;
  const fullImageUrl = shouldLoadImage ? getOptimizedImageUrl(product.image) : null;

  return (
    <Card 
      ref={setRefs}
      sx={{
        cursor: 'grab',
        opacity: isDragging ? 0.6 : 1,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box 
        sx={{ 
          position: 'relative', 
          paddingTop: '100%',
          backgroundColor: 'grey.100'
        }}
      >
        {!imageLoaded && (
          <Skeleton 
            variant="rectangular" 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
            animation="wave"
          />
        )}
        
        {thumbnailUrl && !imageError && (
          <CardMedia
            component="img"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: !imageLoaded ? 'blur(10px)' : 'none',
              transition: 'filter 0.3s ease',
            }}
            image={thumbnailUrl}
            alt=""
            loading="lazy"
          />
        )}
        
        {shouldLoadImage && !imageError && (
          <CardMedia
            component="img"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
            image={fullImageUrl}
            alt={product.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {imageError && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.100'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Imagen no disponible
            </Typography>
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="subtitle1" 
          component="div" 
          gutterBottom
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            height: '48px', 
          }}
        >
          {product.name}
        </Typography>
        
        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div" color="primary">
            ${product.price}
          </Typography>
          
          <IconButton
            color="primary"
            size="small"
            onClick={handleAddToCart}
            aria-label="Añadir al carrito"
          >
            <AddShoppingCartIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default memo(ProductItem);
import React, { memo, useState, useCallback } from 'react';
import { Box, Button, Card, CardContent, CardMedia, Typography, IconButton } from "@mui/material";
import { useDrag } from "react-dnd";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const DraggableProduct = ({ product, addToCart }) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = useCallback((e) => {
    e.stopPropagation();
    setExpanded(prev => !prev);
  }, []);

  const handleAddToCart = useCallback((e) => {
    e.stopPropagation();
    addToCart(product);
  }, [addToCart, product]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PRODUCT',
    item: { product },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), [product]); 

  return (
    <Card 
      ref={drag}
      sx={{ 
        width: '100%',
        height: expanded ? 'auto' : '280px', 
        maxHeight: expanded ? '450px' : '280px',
        display: 'flex', 
        flexDirection: 'column',
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          transform: 'translateY(-2px)'
        },
        position: 'relative',
        zIndex: isDragging ? 999 : 'auto'
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          sx={{ 
            height: expanded ? '180px' : '120px',
            objectFit: 'cover',
            transition: 'height 0.3s ease'
          }}
          image={product.image || 'https://via.placeholder.com/150'}
          alt={product.name}
          loading="lazy"
        />
        <IconButton 
          size="small"
          onClick={toggleExpand}
          aria-label={expanded ? "Contraer" : "Expandir"}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            backgroundColor: 'rgba(255,255,255,0.8)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
          }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      <CardContent 
        sx={{ 
          flexGrow: 1,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.2)',
            borderRadius: '4px',
          },
          p: 2,
          pb: 1
        }}
      >
        <Typography 
          variant="h6" 
          component="div" 
          sx={{
            fontWeight: 'bold',
            ...(expanded ? {} : { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })
          }}
        >
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
            ...(expanded 
              ? { display: 'block' } 
              : {
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }
            )
          }}
        >
          {product.description}
        </Typography>
        
        {expanded && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              SKU: {product.sku || 'N/A'}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Disponibilidad: {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
            </Typography>
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <Box sx={{ mt: 1 }}>
                {Object.entries(product.attributes).map(([key, value]) => (
                  <Typography key={key} variant="body2">
                    <strong>{key}:</strong> {value}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        )}
        
        <Typography 
          variant="h6" 
          color="primary" 
          sx={{ 
            mt: expanded ? 2 : 1,
            fontWeight: 'bold' 
          }}
        >
          {typeof product.price === 'number' 
            ? `$${product.price.toFixed(2)}` 
            : product.price}
        </Typography>
      </CardContent>
      <Box sx={{ p: 1.5, mt: 'auto' }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleAddToCart}
          size="small"
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
        </Button>
      </Box>
    </Card>
  );
};

export default memo(DraggableProduct);
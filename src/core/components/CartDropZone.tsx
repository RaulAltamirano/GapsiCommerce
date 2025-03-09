import { Grid, Paper, Typography } from "@mui/material";
import CartItem from "./CartItem";
import { useDrop } from "react-dnd";

const CartDropZone = ({ cartItems, onItemDrop, removeFromCart }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'PRODUCT',
      drop: (item) => onItemDrop(item.product),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }));
  
    return (
      <Paper
        ref={drop}
        elevation={3}
        sx={{
          p: 2,
          mb: 2,
          minHeight: '150px',
          backgroundColor: isOver ? 'rgba(25, 118, 210, 0.1)' : 'background.paper',
          border: isOver ? '2px dashed #1976d2' : '2px dashed #ccc',
          borderRadius: 2,
          transition: 'all 0.3s ease'
        }}
      >
        <Typography variant="h6" gutterBottom align="center">
          Carrito de Compras
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
          {cartItems.length === 0 
            ? 'Arrastra productos aquí para agregarlos al carrito' 
            : `${cartItems.length} producto(s) en el carrito`}
        </Typography>
        
        {cartItems.length > 0 && (
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {cartItems.map((item) => (
              <Grid item key={item.id} xs={12}>
                <CartItem item={item} onRemove={removeFromCart} />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    );
  };
  

  export default CartDropZone
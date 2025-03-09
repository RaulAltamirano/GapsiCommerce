import { Box, Typography } from "@mui/material";
import { Button } from "react-bootstrap";

const CartItem = ({ item, onRemove }) => {
    return (
      <Box
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 1,
          borderRadius: 1,
          backgroundColor: 'rgba(0,0,0,0.03)',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.06)',
          }
        }}
      >
        <Typography variant="body2" noWrap sx={{ maxWidth: '70%' }}>
          {item.name}
        </Typography>
        <Button 
          size="sm" 
          color="error" 
          onClick={() => onRemove(item.id)}
        >
          Eliminar
        </Button>
      </Box>
    );
  };
  

  export default CartItem
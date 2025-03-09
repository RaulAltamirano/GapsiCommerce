// App.jsx
import { Box } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import { colors } from "../theme/colors";
import CustomNavbar from "../components/CustomNavbar";
import ProductGrid from "../components/ProductGrid";
import { useCartManager } from "../hooks/useCartManager";

const HomePage = () => {
  const { clearCart } = useCartManager();
  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: colors.background,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CustomNavbar onReset={clearCart} />
      <ProductGrid />
    </Box>
  );
};

export default HomePage;

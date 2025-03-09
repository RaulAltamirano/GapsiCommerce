import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { colors } from "../theme/colors";

const CustomNavbar = ({ onReset }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="static" sx={{ bgcolor: colors.primary }}>
      <Toolbar
        sx={{
          padding: isMobile ? "0 8px" : "0 16px",
          minHeight: isMobile ? "56px" : "64px",
        }}
      >
        <Avatar src="src/assets/logo.png" alt="Logo" />
        <Typography
          variant={isMobile ? "body1" : "h6"}
          component="div"
          sx={{
            flexGrow: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          e-Commerce Gapsi
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            onClick={onReset}
            sx={{ ml: 1 }}
            aria-label="Reiniciar carrito"
          ></IconButton>

          {!isMobile && (
            <Button color="inherit" onClick={onReset} sx={{ ml: 1 }}>
              <RestartAltIcon />
              Reiniciar
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CustomNavbar;

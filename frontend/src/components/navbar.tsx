import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "react-oauth2-code-pkce";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const Navbar = () => {
  const { tokenData, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAdmin = tokenData?.realm_access?.roles.includes("Admin");

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  function handleLogOut() {
    logOut();
    navigate("/");
  }

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "white", flexGrow: 1 }}
        >
          🎉 Remember Birthdays
        </Typography>

        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {!isAdmin && (
            <>
              <Button color="inherit" component={Link} to="/">
                All Birthdays
              </Button>

              <Button color="inherit" component={Link} to="/addBirthday">
                Add Birthday
              </Button>

              <Button color="inherit" component={Link} to="/userInfo">
                My Info
              </Button>
            </>
          )}

          {isAdmin && (
            <>
              <Button color="inherit" component={Link} to="/admin">
                Admin
              </Button>
            </>
          )}

          <Button color="inherit" component={Link} to="/about">
            About
          </Button>

          <Button color="inherit" onClick={handleLogOut}>
            Log out
          </Button>
        </Box>

        <IconButton
          size="large"
          color="inherit"
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          {!isAdmin && (
            <>
              <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                All Birthdays
              </MenuItem>
              <MenuItem
                component={Link}
                to="/addBirthday"
                onClick={handleMenuClose}
              >
                Add Birthday
              </MenuItem>

              <MenuItem
                component={Link}
                to="/userInfo"
                onClick={handleMenuClose}
              >
                My Info
              </MenuItem>

              <MenuItem component={Link} to="/about" onClick={handleMenuClose}>
                About
              </MenuItem>
            </>
          )}

          {isAdmin && (
            <>
              <MenuItem component={Link} to="/admin" onClick={handleMenuClose}>
                Admin
              </MenuItem>
            </>
          )}

          <MenuItem
            onClick={() => {
              handleMenuClose();
              handleLogOut();
            }}
          >
            Log out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

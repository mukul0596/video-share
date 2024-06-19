import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Avatar,
  Button,
  Stack,
  Tooltip,
  MenuItem,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { logout } from "../../utils/auth";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const pages = [
    { label: "My Files", path: "/dashboard/my" },
    { label: "Shared Files", path: "/dashboard/shared" },
  ];

  const settings = [
    { label: "User Management", onClick: () => navigate("/dashboard/users") },
    { label: "Logout", onClick: () => logout() },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Stack direction="row" spacing={2} flex={1}>
          {pages.map((page) => (
            <Button
              key={page.path}
              onClick={() => navigate(page.path)}
              sx={{
                color: "white",
                borderRadius: 0,
                borderBottom:
                  location.pathname === page.path ? "1px solid white" : "none",
              }}
            >
              {page.label}
            </Button>
          ))}
        </Stack>

        <Box flex={0}>
          <Tooltip title="Open menu">
            <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)}>
              <Avatar>
                <AccountCircleIcon />
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={() => setAnchorElUser(null)}
          >
            {settings.map((setting) => (
              <MenuItem
                key={setting.label}
                onClick={() => {
                  setAnchorElUser(null);
                  setting.onClick();
                }}
              >
                <Typography textAlign="center">{setting.label}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

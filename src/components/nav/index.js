import { useState, useEffect } from "react";
import {
  Badge,
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Grid,
  Typography,
  Toolbar,
  Box,
  AppBar,
  Paper,
  InputBase,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  ListItemAvatar,
  ButtonBase,
  Collapse,
  Fade,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StorefrontIcon from "@mui/icons-material/Storefront";
import _ from "lodash";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector, useDispatch } from "react-redux";
import { getItemQuantity, cartReset, loadCart } from "../../store/cart";
import { loadUser, getUserInfo, userReset, userLogout } from "../../store/user";
import { loadProducts, getProducts } from "../../store/products";

import { useNavigate } from "react-router-dom";

export default function Nav() {
  let navigate = useNavigate();
  const token = window.localStorage.getItem("token");
  const user = useSelector(getUserInfo);

  const settings = ["Profile", "Payment", "Address", "Logout"];

  const [auth, setAuth] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  // const [itemQuantity, setItemQuantity] = React.useState(0);
  // const itemQuantity = React.useRef(null);
  const dispatch = useDispatch();

  const itemQuantity = useSelector(getItemQuantity);
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const getProfileImage = (imageUrl) => serverUrl + "/" + imageUrl;

  const [drawerState, setDrawerState] = useState(false);

  // console.log(itemQuantity);
  const handleCartLogo = (event) => {
    if (auth) navigate(`/myCart`);
    else navigate(`/signin`);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuSelection = (e, index) => {
    if (settings[index] === "Logout") {
      setAuth(false);
      dispatch(userLogout());
      window.localStorage.removeItem("token");

      navigate(`/`);
    } else if (settings[index] === "Profile") navigate(`/myProfile`);
    else if (settings[index] === "Address") navigate("/myAddress");
    else navigate("/myPayment");
    handleCloseUserMenu();
  };
  const cleanCart = () => {
    if (itemQuantity !== 0) dispatch(cartReset());
  };
  const cleanUser = () => {
    if (user.username) dispatch(userReset());
  };
  //load user and cart and initialization

  useEffect(() => {
    // const token = window.localStorage.getItem("token");
    const setupUser = () => {
      if (token) {
        setAuth(true);
        dispatch(loadCart());
        dispatch(loadUser());
      }
      // else {
      //   setAuth(false);
      //   cleanCart();
      //   cleanUser();
      // }
    };
    setupUser();
  }, [
    dispatch,
    // window.localStorage.getItem("token"),
    token,
  ]);

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);
  //load user
  // useEffect(() => {
  //   if (window.localStorage.getItem("token")) dispatch(loadUser());

  // }, [window.localStorage.getItem("token")]);

  // console.log("--------", user);

  const setIcon = (text) => {
    if (text === "My products") return <CategoryIcon />;
    else if (text === "My orders") return <ShoppingBagIcon />;
    else if (text === "Sell products") return <StorefrontIcon />;
  };
  const handleListButton = (text) => {
    if (text === "My products") return navigate(`/myProduct`);
    else if (text === "My orders") return navigate(`/myOrder`);
  };
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerState(open);
  };
  const list = () => (
    <Box
      // sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List sx={{ padding: 0 }}>
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              bgcolor: "customerColor.lightDark",
              ":hover": {
                bgcolor: "customerColor.lightDark",
              },
            }}
            onClick={() =>
              _.isEmpty(user) ? navigate(`/signin`) : navigate(`/myProfile`)
            }
          >
            <ListItemAvatar>
              <Avatar
                alt="user"
                src={
                  user.profile_photo ? getProfileImage(user.profile_photo) : ""
                }
              />
            </ListItemAvatar>
            {/* <ListItemIcon>
               
              </ListItemIcon> */}
            <ListItemText
              primary={
                <Typography variant="h6">
                  Hello, {_.isEmpty(user) ? "please sign in" : user.username}
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      {_.isEmpty(user) ? (
        <List>
          {["Sell products"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>{setIcon(text)}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <List>
          {["My products", "My orders"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => handleListButton(text)}>
                <ListItemIcon>{setIcon(text)}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  return (
    <Box sx={{ width: "100%" }}>
      <AppBar position="static">
        <Toolbar>
          <>
            <IconButton
              // position="flex"
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              // onClick={() => navigate(`/`)}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <SwipeableDrawer
              anchor="left"
              open={drawerState}
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
            >
              {list()}
            </SwipeableDrawer>
          </>
          <Box sx={{ flexGrow: 0.5 }}>
            <ButtonBase onClick={() => navigate(`/`)}>
              <Typography variant="h6">Product</Typography>
            </ButtonBase>
          </Box>

          <Paper
            component="form"
            sx={{
              flexGrow: 1,
              p: "1px 4px",
              display: "flex",
              alignItems: "center",
              my: "8px",
              // width: "50%",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Your Items"
              inputProps={{ "aria-label": "Search Your Items" }}
            />
            <IconButton
              type="button"
              sx={{
                p: "10px",
              }}
              aria-label="search"
              //   disableRipple={true}
              color="primary"
            >
              <SearchIcon fontSize="large" />
            </IconButton>
          </Paper>

          <Box
            sx={{
              flexGrow: 1,
              // direction: "rtl",
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}
          >
            <Collapse
              in={auth}
              // timeout="auto"
              timeout={{ appear: 500, enter: 700, exit: 1000 }}
              // sx={!auth ? { display: "none" } : { display: "block" }}
            >
              <>
                <Tooltip
                  title="My Profile"
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                >
                  <IconButton onClick={handleOpenUserMenu}>
                    <Avatar
                      alt="user"
                      src={
                        user.profile_photo
                          ? getProfileImage(user.profile_photo)
                          : ""
                      }
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting, index) => (
                    <MenuItem
                      key={setting}
                      onClick={(e) => handleMenuSelection(e, index)}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            </Collapse>
            <IconButton
              // color="primary"
              aria-label="shopping cart"
              component="label"
              onClick={handleCartLogo}
            >
              <Badge
                showZero
                badgeContent={itemQuantity ? itemQuantity : 0}
                color="secondary"
              >
                <ShoppingCartIcon fontSize="large" color="action" />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

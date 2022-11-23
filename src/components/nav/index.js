import { useState, useEffect } from "react";
import { Shake } from "reshake";

import {
  Badge,
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Autocomplete,
  Typography,
  Toolbar,
  Box,
  AppBar,
  Paper,
  TextField,
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
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ReceiptIcon from "@mui/icons-material/Receipt";
import _ from "lodash";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector, useDispatch } from "react-redux";
import { getItemQuantity, loadCart } from "../../store/cart";
import {
  loadUser,
  getUserInfo,
  userLogout,
  getAuthStatus,
} from "../../store/user";
import { loadProducts, getProducts, loadCategory } from "../../store/products";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import { loadNewOrder, getNewOrder } from "../../store/order";

export default function Nav() {
  let navigate = useNavigate();
  const token = window.localStorage.getItem("token");
  const user = useSelector(getUserInfo);
  const settings = ["Profile", "Payment", "Address", "Logout"];
  const [auth, setAuth] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerState, setDrawerState] = useState(false);
  const [open, setOpen] = useState(false);
  const products = useSelector(getProducts);
  const authStatus = useSelector(getAuthStatus);
  const order = useSelector(getNewOrder);

  // console.log(authStatus);
  // const [searchValue, setSearchValue] = useState(products[0] || null);
  const [searchValue, setSearchValue] = useState(null);
  const [inputSearchValue, setInputSearchValue] = useState("");

  const dispatch = useDispatch();

  const itemQuantity = useSelector(getItemQuantity);
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const getProfileImage = (imageUrl) => serverUrl + "/" + imageUrl;

  // console.log(itemQuantity);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setOpen(false);
    }
  };
  const handleReLogin = () => {
    setAuth(false);
    dispatch(userLogout());
    window.localStorage.removeItem("token");
    handleClose();
    navigate(`/signin`);
  };
  const handleCartLogo = (event) => {
    if (auth) navigate(`/myCart`);
    else navigate(`/emptyCart`);
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
      window.localStorage.removeItem("isResetPassword");

      navigate(`/`);
    } else if (settings[index] === "Profile") navigate(`/myProfile`);
    else if (settings[index] === "Address") navigate("/myAddress");
    else navigate("/myPayment");
    handleCloseUserMenu();
  };

  const handleSetSearchValue = (event, newValue) => {
    setSearchValue(newValue);
  };
  const handleSetInputSearchValue = (event, newInputValue) => {
    setInputSearchValue(newInputValue);
  };
  const handlePress = (event) => {
    if (event.key === "Enter") {
      if (_.isEmpty(searchValue)) return navigate("/productNotFound");
      navigate(`/product/${searchValue.product_id}`);
    }
  };
  const handleSearch = () => {
    if (_.isEmpty(searchValue)) return navigate("/productNotFound");
    navigate(`/product/${searchValue.product_id}`);
  };

  useEffect(() => {
    setOpen(!authStatus);
  }, [authStatus]);

  //load user and cart and initialization

  useEffect(() => {
    const setupUser = () => {
      if (token) {
        setAuth(true);
        dispatch(loadCart());
        dispatch(loadUser());
      }
    };
    setupUser();
  }, [dispatch, token]);

  useEffect(() => {
    dispatch(loadProducts());
    dispatch(loadNewOrder());
  }, [dispatch, token]);

  useEffect(() => {
    dispatch(loadCategory());
  }, [dispatch]);

  // claen up the search value after seraching

  useEffect(() => {
    setSearchValue(null);
    setInputSearchValue("");
  }, [navigate]);

  //load user
  // useEffect(() => {
  //   if (window.localStorage.getItem("token")) dispatch(loadUser());

  // }, [window.localStorage.getItem("token")]);

  const setIcon = (text) => {
    if (text === "My products") return <CategoryIcon />;
    else if (text === "My orders") return <ShoppingBagIcon />;
    else if (text === "Sell products") return <StorefrontIcon />;
    else if (text === "Transaction Records") return <ReceiptIcon />;
  };
  const handleLoginListButton = (text) => {
    if (text === "My products") return navigate(`/myProduct`);
    else if (text === "My orders") return navigate(`/myOrder`);
    else if (text === "Transaction Records") return navigate(`/myTransaction`);
  };
  const handleNotLoginListButton = (text) => {
    if (text === "Sell products") return navigate(`/signin`);
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
                alt={user.username}
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
              <ListItemButton onClick={() => handleNotLoginListButton(text)}>
                <ListItemIcon>{setIcon(text)}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <List>
          {["My products", "My orders", "Transaction Records"].map(
            (text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => handleLoginListButton(text)}>
                  <ListItemIcon>{setIcon(text)}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            )
          )}
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
              <Typography variant="h6">Tranow</Typography>
            </ButtonBase>

            <Fade in={!_.isEmpty(order)} timeout={{ enter: 500, exit: 1000 }}>
              <Tooltip title="You have an order to complete" placement="right">
                <IconButton
                  aria-label="remind"
                  component="label"
                  onClick={() => navigate(`/myOrder/newOrder`)}
                  disableRipple
                >
                  <Shake
                    h={5}
                    v={5}
                    r={3}
                    dur={300}
                    int={10}
                    max={100}
                    fixed={true}
                    fixedStop={false}
                    freez={true}
                  >
                    <NotificationsIcon color="error" />
                  </Shake>
                </IconButton>
              </Tooltip>
            </Fade>
          </Box>

          <Box
            sx={{
              flexGrow: 1.2,
              p: "1px 4px",
              display: "flex",
              my: "8px",
            }}
          >
            <Autocomplete
              // freeSolo
              value={searchValue}
              onChange={handleSetSearchValue}
              inputValue={inputSearchValue}
              onInputChange={handleSetInputSearchValue}
              onKeyPress={handlePress}
              id="products-search"
              options={products}
              getOptionLabel={(option) => option.name}
              fullWidth
              isOptionEqualToValue={(option, value) =>
                value && option.value === value.value
              }
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search your product"
                  // onKeyPress={handlePress}
                />
              )}
            />
            <Button onClick={handleSearch} variant="contained" color="primary">
              <SearchIcon fontSize="large" />
            </Button>
          </Box>

          <div>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="aith-title"
              aria-describedby="aith-description"
            >
              <DialogTitle id="aith-title">
                {"Log in overdue, please log in again"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="aith-description">
                  We are making your account secure so that we need to check the
                  account hourly
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleReLogin} autoFocus>
                  Back to Log in
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          <Box
            sx={{
              flexGrow: 1,
              // direction: "rtl",
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}
          >
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
            <Collapse
              in={auth}
              unmountOnExit
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
                      alt={user.username}
                      src={
                        user.profile_photo
                          ? getProfileImage(user.profile_photo)
                          : null
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
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

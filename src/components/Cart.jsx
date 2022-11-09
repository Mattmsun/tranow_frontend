import "../styles/cart.css";
import _ from "lodash";

import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  ButtonBase,
  Button,
  Paper,
  Box,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  getTotal,
  getCartItems,
  addItem,
  reduceItem,
  deleteItem,
} from "../store/cart";

import { useNavigate } from "react-router-dom";
import AppPagination from "./pagination/index";
import { addNewOrder } from "../store/order";

const Cart = () => {
  let navigate = useNavigate();

  const [windowSize, setWindowSize] = useState(getWindowSize());
  //   const [itemImage, setItemImage] = useState("");
  const dispatch = useDispatch();
  const [showedItems, setShowedItems] = useState([]);
  const items = useSelector(getCartItems);
  const total = useSelector(getTotal);
  // const items = useSelector(loadCart());

  //this is based on the pageSize in pagination
  const remainedItemSpace = ["", "", ""];

  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const getProductPicture = (imageUrl) => serverUrl + "/" + imageUrl;
  const getItemImage = (item) =>
    getProductPicture(JSON.parse(item.product_photo)[0]);

  const addCartItem = (product) => {
    const itemToAdd = _.pick(product, ["product_id", "quantity"]);
    dispatch(addItem(itemToAdd));
  };
  const removeCartItem = (product) => {
    const { cart_id } = product;
    console.log(cart_id);
    const itemToRemove = _.pick(product, ["product_id", "quantity"]);
    itemToRemove.quantity--;
    if (itemToRemove.quantity === 0) dispatch(deleteItem(cart_id));
    else dispatch(reduceItem(cart_id, itemToRemove));
  };

  const handleProceedCheckout = () => {
    dispatch(addNewOrder());
    navigate(`/myOrder/NewOrder`);
  };
  // useEffect(() => {
  //   dispatch(loadCart());
  // }, []);
  // useEffect(() => {
  //   function handleWindowResize() {
  //     setWindowSize(getWindowSize());
  //   }
  //   window.addEventListener("resize", handleWindowResize);
  //   return () => {
  //     window.removeEventListener("resize", handleWindowResize);
  //   };
  // });
  // console.log(windowSize);

  // console.log("showedItems----", showedItems);

  const ShowCartItems = () => (
    <Grid container direction="column" spacing={3}>
      {showedItems.map((item, index) => (
        <Grid item key={index}>
          <Paper
            sx={{
              p: 2,
              backgroundColor: "customerColor.lightDark",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={7} md={4} lg={3} xl={3}>
                <ButtonBase
                  className={
                    windowSize.innerWidth > 900 ? "cartImageL" : "cartImageLS"
                  }
                  onClick={() => navigate(`/product/${item.product_id}`)}
                >
                  <img
                    className={
                      windowSize.innerWidth > 900
                        ? "productImageL"
                        : "productImageS"
                    }
                    alt="complex"
                    src={getItemImage(item)}
                  />
                </ButtonBase>
              </Grid>
              <Grid item xs={12} sm={4} md={3} lg={4} xl={5} container>
                <Grid item container direction="column" spacing={2}>
                  <Grid item>
                    <Typography
                      gutterBottom
                      variant={windowSize.innerWidth > 900 ? "h4" : "h5"}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      variant={windowSize.innerWidth > 900 ? "body1" : "body2"}
                      gutterBottom
                    >
                      {item.category}
                    </Typography>
                    <Typography
                      variant={windowSize.innerWidth > 900 ? "h5" : "h6"}
                      color="text.secondary"
                    >
                      ${item.price}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={4}
                lg={5}
                xl={4}
                container
                direction="column"
                //   spacing={windowSize.innerWidth > 900 ? 15 : 2}
                justifyContent={
                  windowSize.innerWidth > 900 ? "space-between" : "flex-start"
                }
                spacing={windowSize.innerWidth > 900 ? 0 : 3}
              >
                <Grid
                  item
                  container
                  direction="row"
                  justifyContent={
                    windowSize.innerWidth > 900 ? "flex-end" : "flex-start"
                  }
                >
                  <Grid item>
                    <Typography
                      variant={windowSize.innerWidth > 1200 ? "h4" : "h5"}
                    >
                      ${item.price} x {item.quantity} = $
                      {item.price * item.quantity}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  item
                  container
                  direction="row"
                  spacing={2}
                  justifyContent={
                    windowSize.innerWidth > 900 ? "flex-end" : "flex-start"
                  }
                >
                  <Grid item>
                    <Button
                      variant="contained"
                      size={windowSize.innerWidth > 900 ? "large" : "small"}
                      onClick={() => addCartItem({ ...item, quantity: 1 })}
                    >
                      Add
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      size={windowSize.innerWidth > 900 ? "large" : "small"}
                      onClick={() => removeCartItem(item)}
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}
      {showedItems.length !== 3 &&
        remainedItemSpace.slice(showedItems.length).map((a, index) => (
          <Grid item key={index}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: "customerColor.lightDark",
              }}
            >
              <Box sx={{ height: 200 }} />
            </Paper>
          </Grid>
        ))}
    </Grid>
  );

  const ShowEmptyCart = () => (
    <Box>
      <h1>No items</h1>
    </Box>
  );

  {
    return items.length !== 0 ? (
      <Box>
        <Paper
          sx={{
            p: 2,
            marginX: "auto",
            mt: "20px",
            maxWidth: "90%",
            // flexGrow: 1,
          }}
        >
          <Grid container direction="column" rowSpacing={1}>
            <Grid item align="center">
              <Typography variant="h4">My Cart</Typography>
            </Grid>
            <ShowCartItems />
            <Grid item>
              <AppPagination
                items={items}
                setShowedItems={(items) => setShowedItems(items)}
              />
            </Grid>
            <Grid align="right" item>
              <Typography variant="h4">Total: ${total}</Typography>
            </Grid>

            <Grid
              item
              container
              direction="row"
              spacing={2}
              justifyContent="flex-end"
            >
              <Grid item>
                <Button variant="contained" onClick={handleProceedCheckout}>
                  <Typography variant="body1">Proceed to checkout</Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={() => navigate(`/`)}>
                  <Typography variant="body1">Continue shopping</Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    ) : (
      <ShowEmptyCart />
    );
  }
};
function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}
export default Cart;

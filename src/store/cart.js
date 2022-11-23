import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import moment from "moment";
import { toast } from "react-toastify";

const slice = createSlice({
  name: "cart",
  // initialState: [],
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    itemAdded: (cart, action) => {
      const product = action.payload;
      const index = cart.list.findIndex(
        (item) => item.product_id === product.product_id
      );
      if (index !== -1) {
        cart.list[index].quantity++;
        return;
      }
      cart.list.push(product);
    },
    itemRemoved: (cart, action) => {
      const product = action.payload;
      const index = cart.list.findIndex(
        (item) => item.product_id === product.product_id
      );
      // if (cart.list[index].quantity === 1) {
      //   cart.list.splice(index, 1);
      //   return;
      // }
      cart.list[index].quantity--;
    },
    itemDeleted: (cart, action) => {
      const product = action.payload;

      const index = cart.list.findIndex(
        //product.cart_id is a string
        (item) => item.cart_id == product.cart_id
      );
      cart.list.splice(index, 1);
    },
    cartReset: (cart, action) => {
      cart.list = [];
      cart.loading = false;
      cart.lastFetch = null;
    },
    cartRequested: (cart, action) => {
      cart.loading = true;
    },
    cartReceived: (cart, action) => {
      cart.list = action.payload;
      cart.loading = false;
      cart.lastFetch = Date.now();
    },
    cartRequestFailed: (cart, action) => {
      cart.loading = false;
    },
  },
});

const url = "/api/cartItems";
export const loadCart = () => (dispatch, getState) => {
  // const { lastFetch } = getState().entities.cart;

  // const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  // if (diffInMinutes < 10) return;
  return dispatch(
    apiCallBegan({
      url,
      onStart: cartRequested.type,
      onSuccess: cartReceived.type,
      onError: cartRequestFailed.type,
    })
  );
};

export const addItem = (item) =>
  apiCallBegan({
    url,
    method: "post",
    data: item,
    onSuccess: itemAdded.type,
  });

export const reduceItem = (id, item) =>
  apiCallBegan({
    url: url + "/" + id,
    method: "put",
    data: item,
    onSuccess: itemRemoved.type,
  });
export const deleteItem = (id) =>
  apiCallBegan({
    url: url + "/" + id,
    method: "delete",
    onSuccess: itemDeleted.type,
  });

export const getCartItems = createSelector(
  (state) => state.entities.cart,
  (state) => state.entities.products,
  (cart, products) => {
    const cartProducts = [];
    for (let item of cart.list) {
      for (let product of products.list) {
        if (item.product_id === product.product_id) {
          cartProducts.push({
            ...product,
            cart_id: item.cart_id,
            quantity: item.quantity,
          });
        }
      }
    }
    return cartProducts;
  }
);
export const getTotal = createSelector(
  (state) => state.entities.cart,
  (state) => state.entities.products,
  (cart, products) => {
    let total = 0;
    for (let item of cart.list) {
      for (let product of products.list) {
        if (item.product_id === product.product_id) {
          total = total + product.price * item.quantity;
        }
      }
    }
    return total;
  }
);
export const getItemQuantity = createSelector(
  (state) => state.entities.cart,
  (cart) => {
    let sum = 0;
    if (cart.list.length !== 0) {
      for (let item of cart.list) {
        sum = sum + item.quantity;
      }
    }
    return sum;
  }
);
export const getLoadingStatus = createSelector(
  (state) => state.entities.cart,
  (cart) => cart.loading
);
export const {
  itemAdded,
  itemRemoved,
  cartRequested,
  cartReceived,
  cartRequestFailed,
  cartReset,
  itemDeleted,
} = slice.actions;
export default slice.reducer;

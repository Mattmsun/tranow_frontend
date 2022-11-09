import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import moment from "moment";
import _ from "lodash";

const slice = createSlice({
  name: "products",
  // initialState: [],
  initialState: {
    list: [],
    category: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    itemAdded: (cart, action) => {
      const product = action.payload;
      const index = cart.list.findIndex((item) => item.id === product.id);
      if (index !== -1) {
        cart.list[index].quantity++;
        return;
      }
      cart.list.push(product);
    },
    itemRemoved: (cart, action) => {
      const product = action.payload;
      const index = cart.list.findIndex((item) => item.id === product.id);
      if (cart.list[index].quantity === 1) {
        cart.list.splice(index, 1);
        return;
      }
      cart.list[index].quantity--;
    },
    cartReset: (cart, action) => {
      cart.list = [];
    },
    productsRequested: (products, action) => {
      products.loading = true;
    },
    productsReceived: (products, action) => {
      products.list = action.payload;
      products.loading = false;
      products.lastFetch = Date.now();
    },
    productsRequestFailed: (products, action) => {
      products.loading = false;
    },
    productCategoryReceived: (products, action) => {
      products.category = action.payload;
      products.loading = false;
      products.lastFetch = Date.now();
    },
  },
});

const producUrl = "/api/products";
const categoryUrl = "api/productCategories";
export const loadProducts = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.cart;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < 10) return;
  return dispatch(
    apiCallBegan({
      url: producUrl,
      onStart: productsRequested.type,
      onSuccess: productsReceived.type,
      onError: productsRequestFailed.type,
    })
  );
};
export const loadCategory = () => (dispatch, getState) => {
  // const { lastFetch } = getState().entities.cart;

  // const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  // if (diffInMinutes < 10) return;
  return dispatch(
    apiCallBegan({
      url: categoryUrl,
      onStart: productsRequested.type,
      onSuccess: productCategoryReceived.type,
      onError: productsRequestFailed.type,
    })
  );
};

export const getProducts = createSelector(
  (state) => state.entities.products,
  (products) => products.list
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

export const getCategory = createSelector(
  (state) => state.entities.products,
  (products) => products.category
);

export const getLoggedinUserProducts = createSelector(
  (state) => state.entities.products,
  (state) => state.user,
  (products, user) => {
    return products.list.filter((product) => product.user_id !== user.info.id);
  }
);
export const {
  productsRequested,
  productsRequestFailed,
  productsReceived,
  productCategoryReceived,
} = slice.actions;
export default slice.reducer;

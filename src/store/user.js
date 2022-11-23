import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { createAction } from "@reduxjs/toolkit";

import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "user",
  initialState: {
    info: {},
    address: [],
    paymentMethod: [],
    products: [],
    auth: true,
    loading: false,
    lastFetch: null,
  },
  reducers: {
    resetUser: (user, action) => {
      user.info = {};
    },
    userRequested: (user, action) => {
      user.loading = true;
    },
    userReceived: (user, action) => {
      user.info = action.payload;
      user.loading = false;
      // user.lastFetch = Date.now();
    },
    userRequestFailed: (user, action) => {
      user.loading = false;
    },

    userUpdated: (user, action) => {
      const { email } = user.info;
      user.info = { ...action.payload, email };
    },
    userAddressReceived: (user, action) => {
      user.address = action.payload;
      user.loading = false;
      // user.lastFetch = Date.now();
    },
    addressUpdated: (user, action) => {
      const receivedAddress = action.payload;
      const index = user.address.findIndex(
        (address) => address.id == receivedAddress.id
      );
      user.address[index] = receivedAddress;
    },
    userAddressAdded: (user, action) => {
      user.address.push(action.payload);
    },
    userAddressDeleted: (user, action) => {
      const index = user.address.findIndex(
        (address) => address.id == action.payload.id
      );
      user.address.splice(index, 1);
    },
    userReset: (user, action) => {
      user.info = {};
      user.address = [];
      user.paymentMethod = [];
      user.products = [];
      user.auth = true;
      user.loading = false;
      user.lastFetch = null;
    },
    userPaymentReceived: (user, action) => {
      user.paymentMethod = action.payload;
      user.loading = false;
      // user.lastFetch = Date.now();
    },
    paymentMethodUpdated: (user, action) => {
      const receivedPayment = action.payload;
      const index = user.paymentMethod.findIndex(
        (payment) => payment.id == receivedPayment.id
      );
      user.paymentMethod[index] = receivedPayment;
    },
    paymentMethodDeleted: (user, action) => {
      const index = user.paymentMethod.findIndex(
        (payment) => payment.id == action.payload.id
      );
      user.paymentMethod.splice(index, 1);
    },
    paymentMethodAdded: (user, action) => {
      user.paymentMethod.push(action.payload);
    },
    userProductsReceived: (user, action) => {
      user.products = action.payload;
      user.loading = false;
      // user.lastFetch = Date.now();
    },
    userProductAdded: (user, action) => {
      const product = action.payload;
      user.products.push(product);
    },
    userProductUpdated: (user, action) => {
      const receivedProduct = action.payload;
      const index = user.products.findIndex(
        (product) => product.id == receivedProduct.id
      );
      user.products[index] = { ...user.products[index], ...receivedProduct };
    },
    userProductDeleted: (user, action) => {
      const index = user.products.findIndex(
        (product) => product.id == action.payload.id
      );
      user.products.splice(index, 1);
    },
    userAuthFailed: (user, action) => {
      user.auth = false;
    },
  },
});

const userUrl = "/api/users";
const addressUrl = "/api/userAddresses";
const userPaymentUrl = "/api/userPayments";
const userProductsUrl = "/api/products/userProducts";
const productUrl = "/api/products";

export const loadUser = () =>
  apiCallBegan({
    url: userUrl,
    onStart: userRequested.type,
    onSuccess: userReceived.type,
    onError: userRequestFailed.type,
  });

export const updateUser = (user) =>
  apiCallBegan({
    url: userUrl,
    method: "put",
    data: user,
    onSuccess: userUpdated.type,
  });

export const loadUserAddress = () =>
  apiCallBegan({
    url: addressUrl,
    onStart: userRequested.type,
    onSuccess: userAddressReceived.type,
    onError: userRequestFailed.type,
  });
export const updateUserAddress = (id, address) =>
  apiCallBegan({
    url: addressUrl + "/" + id,
    method: "put",
    data: address,
    onSuccess: addressUpdated.type,
  });

export const addUserAddress = (address) =>
  apiCallBegan({
    url: addressUrl,
    method: "post",
    data: address,
    onSuccess: userAddressAdded.type,
  });
export const deleteUserAddress = (id) =>
  apiCallBegan({
    url: addressUrl + "/" + id,
    method: "delete",
    onSuccess: userAddressDeleted.type,
  });

export const loadUserPayment = () =>
  apiCallBegan({
    url: userPaymentUrl,
    onStart: userRequested.type,
    onSuccess: userPaymentReceived.type,
    onError: userRequestFailed.type,
  });
export const updateUserPayment = (id, payment) =>
  apiCallBegan({
    url: userPaymentUrl + "/" + id,
    method: "put",
    data: payment,
    onSuccess: paymentMethodUpdated.type,
  });

export const deleteUserPayment = (id) =>
  apiCallBegan({
    url: userPaymentUrl + "/" + id,
    method: "delete",
    onSuccess: paymentMethodDeleted.type,
  });
export const addUserPayment = (payment) =>
  apiCallBegan({
    url: userPaymentUrl,
    method: "post",
    data: payment,
    onSuccess: paymentMethodAdded.type,
  });

export const loadUserProducts = () =>
  apiCallBegan({
    url: userProductsUrl,
    onStart: userRequested.type,
    onSuccess: userProductsReceived.type,
    onError: userRequested.type,
  });
export const addNewProduct = (product) =>
  apiCallBegan({
    url: productUrl,
    method: "post",
    data: product,
    onSuccess: userProductAdded.type,
  });

export const updateUserProduct = (productId, product) =>
  apiCallBegan({
    url: productUrl + "/" + productId,
    method: "put",
    data: product,
    onSuccess: userProductUpdated.type,
  });

export const deleteUserProduct = (productId) =>
  apiCallBegan({
    url: productUrl + "/" + productId,
    method: "delete",
    onSuccess: userProductDeleted.type,
  });

export const userLogout = createAction("user/userLogout");

export const getUserInfo = createSelector(
  (state) => state.user,
  (user) => user.info
);
export const getAuthStatus = createSelector(
  (state) => state.user,
  (user) => user.auth
);
export const getUserAddress = createSelector(
  (state) => state.user,
  (user) => user.address
);
export const getUserPayment = createSelector(
  (state) => state.user,
  (user) => user.paymentMethod
);
export const getUserProducts = createSelector(
  (state) => state.user,
  (user) => user.products
);
export const getUserProductById = (productId) =>
  createSelector(
    (state) => state.user,
    (user) => {
      const index = user.products.findIndex((p) => p.id === productId);
      return user.products[index];
    }
  );

export const getLoadingStatus = createSelector(
  (state) => state.user,
  (user) => user.loading
);

export const {
  resetUser,
  addUserInfo,
  userRequested,
  userReceived,
  userRequestFailed,
  userImageUpadted,
  userUpdated,
  userAddressReceived,
  userReset,
  addressUpdated,
  userAddressAdded,
  userAddressDeleted,
  userPaymentReceived,
  paymentMethodUpdated,
  paymentMethodDeleted,
  paymentMethodAdded,
  userProductsReceived,
  userProductAdded,
  userProductUpdated,
  userProductDeleted,
  userAuthFailed,
} = slice.actions;
export default slice.reducer;

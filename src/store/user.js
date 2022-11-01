import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "user",
  initialState: {
    info: {},
    address: [],
    paymentMethod: [],
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
      user.lastFetch = Date.now();
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
      user.lastFetch = Date.now();
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
    },
    userPaymentReceived: (user, action) => {
      user.paymentMethod = action.payload;
      user.loading = false;
      user.lastFetch = Date.now();
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
    userPaymendMethodAdded: (user, action) => {
      user.paymentMethod.push(action.payload);
    },
  },
});

const userUrl = "/api/users";
const addressUrl = "/api/userAddresses";
const userPaymentUrl = "/api/userPayments";
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
    onSuccess: userPaymendMethodAdded.type,
  });
export const getUserInfo = createSelector(
  (state) => state.user,
  (user) => user.info
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
  (state) => state.entities.products,
  (user, products) => {
    const selectedProducts = products.list.filter(
      (product) => product.user_id === user.info.id
    );
    return selectedProducts;
  }
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
  userPaymendMethodAdded,
} = slice.actions;
export default slice.reducer;

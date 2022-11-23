import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";

import moment from "moment";
import { toast } from "react-toastify";
import _ from "lodash";

const slice = createSlice({
  name: "order",
  // initialState: [],
  initialState: {
    list: [],
    newOrder: {},
    transaction: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    newOrderAdded: (order, action) => {
      order.newOrder.items = action.payload;
      order.newOrder.id = action.payload[0].order_id;
    },
    orderRequested: (order, action) => {
      order.loading = true;
    },
    orderReceived: (order, action) => {
      order.list = action.payload;
      order.loading = false;
      order.lastFetch = Date.now();
    },
    orderRequestFailed: (order, action) => {
      order.loading = false;
    },
    newOrderReceived: (order, action) => {
      if (!_.isEmpty(action.payload)) {
        order.newOrder.items = action.payload;
        order.newOrder.id = action.payload[0].order_id;
      }

      order.loading = false;
      order.lastFetch = Date.now();
    },
    newOrderUpdate: (order, action) => {
      const { payment_id, address_id } = action.payload;
      order.newOrder.payment_id = payment_id;
      order.newOrder.address_id = address_id;
    },
    orderReset: (order, action) => {
      order.list = [];
      order.newOrder = {};
      order.transaction = [];
      order.loading = false;
      order.lastFetch = null;
    },
    newOrderDeleted: (order, action) => {
      order.newOrder = {};
    },
    newOrderUpdated: (order, action) => {
      order.newOrder = {};
    },
    transactionReceived: (order, action) => {
      order.transaction = action.payload;
      order.loading = false;
      // order.lastFetch = Date.now();
    },
  },
});

const orderDetailUrl = "/api/orderDetails";
const orderItemUrl = "api/orderItems";
export const loadAllOrder = () => (dispatch, getState) => {
  // const { lastFetch } = getState().entities.cart;

  // const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  // if (diffInMinutes < 10) return;
  return dispatch(
    apiCallBegan({
      url: orderDetailUrl,
      onStart: orderRequested.type,
      onSuccess: orderReceived.type,
      onError: orderRequestFailed.type,
    })
  );
};
export const loadTransaction = () => (dispatch, getState) => {
  // const { lastFetch } = getState().entities.cart;

  // const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  // if (diffInMinutes < 10) return;
  return dispatch(
    apiCallBegan({
      url: orderDetailUrl + "/transaction",
      onStart: orderRequested.type,
      onSuccess: transactionReceived.type,
      onError: orderRequestFailed.type,
    })
  );
};

export const addNewOrder = () =>
  apiCallBegan({
    url: orderItemUrl,
    method: "post",
    onSuccess: newOrderAdded.type,
  });

export const loadNewOrder = () =>
  apiCallBegan({
    url: orderItemUrl,
    onStart: orderRequested.type,
    onSuccess: newOrderReceived.type,
    onError: orderRequestFailed.type,
  });
export const updateNewOrder = (data) =>
  apiCallBegan({
    url: orderDetailUrl + "/orderFinished",
    method: "post",
    data,
    onSuccess: newOrderUpdated.type,
  });
export const deleteOrder = () =>
  apiCallBegan({
    url: orderItemUrl,
    method: "delete",
    onSuccess: newOrderDeleted.type,
  });

export const getAllOrders = createSelector(
  (state) => state.entities.order,
  (order) => order.list
);
export const getNewOrder = createSelector(
  (state) => state.entities.order,
  (order) => order.newOrder
);
export const getLoadingStatus = createSelector(
  (state) => state.entities.order,
  (order) => order.loading
);
export const getTransaction = createSelector(
  (state) => state.entities.order,
  (order) => order.transaction
);
export const {
  orderRequested,
  orderReceived,
  orderRequestFailed,
  newOrderAdded,
  newOrderReceived,
  newOrderUpdate,
  orderReset,
  newOrderDeleted,
  newOrderUpdated,
  transactionReceived,
} = slice.actions;
export default slice.reducer;

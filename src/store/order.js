import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";

import moment from "moment";
import { toast } from "react-toastify";
import { cartReset } from "./cart";

const slice = createSlice({
  name: "order",
  // initialState: [],
  initialState: {
    list: [],
    newOrder: {},
    loading: false,
    lastFetch: null,
  },
  reducers: {
    newOrderAdded: (order, action) => {
      const { orderId } = action.payload;
      order.newOrder.id = orderId;
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
      order.newOrder.items = action.payload;
      order.newOrder.id = action.payload[0].order_id;
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
      order.loading = false;
      order.lastFetch = null;
    },
  },
});

const orderDetailUrl = "/api/orderDetails";
const OrderItemUrl = "api/orderItems";
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

export const addNewOrder = () =>
  apiCallBegan({
    url: OrderItemUrl,
    method: "post",
    onSuccess: newOrderAdded.type,
  });

export const loadNewOrder = () =>
  apiCallBegan({
    url: OrderItemUrl,
    onStart: orderRequested.type,
    onSuccess: newOrderReceived.type,
    onError: orderRequestFailed.type,
  });
export const updateNewOrder = (data) =>
  apiCallBegan({
    url: orderDetailUrl + "/orderFinished",
    method: "post",
    data,
    onSuccess: cartReset.type,
  });

export const getAllOrders = createSelector(
  (state) => state.entities.order,
  (order) => order.list
);
export const getNewOrder = createSelector(
  (state) => state.entities.order,
  (order) => order.newOrder
);
export const {
  orderRequested,
  orderReceived,
  orderRequestFailed,
  newOrderAdded,
  newOrderReceived,
  newOrderUpdate,
  orderReset,
} = slice.actions;
export default slice.reducer;

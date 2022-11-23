import axios from "axios";
import * as actions from "../api";
import { userAuthFailed } from "../user";

const action = {
  type: "apiCallBegan",
  payload: {
    url: "/bugs",
    method: "get",
    data: {},
    onSuccess: "bugReceived",
    onError: "apiRequestFailed",
  },
};
const serverUrl = process.env.REACT_APP_SERVER_URL;
// const token = JSON.parse(window.localStorage.getItem("token"));
// const header = { "x-auth-token": token };
const api =
  ({ dispatch, getState }) =>
  (next) =>
  async (action) => {
    const token = JSON.parse(window.localStorage.getItem("token"));
    // if (!token) return next(action);
    if (action.type !== actions.apiCallBegan.type) return next(action);
    const { url, method, data, onSuccess, onStart, onError } = action.payload;
    if (onStart) dispatch({ type: onStart });
    next(action);
    try {
      // const token = JSON.parse(window.localStorage.getItem("token"));

      const header = { "x-auth-token": token };
      const response = await axios.request({
        baseURL: serverUrl,
        headers: header,
        url,
        method,
        data,
      });
      //general
      dispatch(actions.apiCallSuccessed(response.data));
      //specific

      if (onSuccess) {
        dispatch({ type: onSuccess, payload: response.data });
      }
    } catch (error) {
      const { message } = error.response.data;
      if (message === "Invalid token") return dispatch(userAuthFailed());
      //general
      dispatch(actions.apiCallFailed(message));
      //specific
      if (onError) dispatch({ type: onError, payload: message });
    }
  };
export default api;

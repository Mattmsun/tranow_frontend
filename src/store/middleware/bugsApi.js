import axios from "axios";
import * as actions from "../api";
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

const api =
  ({ dispatch, getState }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action);
    const { url, method, data, onSuccess, onStart, onError } = action.payload;
    if (onStart) dispatch({ type: onStart });
    next(action);
    try {
      const response = await axios.request({
        baseURL: "http://localhost:9001/api",
        url,
        method,
        data,
      });
      //general
      dispatch(actions.apiCallSuccessed(response.data));
      //specific
      if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
    } catch (error) {
      //general
      dispatch(actions.apiCallFailed(error.message));
      //specific
      if (onError) dispatch({ type: onError, payload: error.message });
    }
  };
export default api;

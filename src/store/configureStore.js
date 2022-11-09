import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import toastMiddleware from "./middleware/toastMiddleware";
import toastError from "./middleware/error";
import bugsApi from "./middleware/bugsApi";
import api from "./middleware/api";
import userMiddleWare from "./middleware/user";
export default function () {
  return configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      })
        .concat(toastMiddleware())
        // .concat(toastError)

        .concat(api)
        .concat(userMiddleWare),
  });
}

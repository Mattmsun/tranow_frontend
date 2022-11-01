import { combineReducers } from "redux";
import bugReducer from "./bugs";
import userReducer from "./user";
import cartReducer from "./cart";
import productReducer from "./products";

// export default combineReducers({
//   bugs: bugReducer,
//   projects: projectReducer,
//   users: userReducer,
// });
export default combineReducers({
  cart: cartReducer,
  products: productReducer,
});

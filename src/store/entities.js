import { combineReducers } from "redux";
import orderReducer from "./order";
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
  order: orderReducer,
});

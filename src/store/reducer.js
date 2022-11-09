import { combineReducers } from "redux";
import entitiesReducer from "./entities";
import userReducer, { userLogout } from "./user";
export default combineReducers({
  entities: entitiesReducer,
  user: userReducer,
});
// const appReducer = combineReducers({
//   entities: entitiesReducer,
//   user: userReducer,
// });

// const rootReducer = (state, action) => {
//   if (action.type === userLogout.type) {

//     return appReducer(undefined, action);
//   }
//   return appReducer(state, action);
// };
// export default rootReducer;

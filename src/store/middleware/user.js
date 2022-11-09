import { cartReset } from "../cart";
import { orderReset } from "../order";
import { userLogout, userReset } from "../user";

const userMiddleWare =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    if (action.type === userLogout.type) {
      //   console.log(1);
      dispatch(cartReset());
      dispatch(orderReset());
      dispatch(userReset());
    } else next(action);
  };
export default userMiddleWare;

import { toast } from "react-toastify";
import { itemAdded, itemRemoved } from "../cart";
import {
  userUpdated,
  addressUpdated,
  userAddressAdded,
  userAddressDeleted,
} from "../user";

const toastSuccess = (message) =>
  toast.success(message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "dark",
  });
const toastMiddleware = (param) => (store) => (next) => (action) => {
  switch (action.type) {
    case itemAdded.type:
      toastSuccess("Item added successfully");
      break;
    case itemRemoved.type:
      toastSuccess("Item removed successfully");
      break;
    case userUpdated.type:
      toastSuccess("Profile updated successfully");
      break;
    case addressUpdated.type:
      toastSuccess("Address updated successfully");
      break;
    case userAddressAdded.type:
      toastSuccess("Address added successfully");
      break;
    case userAddressDeleted.type:
      toastSuccess("Address deleted successfully");
      break;
    default:
      break;
  }
  return next(action);
};
export default toastMiddleware;

import { toast } from "react-toastify";
import { itemAdded, itemRemoved } from "../cart";
import { newOrderDeleted, newOrderUpdated } from "../order";
import {
  userUpdated,
  addressUpdated,
  userAddressAdded,
  userAddressDeleted,
  userProductAdded,
  userProductUpdated,
  paymentMethodUpdated,
  paymentMethodDeleted,
  paymentMethodAdded,
  userProductDeleted,
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
    case userProductAdded.type:
      toastSuccess("Your product was added successfully");
      break;
    case userProductUpdated.type:
      toastSuccess("Your product was updated successfully");
      break;
    case userProductDeleted.type:
      toastSuccess("Your product was deleted successfully");
      break;
    case newOrderDeleted.type:
      toastSuccess("Your order was canceled successfully");
      break;
    case newOrderUpdated.type:
      toastSuccess("Your order was submitted successfully");
      break;
    case paymentMethodAdded.type:
      toastSuccess("Your payment method was added successfully");
      break;
    case paymentMethodDeleted.type:
      toastSuccess("Your payment method was deleted successfully");
      break;
    case paymentMethodUpdated.type:
      toastSuccess("Your payment method was updated successfully");
      break;
    default:
      break;
  }
  return next(action);
};
export default toastMiddleware;

import logo from "./logo.svg";
import "./App.css";
import { useContext, createContext, useEffect } from "react";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";
import Nav from "./components/nav/index";
import Search from "./components/Search";
import Products from "./components/Products";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Product from "./components/Product";
import { darkTheme } from "./customerStyles/themes";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Cart from "./components/Cart";
import SignIn from "./components/SignIn";
import Order from "./components/Order";
import Profile from "./components/Profile";
import Address from "./components/Address";
import { ToastContainer } from "react-toastify";
import Payment from "./components/Payment";
import UserProducts from "./components/UserProducts";
import NewProduct from "./components/NewProduct";
import EditUserProduct from "./components/EditUserProduct";
import OrderHistory from "./components/order/OrderHistory";
import NewOrder from "./components/order/index";
import ProductNav from "./components/nav/ProductNav";

export const WindowSizeContext = createContext({
  windowWidth: getWindowSize().innerWidth,
});

const store = configureStore();
function App() {
  return (
    // <WindowSizeContext.Provider>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ToastContainer />
      <Provider store={store}>
        <Router>
          <Nav />
          <ProductNav />
          <Routes>
            <Route path="/" element={<Products />}></Route>
            <Route path="/home" element={<Navigate to="/" />} />

            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/product/:id" element={<Product />}></Route>
            <Route path="/myCart" element={<Cart />}></Route>
            <Route path="/myOrder" element={<OrderHistory />}></Route>
            <Route path="/myOrder/newOrder" element={<NewOrder />}></Route>
            <Route path="/myProfile" element={<Profile />}></Route>
            <Route path="/myAddress" element={<Address />}></Route>
            <Route path="/myPayment" element={<Payment />}></Route>
            <Route path="/myProduct" element={<UserProducts />}></Route>
            <Route
              path="/myProduct/newProduct"
              element={<NewProduct />}
            ></Route>
            <Route
              path="/myProduct/editProduct/:id"
              element={<EditUserProduct />}
            ></Route>
          </Routes>
        </Router>
      </Provider>
    </ThemeProvider>
    // </WindowSizeContext.Provider>
  );
}
function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}
export default App;

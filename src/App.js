import logo from "./logo.svg";
// import "./App.css";
import { useContext, createContext, useEffect } from "react";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";
import Nav from "./components/nav/index";
import Products from "./components/products/index";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SingleProduct from "./components/products/SingleProduct";
import { darkTheme } from "./customerStyles/themes";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Cart from "./components/cart/index";
import SignIn from "./components/signin/index";
import UserProfile from "./components/userProfile/index";
import UserAddress from "./components/userAddress/index";
import { ToastContainer } from "react-toastify";
import UserPayment from "./components/userPayment/index";
import UserProducts from "./components/userProducts/index";
import NewProduct from "./components/userProducts/NewProduct";
import EditProduct from "./components/userProducts/EditProduct";
import OrderHistory from "./components/order/OrderHistory";
import NewOrder from "./components/order/index";
import WithProductNav from "./components/route/WithProductNav";
import About from "./components/About";
import WithFooter from "./components/route/WithFooter";
import ProductsNotFound from "./components/products/ProductsNotFound";
import Category from "./components/products/Category";
import CategoryProducts from "./components/products/CategoryProducts";
import EmptyCart from "./components/cart/EmptyCart";
import Contact from "./components/Contact";
import SignUp from "./components/signup/index";
import UserTransaction from "./components/transaction/index";
import NoMatch from "./components/NoMatch";
import PrivateRoutes from "./components/route/PrivateRoutes";
import ResetPassword from "./components/resetPassword/index";

export const WindowSizeContext = createContext({
  windowWidth: getWindowSize().innerWidth,
});

const store = configureStore();

const ResetPasswordWraper = ({ children }) => {
  const isResetPassword = window.localStorage.getItem("isResetPassword");
  return !isResetPassword ? <Navigate to="/" replace /> : children;
};
function App() {
  return (
    // <WindowSizeContext.Provider>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ToastContainer />
      <Provider store={store}>
        <Router>
          <Nav />
          <Routes>
            <Route path="/signin" element={<SignIn />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/resetPassword" element={<ResetPassword />}></Route>
            <Route
              path="/resetPassword/:resetCode"
              element={
                <ResetPasswordWraper>
                  <ResetPassword />
                </ResetPasswordWraper>
              }
            ></Route>

            <Route element={<WithFooter />}>
              <Route element={<WithProductNav />}>
                {/* <Route path="/" element={<Products />}></Route> */}
                <Route path="/home" element={<Products />}></Route>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/about" element={<About />}></Route>
                <Route path="/category" element={<Category />}></Route>
                <Route path="/contact" element={<Contact />}></Route>
              </Route>
              <Route
                path="/category/:id"
                element={<CategoryProducts />}
              ></Route>

              <Route path="/product/:id" element={<SingleProduct />}></Route>
              <Route element={<PrivateRoutes />}>
                <Route path="/myCart" element={<Cart />}></Route>
                <Route path="/myOrder" element={<OrderHistory />}></Route>
                <Route path="/myOrder/newOrder" element={<NewOrder />}></Route>
                <Route path="/myProfile" element={<UserProfile />}></Route>
                <Route path="/myAddress" element={<UserAddress />}></Route>
                <Route path="/myPayment" element={<UserPayment />}></Route>
                <Route path="/myProduct" element={<UserProducts />}></Route>
                <Route
                  path="/myTransaction"
                  element={<UserTransaction />}
                ></Route>

                <Route
                  path="/myProduct/newProduct"
                  element={<NewProduct />}
                ></Route>
                <Route
                  path="/myProduct/editProduct/:id"
                  element={<EditProduct />}
                ></Route>
              </Route>
              <Route
                path="/productNotFound"
                element={<ProductsNotFound />}
              ></Route>
              <Route
                path="/emptyCart"
                element={<EmptyCart type={"notloggedin"} />}
              ></Route>
              <Route path="*" element={<NoMatch />}></Route>
            </Route>
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

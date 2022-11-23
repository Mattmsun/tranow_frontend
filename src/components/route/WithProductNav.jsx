import ProductNav from "../nav/ProductNav";
import { Outlet } from "react-router";

const WithProductNav = () => {
  return (
    <>
      <ProductNav />
      <Outlet />
    </>
  );
};
export default WithProductNav;

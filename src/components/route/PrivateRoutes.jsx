import { Outlet, Navigate } from "react-router";

const PrivateRoutes = () => {
  const token = window.localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoutes;

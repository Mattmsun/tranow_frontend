import { Outlet } from "react-router";
import Footer from "../footer/index";
import { Box } from "@mui/material";

const WithFooter = () => {
  return (
    <>
      <Box sx={{ minHeight: "30vh" }}>
        <Outlet />
      </Box>
      <Footer />
    </>
  );
};
export default WithFooter;

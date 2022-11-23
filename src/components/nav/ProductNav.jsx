import { useState, useMemo, useEffect } from "react";
import {
  Typography,
  Breadcrumbs,
  Link,
  Box,
  AppBar,
  Tabs,
  Tab,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const ProductNav = () => {
  const navigate = useNavigate();
  let location = useLocation();
  const currentTab = () => {
    let path = location.pathname;
    if (path === "/home" || path === "/") return 0;
    else if (path === "/category") return 1;
    else if (path === "/about") return 2;
    else if (path === "/contact") return 3;
  };
  const tabNameToIndex = {
    0: "home",
    1: "category",
    2: "about",
    3: "contact",
  };

  const indexToTabName = {
    home: 0,
    category: 1,
    about: 2,
    contact: 3,
  };
  const [selectedTab, setSelectedTab] = useState(0);
  const handleChange = (event, newValue) => {
    navigate(`/${tabNameToIndex[newValue]}`);
    setSelectedTab(newValue);
  };
  useEffect(() => {
    setSelectedTab(currentTab);
  }, []);
  // console.log(location);
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="inherit"
        // variant="fullWidth"
        aria-label="product-nav"
        centered
      >
        <Tab label="Products" />
        <Tab label="Category" />
        <Tab label="About" />
        <Tab label="Contact" />
      </Tabs>
    </Box>
  );
};

export default ProductNav;

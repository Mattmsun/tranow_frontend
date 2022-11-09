import { useState } from "react";
import {
  Typography,
  Breadcrumbs,
  Link,
  Box,
  AppBar,
  Tabs,
  Tab,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProductNav = () => {
  const navigate = useNavigate();
  const tabNameToIndex = {
    0: "home",
    1: "popular",
    2: "about",
    3: "contact",
  };

  const indexToTabName = {
    home: 0,
    popular: 1,
    about: 2,
    contact: 3,
  };
  const [selectedTab, setSelectedTab] = useState(0);
  const handleChange = (event, newValue) => {
    navigate(`/${tabNameToIndex[newValue]}`);
    setSelectedTab(newValue);
  };
  return (
    <Box
      role="presentation"
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <AppBar
        position="static"
        // sx={{ width: "50%", backgroundColor: "yellow" }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Products" />
          <Tab label="Popular" />
          <Tab label="About" />
          <Tab label="Contact Us" />
        </Tabs>
      </AppBar>
    </Box>
  );
};

export default ProductNav;

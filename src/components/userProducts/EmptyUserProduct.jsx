import { Box, Grid, Paper, Typography, Link, Button } from "@mui/material";
import React from "react";
import emptyAddress from "../../images/empty_cart.webp";

const EmptyUserProduct = () => {
  return (
    // <Grid
    //   container
    //   direction="row"
    //   justifyContent="center"
    //   alignItems="center"
    //   spacing={4}
    // >
    <Grid item xs={12}>
      <img style={{ width: "100%" }} src={emptyAddress} />
    </Grid>
    // </Grid>
  );
};

export default EmptyUserProduct;

import { Box, Grid, Paper, Typography, Link, Button } from "@mui/material";
import React from "react";
import emptyAddress from "../../images/empty-payment.png";

const EmptyPayment = () => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={4}
    >
      <Grid item xs={4}>
        <Typography gutterBottom variant="h4">
          You don't have any payment method
        </Typography>
      </Grid>
      <Grid item xs={7}>
        <img style={{ width: "100%" }} src={emptyAddress} />
      </Grid>
    </Grid>
  );
};

export default EmptyPayment;

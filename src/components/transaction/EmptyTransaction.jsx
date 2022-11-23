import { Box, Grid, Paper, Typography, Link, Button } from "@mui/material";
import React from "react";
import emptyCart from "../../images/empty_cart.webp";
import { useNavigate } from "react-router-dom";

const EmptyTransaction = () => {
  let navigate = useNavigate();

  return (
    <Box>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <Grid item xs={5}>
          <Typography gutterBottom variant="h4">
            You have no order
          </Typography>
          <Typography variant="body1">
            <Link
              component="button"
              underline="hover"
              variant="body1"
              onClick={() => navigate("/myCart")}
            >
              Check your cart
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <img style={{ width: "100%" }} src={emptyCart} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmptyTransaction;

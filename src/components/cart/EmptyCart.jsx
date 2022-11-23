import { Box, Grid, Paper, Typography, Link, Button } from "@mui/material";
import React from "react";
import emptyCart from "../../images/empty_cart.webp";
import { useNavigate } from "react-router-dom";

const EmptyCart = ({ type }) => {
  let navigate = useNavigate();

  return (
    <Paper
      sx={{
        p: 2,
        marginX: "auto",
        mt: "20px",
        maxWidth: "90%",
      }}
      //   elevation={0}
      //   variant="outlined"
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <Grid item xs={4}>
          <Typography gutterBottom variant="h4">
            Your cart is empty
          </Typography>
          {type === "notloggedin" ? (
            <Typography variant="body1">
              Update your cart after{" "}
              <Link
                component="button"
                underline="hover"
                variant="body1"
                onClick={() => navigate("/signin")}
              >
                log in
              </Link>
            </Typography>
          ) : null}
          {type === "loggedin" ? (
            <Typography variant="body1">
              <Link
                component="button"
                underline="hover"
                variant="body1"
                onClick={() => navigate("/")}
              >
                Start shopping
              </Link>
            </Typography>
          ) : null}
        </Grid>
        <Grid item xs={7}>
          <img style={{ width: "100%" }} src={emptyCart} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EmptyCart;

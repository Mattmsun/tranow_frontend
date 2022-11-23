import { Box, Grid, Paper, Typography, Link, Button } from "@mui/material";
import React from "react";
import noProduct from "../../images/product_not_found.jpeg";
import { useNavigate } from "react-router-dom";

const ProductsNotFound = () => {
  let navigate = useNavigate();

  return (
    <Paper
      sx={{
        p: 2,
        marginX: "auto",
        mt: "20px",
        maxWidth: "90%",
      }}
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
            Sorry, we couldn't find the product
          </Typography>
          <Typography variant="body1">
            Try Searching or go to{" "}
            <Link
              component="button"
              underline="hover"
              variant="body1"
              onClick={() => navigate("/home")}
            >
              Tranow's homapage
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={7}>
          <img style={{ width: "100%" }} src={noProduct} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProductsNotFound;

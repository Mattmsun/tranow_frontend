import React from "react";
import { Paper, Grid, Typography } from "@mui/material";
import SingleProduct from "./SingleProduct";
const NewProduct = () => {
  return (
    <Paper
      sx={{
        p: 2,
        marginX: "auto",
        mt: "20px",
        maxWidth: "80%",
        // flexGrow: 1,
      }}
    >
      <Grid item align="center" xs={12}>
        <Typography variant="h3" gutterBottom>
          New Products
        </Typography>
      </Grid>
      <SingleProduct />
    </Paper>
  );
};

export default NewProduct;

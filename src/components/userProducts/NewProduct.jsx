import { useEffect } from "react";
import { Paper, Grid, Typography } from "@mui/material";
import SingleProduct from "./SingleProduct";

const NewProduct = () => {
  const emptyProduct = {
    name: "",
    desc: "",
    price: "",
    quantity: "",
    category: "",
    product_photo: "",
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Paper
      sx={{
        p: 2,
        marginX: "auto",
        mt: "20px",
        maxWidth: "90%",
        // flexGrow: 1,
      }}
    >
      <Grid item align="center" xs={12}>
        <Typography variant="h3" gutterBottom>
          New Products
        </Typography>
      </Grid>
      <SingleProduct product={emptyProduct} type="add" />
    </Paper>
  );
};

export default NewProduct;

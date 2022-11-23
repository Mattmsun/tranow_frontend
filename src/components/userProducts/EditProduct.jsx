import { useEffect } from "react";
import { Paper, Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import SingleProduct from "./SingleProduct";
import { useDispatch, useSelector } from "react-redux";
import { getUserProductById, loadUserProducts } from "../../store/user";
const EditProduct = () => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const product = useSelector(getUserProductById(+id));

  useEffect(() => {
    dispatch(loadUserProducts());
  }, [dispatch]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  //   console.log(product);
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
          Edit Product
        </Typography>
      </Grid>
      <SingleProduct product={product} type="edit" />
    </Paper>
  );
};

export default EditProduct;

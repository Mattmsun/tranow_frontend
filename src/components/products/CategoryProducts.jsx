// import "../../styles/products.css";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductsByCategoryId,
  getLoadingStatus,
} from "../../store/products";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { ProductList } from "./index";
import { Typography, Box, Grid, Paper, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import category_1 from "../../images/category/1.jpeg";
import category_2 from "../../images/category/2.jpeg";
import category_3 from "../../images/category/3.jpeg";
import category_4 from "../../images/category/4.jpeg";
import category_5 from "../../images/category/5.jpeg";
import category_6 from "../../images/category/6.jpeg";
import category_7 from "../../images/category/7.jpeg";
import category_8 from "../../images/category/8.jpeg";
import category_9 from "../../images/category/9.jpeg";
import category_10 from "../../images/category/10.jpeg";
import category_11 from "../../images/category/11.jpeg";
import category_12 from "../../images/category/12.jpeg";
import noCategory from "../../images/no-category-product.png";
import ShowCaseProducts from "./ShowCaseProducts";

const NoProducts = () => {
  let navigate = useNavigate();

  return (
    <Paper
      sx={{
        p: 2,
        marginX: "auto",
        mt: "20px",
        maxWidth: "90%",
        marginTop: "-50vh",
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
          <img style={{ maxHeight: "40vh" }} src={noCategory} />
        </Grid>
        <Grid item xs={4}>
          <Typography gutterBottom variant="h4">
            Sorry, currently no one sell such products
          </Typography>
          <Typography variant="body1">
            <Link
              component="button"
              underline="hover"
              variant="body1"
              onClick={() => navigate("/home")}
            >
              Continue shopping
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
const categoryImages = [
  category_1,
  category_2,
  category_3,
  category_4,
  category_5,
  category_6,
  category_7,
  category_8,
  category_9,
  category_10,
  category_11,
  category_12,
];
const Loading = () => {
  return (
    <Box sx={{ marginTop: "-50vh" }}>
      <h1>Loading ...</h1>
    </Box>
  );
};
const CategoryProducts = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const categoryTop = {
    topNumber: 3,
    categoryId: Number(id),
  };

  const loadingStatus = useSelector(getLoadingStatus());
  const products = useSelector(getProductsByCategoryId(Number(id)));
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  return (
    <>
      <Box sx={{ position: "relative", overflow: "hidden", height: "80vh" }}>
        <img className="bgImage" src={categoryImages[Number(id) - 1]} />
      </Box>
      {!loadingStatus ? (
        _.isEmpty(products) ? (
          <NoProducts />
        ) : (
          <Paper
            sx={{
              p: 2,
              marginX: "auto",
              mt: "20px",
              maxWidth: "90%",
              marginTop: "-50vh",
            }}
            elevation={2}
          >
            <Typography variant="h3" gutterBottom align="center">
              {products[0].category}
            </Typography>
            <ProductList products={products} pageSize={4} />
          </Paper>
        )
      ) : (
        <Loading />
      )}

      <ShowCaseProducts categoryTop={categoryTop} />
    </>
  );
};

export default CategoryProducts;

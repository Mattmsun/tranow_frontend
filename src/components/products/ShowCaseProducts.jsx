import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductsBySeller,
  getProductsByCategory,
  loadTopProducts,
  getTopProducts,
  getLoadingStatus,
  loadTopCategoryProducts,
  getTopCategoryProducts,
  loadTopSellerProducts,
  getTopSellerProducts,
} from "../../store/products";
import {
  CardActionArea,
  Grid,
  Typography,
  Box,
  CardMedia,
  CardContent,
  Card,
  ButtonBase,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import _ from "lodash";

const Loading = () => {
  return <h1>Loading...</h1>;
};

const ShowGeneralProducts = ({ products, option }) => {
  let navigate = useNavigate();

  const pageSize = 4;
  const [pagination, setPagination] = useState({
    totalPage: 0,
    currentPage: 1,
    from: 0,
    to: pageSize,
  });
  const [showedProducts, setShowedProducts] = useState([]);

  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const getProductPicture = (product) =>
    serverUrl + "/" + JSON.parse(product.product_photo)[0];

  useEffect(() => {
    function setPage() {
      if (!_.isEmpty(products)) {
        const pages = Math.ceil(products.length / pageSize);
        setPagination({
          ...pagination,
          totalPage: pages,
        });
        const showedProducts = products.slice(pagination.from, pagination.to);
        setShowedProducts(showedProducts);
      }
    }
    setPage();
  }, [pagination.from, pagination.to, products]);

  const handleIncreasePage = () => {
    const current =
      pagination.currentPage === pagination.totalPage
        ? 1
        : pagination.currentPage + 1;
    const from = (current - 1) * pageSize;
    const to = (current - 1) * pageSize + pageSize;
    setPagination({ ...pagination, from, to, currentPage: current });
  };
  const handleDecreasePage = () => {
    const current =
      pagination.currentPage === 1
        ? pagination.totalPage
        : pagination.currentPage - 1;
    const from = (current - 1) * pageSize;
    const to = (current - 1) * pageSize + pageSize;
    setPagination({ ...pagination, from, to, currentPage: current });
  };

  {
    return _.isEmpty(showedProducts) ? null : (
      <Box sx={{ marginY: "40px", p: "20px" }}>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={8}>
            <Typography gutterBottom variant="h6">
              {option}
            </Typography>
          </Grid>
          <Grid item xs={4} align="end">
            <Typography gutterBottom variant="body1">
              Page {pagination.currentPage} of {pagination.totalPage}
            </Typography>
          </Grid>
          <Grid xs={0.5} item>
            <Button
              sx={{ height: 300, width: "100%" }}
              onClick={handleDecreasePage}
              variant="action"
            >
              <ArrowBackIosIcon fontSize="large" />
            </Button>
          </Grid>
          <Grid
            item
            container
            xs={10}
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            spacing={1}
          >
            {showedProducts.map((product) => (
              <Grid item xs={3} key={product.product_id}>
                <Card sx={{ maxWidth: "100%" }}>
                  <CardActionArea
                    onClick={() => {
                      navigate(`/product/${product.product_id}`);
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={
                        product.product_photo && getProductPicture(product)
                      }
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="body1">
                        {product.name}
                      </Typography>
                      <Typography gutterBottom variant="body2" color="primary">
                        explore more
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Grid xs={0.5} item>
            <Button
              sx={{ height: 300, width: "100%" }}
              onClick={handleIncreasePage}
              variant="action"
            >
              <ArrowForwardIosIcon fontSize="large" />
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }
};

const ShowCategoryProducts = ({ category }) => {
  const products = useSelector(getProductsByCategory(category));
  const loadingStatus = useSelector(getLoadingStatus());

  return !loadingStatus ? (
    <ShowGeneralProducts products={products} option={category} />
  ) : (
    <Loading />
  );
};

const ShowSellerProducts = ({ userId }) => {
  const products = useSelector(getProductsBySeller(userId));
  const loadingStatus = useSelector(getLoadingStatus());

  //   console.log(products);
  return !loadingStatus ? (
    <ShowGeneralProducts products={products} option={"The seller also sell:"} />
  ) : (
    <Loading />
  );
};
const ShowTopProducts = ({ topNumber }) => {
  const products = useSelector(getTopProducts());
  const loadingStatus = useSelector(getLoadingStatus());
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadTopProducts(topNumber));
  }, [dispatch]);
  return !loadingStatus ? (
    <ShowGeneralProducts
      products={products}
      option={`Top ${topNumber} products:`}
    />
  ) : (
    <Loading />
  );
};

const ShowCategoryTopProducts = ({ categoryTop }) => {
  const { topNumber, categoryId } = categoryTop;
  const products = useSelector(getTopCategoryProducts(Number(categoryId)));
  const loadingStatus = useSelector(getLoadingStatus());
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadTopCategoryProducts(topNumber, categoryId));
  }, [dispatch, topNumber, categoryId]);
  return !loadingStatus ? (
    <ShowGeneralProducts
      products={products}
      option={`Top ${topNumber} products in this category:`}
    />
  ) : (
    <Loading />
  );
};
const ShowTopSellerProducts = () => {
  const products = useSelector(getTopSellerProducts());
  const loadingStatus = useSelector(getLoadingStatus());
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadTopSellerProducts());
  }, [dispatch]);
  return !loadingStatus ? (
    <ShowGeneralProducts
      products={products}
      option={`Products from the most popular seller`}
    />
  ) : (
    <Loading />
  );
};
const ShowCaseProducts = ({
  category,
  userId,
  topNumber,
  categoryTop,
  topSeller,
}) => {
  if (category) return <ShowCategoryProducts category={category} />;
  else if (userId) return <ShowSellerProducts userId={userId} />;
  else if (topNumber) return <ShowTopProducts topNumber={topNumber} />;
  else if (!_.isEmpty(categoryTop))
    return <ShowCategoryTopProducts categoryTop={categoryTop} />;
  else if (topSeller) return <ShowTopSellerProducts />;
};

export default ShowCaseProducts;

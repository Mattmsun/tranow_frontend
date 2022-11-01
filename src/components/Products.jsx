import "../styles/products.css";
import { useState, useEffect, useContext } from "react";
import {
  CardActionArea,
  Grid,
  Typography,
  Box,
  CardMedia,
  CardContent,
  Card,
  ButtonBase,
} from "@mui/material";
// import { getProducts } from "../api/product";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { WindowSizeContext } from "../App";
import bgImgae from "../images/home_bg.jpeg";
import game from "../images/games.jpeg";
import food from "../images/food.jpeg";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useDispatch, useSelector } from "react-redux";
import { loadProducts, getProducts } from "../store/products";

export default function Products() {
  let navigate = useNavigate();
  // const [products, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const { windowWidth } = useContext(WindowSizeContext);

  const dispatch = useDispatch();
  const products = useSelector(getProducts);
  useEffect(() => {
    // console.log("render products");
    // dispatch(loadProducts());
    // setLoading(false);
  }, []);

  // serch images
  const [index, setIndex] = useState(0);
  const images = [game, food, bgImgae];
  const decreaseIndex = () => {
    if (index === 0) setIndex(images.length - 1);
    else setIndex(index - 1);
  };
  const increaseIndex = () => {
    if (index === images.length - 1) setIndex(0);
    else setIndex(index + 1);
  };

  // useEffect(() => {
  //   async function getAllProducts() {
  //     setLoading(true);
  //     const result = await getProducts();
  //     setProduct(result.data);
  //     setLoading(false);
  //   }
  //   getAllProducts();
  // }, []);

  // console.log(products);
  // console.log(windowWidth);
  const getProductPicture = (product) =>
    serverUrl + "/" + JSON.parse(product.product_photo)[0];

  const Loading = () => (
    <Box sx={{ width: 300 }}>
      <Skeleton />
      <Skeleton animation="wave" />
      <Skeleton animation={false} />
    </Box>
  );

  const ShowProducts = () => (
    <Box>
      {/* slelct Images */}
      <Box sx={{ height: 300 }}>
        <img className="bgImage" src={images[index]} />
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid xs={0.5} item>
            <ButtonBase
              sx={{ height: 300, width: "100%" }}
              onClick={decreaseIndex}
            >
              <ArrowBackIosIcon fontSize="large" />
            </ButtonBase>
          </Grid>
          <Grid xs={11} item>
            <ButtonBase
              sx={{
                height: 300,
                width: "100%",
                // position: "absolute"
              }}
            >
              <Typography>Select Your Element</Typography>
            </ButtonBase>
          </Grid>
          <Grid xs={0.5} item>
            <ButtonBase
              sx={{ height: 300, width: "100%" }}
              onClick={increaseIndex}
            >
              <ArrowForwardIosIcon fontSize="large" />
            </ButtonBase>
          </Grid>
        </Grid>
      </Box>

      {/* products */}
      <Box>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          rowSpacing={3}
        >
          {products &&
            products.map((product) => (
              <Grid
                item
                xs={12}
                sm={5.5}
                md={5.5}
                lg={3.5}
                xl={2.9}
                key={product.product_id}
              >
                <Card className={windowWidth > 1200 ? "cardL" : "cardS"}>
                  <CardActionArea
                    className={
                      windowWidth > 1200
                        ? "cardActionConatinerL"
                        : "cardActionConatinerS"
                    }
                    onClick={() => {
                      navigate(`/product/${product.product_id}`);
                    }}
                  >
                    <CardMedia
                      component="img"
                      className={
                        windowWidth > 1200 ? "cardImageL" : "cardImageS"
                      }
                      image={
                        product.product_photo && getProductPicture(product)
                      }
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.desc}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
  return <Box>{products.length === 0 ? <Loading /> : <ShowProducts />}</Box>;
}

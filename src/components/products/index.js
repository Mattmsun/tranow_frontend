import "../../styles/products.css";
import { useState, useEffect, useContext, useRef, useMemo } from "react";
import {
  CardActionArea,
  Grid,
  Typography,
  Box,
  CardMedia,
  CardContent,
  Card,
  ButtonBase,
  Divider,
  Zoom,
  Slide,
} from "@mui/material";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { WindowSizeContext } from "../../App";
import entertainment from "../../images/games.jpeg";
import food from "../../images/food.jpeg";
import shoes from "../../images/shoes.webp";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, getCategory } from "../../store/products";
import ShowCaseProducts from "./ShowCaseProducts";
import AppPagination from "../pagination/index";

export const ProductList = ({ products, noGap, pageSize }) => {
  let navigate = useNavigate();
  const [showedProducts, setShowedProducts] = useState([]);
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const { windowWidth } = useContext(WindowSizeContext);
  //   const products = useSelector(getProducts);

  const getProductPicture = (product) =>
    serverUrl + "/" + JSON.parse(product.product_photo)[0];
  return (
    <Box sx={noGap ? { marginTop: "-50vh" } : null}>
      <Box>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={3}
        >
          {showedProducts.length !== 0
            ? showedProducts.map((product) => (
                <Grid item xs={3} key={product.product_id}>
                  <Card sx={{ height: "50vh" }}>
                    <CardActionArea
                      onClick={() => {
                        navigate(`/product/${product.product_id}`);
                      }}
                    >
                      <CardMedia
                        sx={{ maxHeight: "40vh" }}
                        component="img"
                        image={
                          product.product_photo && getProductPicture(product)
                        }
                        alt={product.name}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5">
                          {product.name}
                        </Typography>

                        <Typography
                          noWrap
                          gutterBottom
                          variant="body2"
                          color="text.secondary"
                        >
                          {product.desc}
                        </Typography>
                        <Typography variant="body2" color="primary">
                          learn more
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
            : null}

          <Grid item xs={12}>
            <AppPagination
              items={products}
              setShowedItems={(items) => setShowedProducts(items)}
              pageSize={pageSize}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
    // <Box
    //   sx={noGap ? { marginTop: "-50vh" } : null}
    //   // sx={{marginTop""}}
    // >
    //   {/* products */}
    //   <Box>
    //     <Grid
    //       container
    //       direction="row"
    //       justifyContent="flex-start"
    //       alignItems="flex-start"
    //       spacing={3}
    //     >
    //       {showedProducts.map((product) => (
    //         <Grid
    //           item
    //           xs={12}
    //           sm={5.5}
    //           md={5.5}
    //           lg={3.5}
    //           xl={2.9}
    //           key={product.product_id}
    //         >
    //           <Card className={windowWidth > 1200 ? "cardL" : "cardS"}>
    //             <CardActionArea
    //               className={
    //                 windowWidth > 1200
    //                   ? "cardActionConatinerL"
    //                   : "cardActionConatinerS"
    //               }
    //               onClick={() => {
    //                 navigate(`/product/${product.product_id}`);
    //               }}
    //             >
    //               <CardMedia
    //                 component="img"
    //                 className={windowWidth > 1200 ? "cardImageL" : "cardImageS"}
    //                 image={product.product_photo && getProductPicture(product)}
    //                 alt={product.name}
    //               />
    //               <CardContent>
    //                 <Typography gutterBottom variant="h5">
    //                   {product.name}
    //                 </Typography>
    //                 <Typography variant="body2" color="text.secondary">
    //                   {product.desc}
    //                 </Typography>
    //               </CardContent>
    //             </CardActionArea>
    //           </Card>
    //         </Grid>
    //       ))}

    //       <Grid item xs={12}>
    //         <AppPagination
    //           items={products}
    //           setShowedItems={(items) => setShowedProducts(items)}
    //           pageSize={pageSize}
    //         />
    //       </Grid>
    //     </Grid>
    //   </Box>
    // </Box>
  );
};
const Loading = () => (
  <Box sx={{ width: 300 }}>
    <Skeleton />
    <Skeleton animation="wave" />
    <Skeleton animation={false} />
  </Box>
);
export default function Products() {
  let navigate = useNavigate();
  const products = useSelector(getProducts);
  const category = useSelector(getCategory);

  const { windowWidth } = useContext(WindowSizeContext);

  // serch images
  const [index, setIndex] = useState(0);
  const [checked, setChecked] = useState(true);
  const [direction, setDirection] = useState("");
  const images = [entertainment, food, shoes];
  const imagesName = ["entertainment", "food", "shoes"];
  const [imageCategoryId, setImageCategoryId] = useState([]);

  const imageDescription = [
    "Expore the current popular games",
    "Find your favorate foods",
    "Seek the most fashion shoes",
  ];

  const handleGoCategory = () => {
    navigate(`/category/${imageCategoryId[index]}`);
  };
  const getRandomCategory = (max, min = 0) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const handleIncrease = () => {
    setDirection("right");
    increaseIndex();
  };
  const handleDecrease = () => {
    setDirection("left");
    decreaseIndex();
  };
  const decreaseIndex = () => {
    if (index === 0) setIndex(images.length - 1);
    else setIndex(index - 1);
  };
  const increaseIndex = () => {
    if (index === images.length - 1) setIndex(0);
    else setIndex(index + 1);
  };
  const memoCategory = useMemo(() => {
    if (!_.isEmpty(category)) {
      const max = category.length - 1;
      return category[getRandomCategory(max)];
    }
  }, [category]);

  //set the category id based on the picture
  useEffect(() => {
    const transferImagesToId = (images, category) => {
      const categoryId = [];
      images.filter((i) =>
        category.find((c) => {
          if (c.name.toLowerCase().includes(i.toLowerCase())) {
            categoryId.push(c.id);
          }
        })
      );
      return categoryId;
    };
    setImageCategoryId(transferImagesToId(imagesName, category));
  }, [category]);
  useEffect(() => {
    setChecked(true);
    const timeout = setTimeout(() => {
      increaseIndex();
      setChecked(false);
    }, 3000);
    if (direction) clearTimeout(timeout);
    return () => {
      clearTimeout(timeout);
    };
  }, [index]);
  // console.log(memoCategory);
  const ShowOptions = () => (
    <Box sx={{ position: "relative", overflow: "hidden", height: "80vh" }}>
      <Box>
        <Slide
          in={checked}
          direction={direction ? direction : "right"}
          // direction="left"
          mountOnEnter
          unmountOnExit
          timeout={{ enter: 500, exit: 200 }}
        >
          <img className="bgImage" src={images[index]} />
        </Slide>
      </Box>
      <Box>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid xs={0.5} item>
            <ButtonBase
              sx={{ height: "30vh", width: "100%" }}
              onClick={handleDecrease}
            >
              <ArrowBackIosIcon fontSize="large" />
            </ButtonBase>
          </Grid>
          <Grid xs={11} item>
            <ButtonBase
              sx={{
                height: "30vh",
                width: "100%",
                // position: "absolute"
              }}
              disableRipple
              onClick={handleGoCategory}
            >
              <Typography variant="h4">{imageDescription[index]}</Typography>
            </ButtonBase>
          </Grid>
          <Grid xs={0.5} item>
            <ButtonBase
              sx={{ height: "30vh", width: "100%" }}
              onClick={handleIncrease}
            >
              <ArrowForwardIosIcon fontSize="large" />
            </ButtonBase>
          </Grid>
        </Grid>
      </Box>

      {/* <Box sx={{ minHeight: "60vh" }}>
        <ProductList products={products} />
      </Box> */}
    </Box>
  );
  return (
    <Box>
      {products.length === 0 && _.isEmpty(memoCategory) ? (
        <Loading />
      ) : (
        <>
          {/* <h1>{memoCategory ? memoCategory.name : "nothing"}</h1> */}
          <ShowOptions />

          <ProductList products={products} noGap={true} pageSize={4} />

          <ShowCaseProducts topNumber={5} />
          {memoCategory ? (
            <ShowCaseProducts category={memoCategory.name} />
          ) : (
            <h1>loading ...</h1>
          )}
          {/* <ShowCaseProducts category={memoCategory.name} /> */}

          <ShowCaseProducts topSeller={true} />
        </>
      )}
    </Box>
  );
}

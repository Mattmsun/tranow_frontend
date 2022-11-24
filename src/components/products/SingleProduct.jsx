import _ from "lodash";
import "../../styles/product.css";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../api/product";
import ReactImageMagnify from "react-image-magnify";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Grid,
  Typography,
  Divider,
  Button,
  ButtonBase,
  Paper,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../../store/cart";
import { WindowSizeContext } from "../../App";
import ShowCaseProducts from "./ShowCaseProducts";

const SingleProduct = () => {
  let navigate = useNavigate();

  const { id } = useParams();

  const [showedImage, setShowedImage] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const getProductPicture = (imageUrl) => serverUrl + "/" + imageUrl;
  const dispatch = useDispatch();
  const addProduct = (product) => {
    const itemToAdd = _.pick(product, ["product_id", "quantity"]);
    // dispatch(itemAdded(product));
    // console.log(itemToAdd);
    dispatch(addItem(itemToAdd));
  };
  const { windowWidth } = useContext(WindowSizeContext);
  // const items = useSelector(getCartItems);
  // console.log(items);
  //choose the product picture
  const handleHover = (image, index) => {
    setShowedImage(getProductPicture(image));
  };
  const handleClick = (image, index) => {
    setShowedImage(getProductPicture(image));
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      const result = await getProductById(id);
      setProduct(result.data[0]);
      setProductImages(JSON.parse(result.data[0].product_photo));
      setShowedImage(
        getProductPicture(JSON.parse(result.data[0].product_photo)[0])
      );
      setLoading(false);
    };
    getProduct();
    window.scrollTo(0, 0);
  }, [id]);

  // console.log(imageToSelect);
  //   console.log(id);
  // console.log(product);
  const Loading = () => (
    <Box>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={2}
      >
        <Grid
          xs={12}
          sm={2}
          md={2}
          lg={1}
          xl={1}
          item
          container
          direction={windowWidth < "600" ? "row" : "column"}
          spacing={1}
        >
          <Grid item xs={2} sm={12} md={12} lg={12} xl={12}>
            <Skeleton
              variant="rectangular"
              className={windowWidth < 400 ? "iconButtonS " : "iconButtonL "}
            />
          </Grid>
          <Grid item xs={2} sm={12} md={12} lg={12} xl={12}>
            <Skeleton
              variant="rectangular"
              className={windowWidth < 400 ? "iconButtonS " : "iconButtonL "}
            />
          </Grid>
          <Grid item xs={2} sm={12} md={12} lg={12} xl={12}>
            <Skeleton
              variant="rectangular"
              className={windowWidth < 400 ? "iconButtonS " : "iconButtonL "}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={10} md={9} lg={5} xl={4} sx={{ height: "auto" }}>
          {windowWidth > 1200 ? (
            <Skeleton
              variant="rectangular"
              className="productImageL"
              sx={{ height: "700px" }}
            />
          ) : (
            <Skeleton
              variant="rectangular"
              className="productImageS"
              sx={{ height: "500px" }}
            />
          )}
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          <Divider />
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="circular" width={40} height={40} />
        </Grid>
      </Grid>
    </Box>
  );

  const ShowProduct = () => (
    <Paper
      sx={{
        p: 2,
        marginX: "auto",
        mt: "20px",
        maxWidth: "90%",
        // flexGrow: 1,
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={2}
      >
        <Grid
          xs={12}
          sm={2}
          md={2}
          lg={1}
          xl={1}
          item
          container
          direction={windowWidth < "600" ? "row" : "column"}
          spacing={1}
        >
          {productImages.map((image, index) => (
            <Grid item xs={2} sm={12} md={12} lg={12} xl={12} key={index}>
              <ButtonBase
                className={windowWidth < 400 ? "iconButtonS" : "iconButtonL"}
                onClick={() => handleClick(image, index)}
                onMouseOver={() => handleHover(image, index)}
              >
                <img
                  className={
                    // index === 0 ? "imageToSelect active" : "imageToSelect"
                    getProductPicture(image) === showedImage
                      ? "imageToSelect active"
                      : "imageToSelect"
                  }
                  src={getProductPicture(image)}
                  alt={product.name}
                />
              </ButtonBase>
            </Grid>
          ))}
        </Grid>
        <Grid item xs={12} sm={10} md={9} lg={6} xl={5} sx={{ height: "auto" }}>
          {windowWidth > 1200 ? (
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "product",
                  isFluidWidth: true,
                  src: showedImage,
                },
                largeImage: {
                  src: showedImage,
                  width: 1500,
                  height: 1500,
                },
                enlargedImageContainerDimensions: {
                  width: "120%",
                  height: "70%",
                },
                imageClassName: "productImageL",
                enlargedImageContainerClassName: "zoomedInImgae",

                // enlargedImagePosition: "over",
              }}
            />
          ) : (
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "product",
                  isFluidWidth: true,
                  src: showedImage,
                },
                largeImage: {
                  src: showedImage,
                  width: 1200,
                  height: 1200,
                },
                enlargedImageContainerDimensions: {
                  width: "130%",
                  height: "130%",
                },
                imageClassName: "productImageS",
                // enlargedImageContainerClassName: "zoomedInImgae",

                enlargedImagePosition: "over",
              }}
            />
          )}

          {/* <img
          className={
            windowWidth < 600 ? "productImageS" : "productImageL"
          }
          src={
            //  showedImage ? showedImage : getProductPicture(productImages[0])
            showedImage
          }
          alt={product.name}
        /> */}
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={4}
          xl={5}
          container
          direction="column"
          spacing={8}
        >
          <Grid item>
            <Typography variant={windowWidth > 600 ? "h3" : "h4"} gutterBottom>
              {product.name}
            </Typography>
            <Typography
              variant={windowWidth > 600 ? "h6" : "h7"}
              className="productOthers"
              gutterBottom
            >
              {product.category}
            </Typography>
            <Typography
              variant={windowWidth > 600 ? "body1" : "body2"}
              gutterBottom
              color="customerColor.darkred_2"
            >
              Seller {product.seller}
            </Typography>
            <Divider />
            <Typography
              variant={windowWidth > 600 ? "h4" : "h5"}
              className="productOthers"
              gutterBottom
            >
              Price: ${product.price}
            </Typography>
            <Typography
              variant={windowWidth > 600 ? "body1" : "body2"}
              gutterBottom
              className="productOthers"
            >
              {product.desc}
            </Typography>
            <Typography
              variant={windowWidth > 600 ? "body1" : "body2"}
              gutterBottom
              color="secondary"
            >
              {product.quantity} in stock
            </Typography>
          </Grid>
          <Grid
            item
            container
            direction="row"
            justifyContent="flex-start"
            spacing={1}
          >
            <Grid item>
              <Button
                variant="contained"
                onClick={() => addProduct({ ...product, quantity: 1 })}
              >
                Add to cart
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={() => navigate(`/myCart`)}>
                Go to cart
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
    // <Box
    //   sx={{
    //     p: 2,
    //     marginX: "auto",
    //     mt: "20px",
    //     maxWidth: "90%",
    //     // flexGrow: 1,
    //   }}
    // >
    //   <Grid
    //     container
    //     direction="row"
    //     justifyContent="flex-start"
    //     alignItems="flex-start"
    //     spacing={2}
    //   >
    //     <Grid
    //       xs={12}
    //       sm={2}
    //       md={2}
    //       lg={1}
    //       xl={1}
    //       item
    //       container
    //       direction={windowWidth < "600" ? "row" : "column"}
    //       spacing={1}
    //     >
    //       {productImages.map((image, index) => (
    //         <Grid item xs={2} sm={12} md={12} lg={12} xl={12} key={index}>
    //           <ButtonBase
    //             className={windowWidth < 400 ? "iconButtonS" : "iconButtonL"}
    //             onClick={() => handleClick(image, index)}
    //             onMouseOver={() => handleHover(image, index)}
    //           >
    //             <img
    //               className={
    //                 // index === 0 ? "imageToSelect active" : "imageToSelect"
    //                 getProductPicture(image) === showedImage
    //                   ? "imageToSelect active"
    //                   : "imageToSelect"
    //               }
    //               src={getProductPicture(image)}
    //               alt={product.name}
    //             />
    //           </ButtonBase>
    //         </Grid>
    //       ))}
    //     </Grid>
    //     <Grid item xs={12} sm={10} md={9} lg={5} xl={4} sx={{ height: "auto" }}>
    //       {windowWidth > 1200 ? (
    //         <ReactImageMagnify
    //           {...{
    //             smallImage: {
    //               alt: "product",
    //               isFluidWidth: true,
    //               src: showedImage,
    //             },
    //             largeImage: {
    //               src: showedImage,
    //               width: 1500,
    //               height: 1500,
    //             },
    //             enlargedImageContainerDimensions: {
    //               width: "120%",
    //               height: "70%",
    //             },
    //             imageClassName: "productImageL",
    //             enlargedImageContainerClassName: "zoomedInImgae",

    //             // enlargedImagePosition: "over",
    //           }}
    //         />
    //       ) : (
    //         <ReactImageMagnify
    //           {...{
    //             smallImage: {
    //               alt: "product",
    //               isFluidWidth: true,
    //               src: showedImage,
    //             },
    //             largeImage: {
    //               src: showedImage,
    //               width: 1200,
    //               height: 1200,
    //             },
    //             enlargedImageContainerDimensions: {
    //               width: "130%",
    //               height: "130%",
    //             },
    //             imageClassName: "productImageS",
    //             // enlargedImageContainerClassName: "zoomedInImgae",

    //             enlargedImagePosition: "over",
    //           }}
    //         />
    //       )}

    //       {/* <img
    //         className={
    //           windowWidth < 600 ? "productImageS" : "productImageL"
    //         }
    //         src={
    //           //  showedImage ? showedImage : getProductPicture(productImages[0])
    //           showedImage
    //         }
    //         alt={product.name}
    //       /> */}
    //     </Grid>

    //     <Grid
    //       item
    //       xs={12}
    //       sm={12}
    //       md={12}
    //       lg={4}
    //       xl={4}
    //       container
    //       direction="column"
    //       spacing={10}
    //     >
    //       <Grid item>
    //         <Typography variant={windowWidth > 600 ? "h3" : "h4"} gutterBottom>
    //           {product.name}
    //         </Typography>
    //         <Typography
    //           variant={windowWidth > 600 ? "h6" : "h7"}
    //           className="productOthers"
    //           gutterBottom
    //         >
    //           {product.category}
    //         </Typography>
    //         <Typography
    //           variant={windowWidth > 600 ? "body1" : "body2"}
    //           gutterBottom
    //           color="customerColor.darkred_2"
    //         >
    //           Find more products about {product.seller}
    //         </Typography>
    //         <Divider />
    //         <Typography
    //           variant={windowWidth > 600 ? "h4" : "h5"}
    //           className="productOthers"
    //           gutterBottom
    //         >
    //           Price: ${product.price}
    //         </Typography>
    //         <Typography
    //           variant={windowWidth > 600 ? "body1" : "body2"}
    //           gutterBottom
    //           className="productOthers"
    //         >
    //           {product.desc}
    //         </Typography>
    //         <Typography
    //           variant={windowWidth > 600 ? "body1" : "body2"}
    //           gutterBottom
    //         >
    //           {product.quantity} in stock
    //         </Typography>
    //       </Grid>
    //       <Grid
    //         item
    //         container
    //         direction="row"
    //         justifyContent="flex-start"
    //         spacing={1}
    //       >
    //         <Grid item>
    //           <Button
    //             variant="contained"
    //             onClick={() => addProduct({ ...product, quantity: 1 })}
    //           >
    //             Add to cart
    //           </Button>
    //         </Grid>
    //         <Grid item>
    //           <Button variant="outlined" onClick={() => navigate(`/myCart`)}>
    //             Go to cart
    //           </Button>
    //         </Grid>
    //       </Grid>
    //     </Grid>
    //   </Grid>
    // </Box>
  );
  return (
    <Box>
      {loading ? (
        <Loading />
      ) : (
        <>
          <ShowProduct />
          <ShowCaseProducts category={product.category} />

          <ShowCaseProducts userId={product.user_id} />
        </>
      )}
    </Box>
  );
};

export default SingleProduct;

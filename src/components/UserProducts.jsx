import "../styles/products.css";
import { useEffect, useState, useContext, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProducts, loadUserProducts } from "../store/user";
import {
  Grid,
  Typography,
  Button,
  Paper,
  CardActionArea,
  CardActions,
  Box,
  CardMedia,
  CardContent,
  Card,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import _ from "lodash";

import { WindowSizeContext } from "../App";
import new_product from "../images/new_product.jpeg";
import { useNavigate } from "react-router-dom";
import { deleteUserProduct } from "../store/user";
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserProducts = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const { windowWidth } = useContext(WindowSizeContext);
  const [openDeletDialog, setOpenDeletDialog] = useState(false);

  const userProduct = useSelector(getUserProducts);
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const getSinglePicture = (product) =>
    serverUrl + "/" + JSON.parse(product.product_photo)[0];

  const handleClickOpenDelete = () => {
    setOpenDeletDialog(true);
  };

  const handleCloseDelete = () => {
    setOpenDeletDialog(false);
  };

  const handleDeleteProduct = (productId) => {
    dispatch(deleteUserProduct(productId));
    setOpenDeletDialog(false);
  };
  useEffect(() => {
    dispatch(loadUserProducts());
    // dispatch(loadCategory());
  }, []);

  //   console.log(userProduct);

  const ShowProducts = () => (
    <>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={3}
      >
        {userProduct &&
          userProduct.map((product, index) => (
            <Grid item key={index}>
              <Card sx={{ maxWidth: 345, border: "1px solid grey" }}>
                <CardMedia
                  component="img"
                  //   height="140"
                  image={product.product_photo && getSinglePicture(product)}
                  alt={product.name}
                />
                <CardContent>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="baseline"
                  >
                    <Grid item>
                      <Typography gutterBottom variant="h5" component="div">
                        {product.name}
                      </Typography>
                    </Grid>
                    <Grid item></Grid>
                    <Typography
                      variant="h6"
                      color={
                        product.quantity === 0 ? "error" : "text.secondary"
                      }
                    >
                      {product.quantity === 0 ? "Out of stock" : "In stock"}
                    </Typography>
                  </Grid>
                </CardContent>
                <CardActions disableSpacing>
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    spacing={1}
                    alignItems="baseline"
                  >
                    <Grid item>
                      <Button
                        size="small"
                        variant="contained"
                        // onClick={handleClickOpenEdit}
                        onClick={() =>
                          navigate(`/myProduct/editProduct/${product.id}`)
                        }
                      >
                        Edit
                      </Button>
                    </Grid>
                    <Grid item></Grid>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={handleClickOpenDelete}
                    >
                      Delete
                    </Button>
                  </Grid>
                </CardActions>
              </Card>
              <Dialog
                open={openDeletDialog}
                onClose={handleCloseDelete}
                aria-labelledby="alert-deleteProduct-title"
                aria-describedby="alert-deleteProduct-description"
              >
                <DialogTitle id="alert-deleteProduct-title">
                  {"Are you sure to delete product? This is irreversible"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-deleteProduct-description">
                    Make sure to double check your selling history. Your
                    cusotomer will not see the product on their shopping cart if
                    the product was deleted
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDelete}>Cancel</Button>
                  <Button
                    onClick={() => handleDeleteProduct(product.id)}
                    autoFocus
                  >
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          ))}
        <Grid item>
          <Card sx={{ maxWidth: 345, border: "1px solid grey" }}>
            <CardActionArea onClick={() => navigate(`/myProduct/newProduct`)}>
              <CardMedia
                component="img"
                image={new_product}
                alt="new_product"
              />
              <CardContent>
                <Typography gutterBottom variant="h5">
                  Sell New Product
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </>
  );

  const Loading = () => <h1>Loading...</h1>;
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
          My Products
        </Typography>
      </Grid>

      {!_.isEmpty(userProduct) ? <ShowProducts /> : <Loading />}
    </Paper>
  );
};

export default UserProducts;

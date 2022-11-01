import "../styles/products.css";
import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProducts, getUserPayment } from "../store/user";
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
} from "@mui/material";
import { WindowSizeContext } from "../App";
import new_product from "../images/new_product.jpeg";
import SingleProduct from "./SingleProduct";
import { useNavigate } from "react-router-dom";

const UserProducts = () => {
  let navigate = useNavigate();

  const { windowWidth } = useContext(WindowSizeContext);
  const [openDeletDialog, setOpenDeletDialog] = useState(false);

  const userProduct = useSelector(getUserProducts);
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const getProductPicture = (product) =>
    serverUrl + "/" + JSON.parse(product.product_photo)[0];

  const handleClickOpen = () => {
    setOpenDeletDialog(true);
  };

  const handleClose = () => {
    setOpenDeletDialog(false);
  };
  console.log(userProduct);
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
          My Products
        </Typography>
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={3}
      >
        {userProduct &&
          userProduct.map((product) => (
            <Grid item key={product.product_id}>
              <Card sx={{ maxWidth: 345, border: "1px solid grey" }}>
                <CardMedia
                  component="img"
                  //   height="140"
                  image={product.product_photo && getProductPicture(product)}
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
                      <Button size="small" variant="contained">
                        Edit
                      </Button>
                    </Grid>
                    <Grid item></Grid>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={handleClickOpen}
                    >
                      Delete
                    </Button>
                  </Grid>
                </CardActions>
              </Card>
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
      <Dialog
        open={openDeletDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure to delete product? This is irreversible"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Make sure to double check your selling history. Your cusotomer will
            not see the product on their shopping cart if the product was
            deleted
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <SingleProduct />
    </Paper>
  );
};

export default UserProducts;

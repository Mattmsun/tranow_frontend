import "../../styles/userProduct.css";
import { useFormik, Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Grid,
  Button,
  TextField,
  Autocomplete,
  Tooltip,
  IconButton,
  Typography,
  Box,
  InputAdornment,
  Divider,
  Switch,
  ButtonBase,
} from "@mui/material";
import { useRef, useState, useEffect } from "react";
import { getCategory, loadCategory } from "../../store/products";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import uploadImg from "../../images/cloud-upload-logo.png";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { addNewProduct, updateUserProduct } from "../../store/user";
import { useNavigate } from "react-router-dom";

const SingleProduct = ({ product = {}, type }) => {
  let navigate = useNavigate();

  const dispatch = useDispatch();
  const category = useSelector(getCategory);
  const [value, setValue] = useState();
  const wrapperRef = useRef(null);
  const [fileList, setFileList] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [showedCategory, setShowedCategory] = useState(null);
  const [OldImages, setOldImages] = useState([]);

  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const getProductPicture = (imageUrl) => serverUrl + "/" + imageUrl;

  const handleChangeAutoComplete = (e, value) => {
    // console.log("------", value);
    formik.setValues({
      ...formik.values,
      category: (value && value.name) || "",
    });
    setShowedCategory(value);
  };

  const handleChangeAutoInput = (e, value) => {
    formik.setValues({ ...formik.values, category: value });
    const index = category.findIndex((c) => c.name === value);
    if (index !== -1) setShowedCategory(category[index]);
  };

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        const images = [...productImages, reader.result];
        setProductImages(images);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
    if (newFile) {
      const updatedList = [...fileList, newFile];
      setFileList(updatedList);
    }
  };
  const fileRemove = (index) => {
    const updatedList = [...fileList];
    updatedList.splice(index, 1);

    const images = [...productImages];
    images.splice(index, 1);
    setFileList(updatedList);
    setProductImages(images);
  };
  useEffect(() => {
    dispatch(loadCategory());
  }, []);
  useEffect(() => {
    if (product && product.product_photo)
      setOldImages(JSON.parse(product.product_photo));
  }, [product]);

  useEffect(() => {
    const index = category.findIndex((c) => c.name === product.category);

    if (index !== -1) setShowedCategory(category[index]);
    // setShowedCategory(category[0] || null);
  }, [category]);
  const formik = useFormik({
    initialValues: {
      name: product.name || "",
      desc: product.desc || "",
      price: product.price || "",
      quantity: product.quantity || "",
      category: product.category || "",
      product_photo: product.product_photo || "",
    },

    enableReinitialize: true,

    validationSchema: Yup.object().shape({
      name: Yup.string().required(),
      desc: Yup.string().required(),
      price: Yup.number().required().positive(),
      quantity: Yup.number().required().positive().integer(),
      category: Yup.string().required(),
      // product_photo: Yup.string().required(),
    }),

    onSubmit: async (values, { resetForm }) => {
      // console.log(values);
      // console.log(fileList);
      const { name, desc, price, quantity } = values;
      const productId = product.id;

      const index = category.findIndex((c) => c.name === values.category);
      const category_id = category[index].id;
      var bodyFormData = new FormData();
      if (fileList.length !== 0)
        fileList.map((file) => bodyFormData.append("images", file));
      // bodyFormData.append("images", fileList);
      bodyFormData.append("name", name);
      bodyFormData.append("desc", desc);
      bodyFormData.append("price", price);
      bodyFormData.append("quantity", quantity);
      bodyFormData.append("category_id", category_id);
      if (type === "add") await dispatch(addNewProduct(bodyFormData));
      else if (type === "edit")
        await dispatch(updateUserProduct(productId, bodyFormData));

      navigate("/myProduct");
    },
    onReset: () => {
      console.log("reset");
    },
  });
  // console.log(product);
  // console.log(showedCategory);
  // console.log(fileList);
  // console.log(formik.values);

  const EditProductImages = () =>
    productImages.length ? (
      <>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6"> Image to Upload</Typography>
        </Grid>
        {productImages.map((image, index) => (
          <Grid key={index} item className="user-upload-image-container" xs={3}>
            {/* <Box className="user-upload-image-container"> */}
            <img className="user-upload-image" src={image} />
            {/* </Box> */}
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={() => fileRemove(index)}
            >
              <HighlightOffIcon />
            </Button>
          </Grid>
        ))}
      </>
    ) : (
      <>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6"> Previous pictures</Typography>
        </Grid>
        {OldImages.map((image, index) => (
          <Grid key={index} item className="user-upload-image-container" xs={3}>
            <img className="user-upload-image" src={getProductPicture(image)} />
          </Grid>
        ))}
      </>
    );
  const NewProductImages = () =>
    productImages.length ? (
      <>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6"> Image to Upload</Typography>
        </Grid>
        {productImages.map((image, index) => (
          <Grid key={index} item className="user-upload-image-container" xs={3}>
            {/* <Box className="user-upload-image-container"> */}
            <img className="user-upload-image" src={image} />
            {/* </Box> */}
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={() => fileRemove(index)}
            >
              <HighlightOffIcon />
            </Button>
          </Grid>
        ))}
      </>
    ) : null;

  {
    return _.isEmpty(product) ? (
      <h1>Loading...</h1>
    ) : (
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <Grid item container>
          <form style={{ width: "100%" }} onSubmit={formik.handleSubmit}>
            <Grid
              container
              item
              xs={12}
              direction="row"
              justifyContent="flex-start"
              alignItems="baseline"
              spacing={2}
            >
              <Grid xs={12} item>
                <TextField
                  label="Name"
                  placeholder="The name of the product"
                  fullWidth
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  disablePortal
                  onChange={handleChangeAutoComplete}
                  onInput={handleChangeAutoInput}
                  id="category-autocomplete"
                  includeInputInList
                  onBlur={formik.handleBlur}
                  value={showedCategory}
                  options={category}
                  getOptionLabel={(option) => option.name}
                  fullWidth
                  isOptionEqualToValue={(option, value) =>
                    value && option.value === value.value
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      name="category"
                      value={formik.values.category}
                      error={Boolean(
                        formik.touched.category && formik.errors.category
                      )}
                      helperText={
                        formik.touched.category && formik.errors.category
                      }
                      // inputProps={{
                      //   ...params.inputProps,
                      //   autoComplete: "new-password", // disable autocomplete and autofill
                      // }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box {...props}>
                      <Tooltip
                        title={
                          <Typography variant="body1">{option.desc}</Typography>
                        }
                      >
                        <IconButton disableRipple>
                          <ErrorOutlineIcon />
                        </IconButton>
                      </Tooltip>
                      {option.name}
                    </Box>
                  )}
                />
              </Grid>

              <Grid xs={12} item>
                <TextField
                  placeholder="The description of the product"
                  label="Description"
                  multiline
                  rows={4}
                  fullWidth
                  id="desc"
                  name="desc"
                  value={formik.values.desc}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.desc && Boolean(formik.errors.desc)}
                  helperText={formik.touched.desc && formik.errors.desc}
                />
              </Grid>

              <Grid xs={6} item>
                <TextField
                  placeholder="How much do you want to sell for each"
                  label="Price"
                  fullWidth
                  id="price"
                  name="price"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />
              </Grid>
              <Grid xs={6} item>
                <TextField
                  placeholder="How many do you want to sell"
                  label="Quantity"
                  fullWidth
                  id="quantity"
                  name="quantity"
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.quantity && Boolean(formik.errors.quantity)
                  }
                  helperText={formik.touched.quantity && formik.errors.quantity}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Box
                  ref={wrapperRef}
                  className="drop-file-input"
                  onDragEnter={onDragEnter}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  <Box className="drop-file-input__label">
                    <img src={uploadImg} alt="" />
                    <Typography variant="body1">
                      Drag & Drop your images here
                    </Typography>
                    <Typography variant="body1" color="error">
                      Maximium 6 pictures
                    </Typography>
                  </Box>
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    value={value}
                    onChange={onFileDrop}
                  />
                </Box>
              </Grid>
              {/* {OldImages.length !== 0 && <ShowOldImages />} */}
              {type === "add" && <NewProductImages />}
              {type === "edit" && <EditProductImages />}

              <Grid
                item
                container
                xs={12}
                direction="row"
                justifyContent="flex-end"
                spacing={2}
              >
                {type === "add" && (
                  <Grid item>
                    <Button
                      color="primary"
                      variant="contained"
                      //   fullWidth
                      type="submit"
                    >
                      Add
                    </Button>
                  </Grid>
                )}
                {type === "edit" && (
                  <Grid item>
                    <Button
                      color="primary"
                      variant="contained"
                      //   fullWidth
                      type="submit"
                    >
                      Save
                    </Button>
                  </Grid>
                )}
                <Grid item>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => navigate("/myProduct")}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    );
  }
};

export default SingleProduct;

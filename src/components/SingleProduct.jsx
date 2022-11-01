import "../styles/userProduct.css";
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
import { getCategory, loadCategory } from "../store/products";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import uploadImg from "../images/cloud-upload-logo.png";
import { useDispatch, useSelector } from "react-redux";

import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const SingleProduct = (product) => {
  const dispatch = useDispatch();
  const category = useSelector(getCategory);

  const wrapperRef = useRef(null);
  const [fileList, setFileList] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [showedCategory, setShowedCategory] = useState(category[0] || null);

  const handleChangeAutoComplete = (e, value) => {
    value && formik.setValues({ ...formik.values, category: value.name });
    setShowedCategory(value);
  };

  const handleChangeAutoInput = (e, value) => {
    formik.setValues({ ...formik.values, category: value });
    const index = category.findIndex((c) => c.name === value);
    setShowedCategory(category[index]);
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
    setShowedCategory(category[0] || null);
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
      product_photo: Yup.string(),
    }),

    onSubmit: async (values, { resetForm }) => {},
    onReset: () => {
      console.log("reset");
    },
  });
  console.log(category);
  console.log(showedCategory);
  // console.log(fileList);
  // console.log(formik.values);

  return category.length !== 0 ? (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={4}
    >
      <Grid item container>
        <form
          style={{ width: "100%" }}
          // onSubmit={formik.handleSubmit}
        >
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
                // onChange={(e, value) =>
                //   value &&
                //   formik.setValues({ ...formik.values, category: value.name })
                // }
                // onInputChange={(e, value) => {
                //   formik.setValues({ ...formik.values, category: value });
                // }}
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
                  // value.name ? option.name === value.name : true
                  option.name === value.name
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
            {/* <Grid
            item
            container
            xs={8}
            direction="row"
            justifyContent="flex-end"
            spacing={2}
          >
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
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                // onClick={deleteAddress}
              >
                Delete
              </Button>
            </Grid>
          </Grid> */}
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
                </Box>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  value=""
                  onChange={onFileDrop}
                />
              </Box>
            </Grid>

            {productImages.length
              ? productImages.map((image, index) => (
                  <Grid
                    key={index}
                    item
                    className="user-upload-image-container"
                  >
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
                ))
              : null}
          </Grid>
        </form>
      </Grid>
    </Grid>
  ) : null;

  // return (

  //   <Grid
  //     container
  //     direction="column"
  //     justifyContent="center"
  //     alignItems="center"
  //     spacing={4}
  //   >
  //     <Grid item container>
  //       <form
  //         style={{ width: "100%" }}
  //         // onSubmit={formik.handleSubmit}
  //       >
  //         <Grid
  //           container
  //           item
  //           xs={12}
  //           direction="row"
  //           justifyContent="flex-start"
  //           alignItems="baseline"
  //           spacing={2}
  //         >
  //           <Grid xs={12} item>
  //             <TextField
  //               label="Name"
  //               placeholder="The name of the product"
  //               fullWidth
  //               id="name"
  //               name="name"
  //               value={formik.values.name}
  //               onChange={formik.handleChange}
  //               onBlur={formik.handleBlur}
  //               error={formik.touched.name && Boolean(formik.errors.name)}
  //               helperText={formik.touched.name && formik.errors.name}
  //             />
  //           </Grid>

  //           <Grid item xs={12}>
  //             <Autocomplete
  //               // value={category && category[0]}
  //               disablePortal
  //               onChange={(e, value) =>
  //                 value &&
  //                 formik.setValues({ ...formik.values, category: value.name })
  //               }
  //               id="category-autocomplete"
  //               includeInputInList
  //               onBlur={formik.handleBlur}
  //               // getOptionSelected={(option, value) =>
  //               //   option.name === value.name
  //               // }
  //               // onBlur={formik.handleBlur}
  //               // error={
  //               //   formik.touched.category && Boolean(formik.errors.category)
  //               // }
  //               // helperText={formik.touched.category && formik.errors.category}
  //               options={category}
  //               getOptionLabel={(option) => option.name}
  //               fullWidth
  //               renderInput={(params) => (
  //                 <TextField
  //                   {...params}
  //                   label="Category"
  //                   name="category"
  //                   value={formik.values.category}
  //                   error={Boolean(
  //                     formik.touched.category && formik.errors.category
  //                   )}
  //                   helperText={
  //                     formik.touched.category && formik.errors.category
  //                   }
  //                 />
  //               )}
  //               renderOption={(props, option) => (
  //                 <Box {...props}>
  //                   <Tooltip
  //                     title={
  //                       <Typography variant="body1">{option.desc}</Typography>
  //                     }
  //                   >
  //                     <IconButton disableRipple>
  //                       <ErrorOutlineIcon />
  //                     </IconButton>
  //                   </Tooltip>
  //                   {option.name}
  //                 </Box>
  //               )}
  //             />
  //           </Grid>

  //           <Grid xs={12} item>
  //             <TextField
  //               placeholder="The description of the product"
  //               label="Description"
  //               multiline
  //               rows={4}
  //               fullWidth
  //               id="desc"
  //               name="desc"
  //               value={formik.values.desc}
  //               onChange={formik.handleChange}
  //               onBlur={formik.handleBlur}
  //               error={formik.touched.desc && Boolean(formik.errors.desc)}
  //               helperText={formik.touched.desc && formik.errors.desc}
  //             />
  //           </Grid>

  //           <Grid xs={6} item>
  //             <TextField
  //               placeholder="How much do you want to sell for each"
  //               label="Price"
  //               fullWidth
  //               id="price"
  //               name="price"
  //               InputProps={{
  //                 startAdornment: (
  //                   <InputAdornment position="start">$</InputAdornment>
  //                 ),
  //               }}
  //               value={formik.values.price}
  //               onChange={formik.handleChange}
  //               onBlur={formik.handleBlur}
  //               error={formik.touched.price && Boolean(formik.errors.price)}
  //               helperText={formik.touched.price && formik.errors.price}
  //             />
  //           </Grid>
  //           <Grid xs={6} item>
  //             <TextField
  //               placeholder="How many do you want to sell"
  //               label="Quantity"
  //               fullWidth
  //               id="quantity"
  //               name="quantity"
  //               value={formik.values.quantity}
  //               onChange={formik.handleChange}
  //               onBlur={formik.handleBlur}
  //               error={
  //                 formik.touched.quantity && Boolean(formik.errors.quantity)
  //               }
  //               helperText={formik.touched.quantity && formik.errors.quantity}
  //             />
  //           </Grid>
  //           <Grid item xs={12}>
  //             <Divider />
  //           </Grid>
  //           {/* <Grid
  //             item
  //             container
  //             xs={8}
  //             direction="row"
  //             justifyContent="flex-end"
  //             spacing={2}
  //           >
  //             <Grid item>
  //               <Button
  //                 color="primary"
  //                 variant="contained"
  //                 //   fullWidth
  //                 type="submit"
  //               >
  //                 Save
  //               </Button>
  //             </Grid>
  //             <Grid item>
  //               <Button
  //                 color="primary"
  //                 variant="contained"
  //                 // onClick={deleteAddress}
  //               >
  //                 Delete
  //               </Button>
  //             </Grid>
  //           </Grid> */}
  //           <Grid item xs={12}>
  //             <Box
  //               ref={wrapperRef}
  //               className="drop-file-input"
  //               onDragEnter={onDragEnter}
  //               onDragLeave={onDragLeave}
  //               onDrop={onDrop}
  //             >
  //               <Box className="drop-file-input__label">
  //                 <img src={uploadImg} alt="" />
  //                 <Typography variant="body1">
  //                   Drag & Drop your images here
  //                 </Typography>
  //               </Box>
  //               <input
  //                 type="file"
  //                 accept="image/*"
  //                 name="image"
  //                 value=""
  //                 onChange={onFileDrop}
  //               />
  //             </Box>
  //           </Grid>

  //           {productImages.length
  //             ? productImages.map((image, index) => (
  //                 <Grid
  //                   key={index}
  //                   item
  //                   className="user-upload-image-container"
  //                 >
  //                   {/* <Box className="user-upload-image-container"> */}
  //                   <img className="user-upload-image" src={image} />
  //                   {/* </Box> */}
  //                   <Button
  //                     variant="contained"
  //                     color="error"
  //                     fullWidth
  //                     onClick={() => fileRemove(index)}
  //                   >
  //                     <HighlightOffIcon />
  //                   </Button>
  //                 </Grid>
  //               ))
  //             : null}
  //         </Grid>
  //       </form>
  //     </Grid>
  //   </Grid>
  // );
};

export default SingleProduct;

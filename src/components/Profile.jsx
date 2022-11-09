import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo, updateUserImage, updateUser } from "../store/user";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Grid,
  Typography,
  ButtonBase,
  Button,
  Paper,
  Box,
  Badge,
  Avatar,
  IconButton,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const Profile = () => {
  const [profileImage, setProfileImage] = useState("");
  const [uploadImage, setUploadImage] = useState(null);
  const user = useSelector(getUserInfo);
  // const selectorData = useSelector(getUserInfo);
  // const [user, setUser] = useState(selectorData);
  const dispatch = useDispatch();

  //   const serverUrl = process.env.REACT_APP_SERVER_URL;
  //   const getProfileImage = (imageUrl) => serverUrl + "/" + imageUrl;

  // useEffect(() => {
  //   setUser(selectorData);

  // }, [selectorData]);

  const imageHandler = (e) => {
    // console.log(e.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProfileImage(reader.result);
        setUploadImage(e.target.files[0]);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const getProfileImage = (imageUrl) => serverUrl + "/" + imageUrl;
    if (user.profile_photo)
      setProfileImage(getProfileImage(user.profile_photo));
    console.log("render");
    // console.log(profileImage);
  }, [user]);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const formik = useFormik({
    initialValues: {
      first_name: user.first_name ? user.first_name : "",
      last_name: user.last_name ? user.last_name : "",
      phone: user.phone ? user.phone : "",
    },
    enableReinitialize: true,

    validationSchema: Yup.object({
      first_name: Yup.string()
        .required("Required")
        .matches(/^[A-Za-z ]*$/, "Not a valid first name")
        .max(40),
      last_name: Yup.string()
        .required("Required")
        .matches(/^[A-Za-z ]*$/, "Not a valid last name")
        .max(40),
      phone: Yup.string()
        .required("Required")
        .matches(phoneRegExp, "Phone number is not valid"),
    }),
    onSubmit: async (values) => {
      const { first_name, last_name, phone } = values;
      var bodyFormData = new FormData();
      bodyFormData.append("image", uploadImage);
      bodyFormData.append("first_name", first_name);
      bodyFormData.append("last_name", last_name);
      bodyFormData.append("phone", phone);

      //   const updateUser = { ...values, uploadImage };
      //   console.log("-------", updateUser);
      await dispatch(updateUser(bodyFormData));
    },
  });

  const Loading = () => <Typography variant="h1">Loading ====</Typography>;

  //   console.log(user);
  //   console.log(uploadImage);
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
      {user.email ? (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={4}
        >
          <Grid item>
            <Typography variant="h3">{user.username}</Typography>
          </Grid>
          <Grid item>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <IconButton
                  component="label"

                  //   sx={{ width: "100px", height: "100px" }}
                >
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    name="image"
                    id="input"
                    onChange={imageHandler}
                  />
                  <EditIcon
                    sx={{ width: "50px", height: "50px" }}
                    color="primary"
                  />
                </IconButton>
              }
            >
              <Avatar
                sx={{ width: "200px", height: "200px" }}
                alt=""
                // src={
                //   user.profile_photo ? getProfileImage(user.profile_photo) : ""
                // }
                // src={user.profile_photo ? profileImage : ""}
                src={profileImage ? profileImage : ""}
              />
            </Badge>
          </Grid>
          <Grid item xs={12}>
            <form onSubmit={formik.handleSubmit}>
              <Grid
                container
                item
                direction="row"
                justifyContent="center"
                spacing={2}
              >
                <Grid xs={4} item>
                  <TextField
                    label="First Name"
                    //   placeholder={user && user.first_name}
                    fullWidth
                    id="first_name"
                    name="first_name"
                    //   defaultValue="Hello World"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.first_name &&
                      Boolean(formik.errors.first_name)
                    }
                    helperText={
                      formik.touched.first_name && formik.errors.first_name
                    }
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Last Name"
                    placeholder="Enter Last Name"
                    fullWidth
                    id="last_name"
                    name="last_name"
                    //   defaultValue={user.last_name}
                    // onChange={handleChange}
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.last_name &&
                      Boolean(formik.errors.last_name)
                    }
                    helperText={
                      formik.touched.last_name && formik.errors.last_name
                    }
                  />
                </Grid>
                <Grid xs={8} item>
                  <TextField
                    label="Email"
                    disabled
                    fullWidth
                    id="email"
                    //   name="email"
                    defaultValue={user && user.email}
                    //   value={user.email}
                    // onChange={handleChange}
                    // value={formik.values.username}
                    // onChange={formik.handleChange}
                    // onBlur={formik.handleBlur}
                    // error={formik.touched.username && Boolean(formik.errors.username)}
                    // helperText={formik.touched.username && formik.errors.username}
                  />
                </Grid>
                <Grid xs={8} item>
                  <TextField
                    label="phone"
                    //   placeholder="Enter First Name"
                    fullWidth
                    id="phone"
                    name="phone"
                    //   defaultValue={user.phone}
                    // onChange={handleChange}
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                  />
                </Grid>
                <Grid align="right" item xs={8}>
                  <Button
                    color="primary"
                    variant="contained"
                    //   fullWidth
                    type="submit"
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      ) : (
        <Loading />
      )}
    </Paper>
  );
};

export default Profile;

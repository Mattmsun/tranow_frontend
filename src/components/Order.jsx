import React from "react";
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
import { Formik, useFormik } from "formik";
import * as Yup from "yup";

const Order = () => {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      console.log("-------", values);
      //   const submitUser = {};
      //   submitUser.password = values.password;
      //   if (isEmail(values.username)) {
      //     submitUser.email = values.username;
      //   } else {
      //     submitUser.username = values.username;
      //   }
      //   const result = await signin(submitUser);
      //   if (result.status !== 200) {
      //     setErrorMessage(result.data.message);
      //     setIsError(true);
      //     console.log(result);
      //   } else {
      //     setIsError(false);
      //     window.localStorage.setItem("token", JSON.stringify(result.data));
      //     // forceUpdate();
      //     navigate("/");
      //   }
    },
  });
  const Fromit = () => (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        label="Email or Username"
        placeholder="Enter email or username"
        fullWidth
        id="username"
        // inputRef={inputRef}
        name="username"
        // value={userInfo.username}
        // onChange={handleChange}
        value={formik.values.username}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.username && Boolean(formik.errors.username)}
        helperText={formik.touched.username && formik.errors.username}
      />
      <TextField
        label="Password"
        placeholder="Enter password"
        fullWidth
        id="password"
        name="password"
        type={"password"}
        // value={userInfo.password}
        // onChange={handleChange}
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
      />

      <Button color="primary" variant="contained" fullWidth type="submit">
        Submit
      </Button>
    </form>
  );

  return (
    <Paper
      sx={{
        p: 2,
        marginX: "auto",
        mb: "20px",
        maxWidth: "80%",
        flexGrow: 1,
        backgroundColor: "customerColor.lightDark",
      }}
    >
      <Fromit />
    </Paper>
  );
};

export default Order;

import { useState, useContext, useRef, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Grid,
  Paper,
  IconButton,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Link,
  Divider,
  Box,
  Fade,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../api/user";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import _ from "lodash";

// import { UserContext } from "../App";
const SignUp = () => {
  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: 600,
    margin: "20px auto",
  };
  //   const { globalState, setGlobalState } = useContext(UserContext);

  let navigate = useNavigate();
  const inputRef = useRef(null);
  const btnstyle = { margin: "8px 0" };
  const gridStyle = { marginBottom: "20px" };
  const textFieldStyle = { marginBottom: "20px" };
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [remindMessage, setRemindMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const emailRegExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;

  //formik function to compare 2 passwords are equal
  function equalTo(ref, msg) {
    return this.test({
      name: "equalTo",
      exclusive: false,
      message: msg || "two passwords must be the same",
      params: {
        reference: ref.path,
      },
      test: function (value) {
        return value === this.resolve(ref);
      },
    });
  }
  Yup.addMethod(Yup.string, "equalTo", equalTo);
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: "",
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      password: "",
      rePassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Required").min(3),
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
      email: Yup.string()
        .required("Required")
        .matches(emailRegExp, "Email is not valid"),
      password: Yup.string()
        .min(5, "Password should be of minimum 5 characters length")
        .required("Required"),
      rePassword: Yup.string().required().equalTo(Yup.ref("password")),
    }),

    onSubmit: async (values) => {
      const data = _.pick(values, [
        "username",
        "password",
        "first_name",
        "last_name",
        "phone",
        "email",
      ]);
      const result = await signup(data);
      console.log(result);
      if (result.status !== 200) {
        setErrorMessage(result.data.message);
        setIsError(true);
        setIsSuccess(false);
      } else {
        setIsError(false);
        setIsSuccess(true);
        setRemindMessage(result.data.message);
      }
    },
  });
  return (
    <Box>
      <Paper elevation={0} style={paperStyle}>
        {/* show error if the user cannot signup */}
        <Fade in={isError} timeout={{ enter: 500, exit: 1000 }} unmountOnExit>
          <Box sx={{ border: 1, borderColor: "error.main" }}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid align="middle" item xs={3}>
                <WarningAmberIcon fontSize="large" color="error" />
              </Grid>
              <Grid item xs={9}>
                <Box>
                  <Typography variant="h5"> There was an problem </Typography>
                  {/* <Typography variant="body1">
                    We cannot find your account
                  </Typography> */}
                  <Typography variant="body1" color="error">
                    {errorMessage}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Fade>
        <Fade in={isSuccess} timeout={{ enter: 500, exit: 1000 }} unmountOnExit>
          <Box sx={{ border: 1, borderColor: "success.main" }}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid align="middle" item xs={3}>
                <SentimentSatisfiedAltIcon fontSize="large" color="success" />
              </Grid>
              <Grid item xs={9}>
                <Box>
                  <Typography variant="h5"> Thank You! </Typography>
                  {/* <Typography variant="body1">
                    We cannot find your account
                  </Typography> */}
                  <Typography variant="body1" color="success.main">
                    {remindMessage}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Fade>
        <Grid align="left" style={gridStyle}>
          <Typography variant="h5">Sign Up</Typography>
        </Grid>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Username"
            placeholder="Enter username"
            fullWidth
            id="username"
            inputRef={inputRef}
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            style={textFieldStyle}
          />
          <TextField
            label="First Name"
            placeholder="Enter your first name"
            fullWidth
            id="first_name"
            name="first_name"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.first_name && Boolean(formik.errors.first_name)
            }
            helperText={formik.touched.first_name && formik.errors.first_name}
            style={textFieldStyle}
          />
          <TextField
            label="Last Name"
            placeholder="Enter your last name"
            fullWidth
            id="last_name"
            name="last_name"
            value={formik.values.last_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.last_name && Boolean(formik.errors.last_name)}
            helperText={formik.touched.last_name && formik.errors.last_name}
            style={textFieldStyle}
          />
          <TextField
            label="Phone Number"
            placeholder="Enter your phone number"
            fullWidth
            id="phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            style={textFieldStyle}
          />
          <TextField
            label="Email"
            placeholder="Enter your email"
            fullWidth
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            style={textFieldStyle}
          />

          <TextField
            label="Password"
            placeholder="Enter password"
            fullWidth
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            style={textFieldStyle}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            placeholder="Confirm your password"
            fullWidth
            id="rePassword"
            name="rePassword"
            type={showRePassword ? "text" : "password"}
            value={formik.values.rePassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.rePassword && Boolean(formik.errors.rePassword)
            }
            helperText={formik.touched.rePassword && formik.errors.rePassword}
            style={textFieldStyle}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowRePassword(!showRePassword)}
                  >
                    {showRePassword ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            style={btnstyle}
            fullWidth
          >
            Sign up
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default SignUp;

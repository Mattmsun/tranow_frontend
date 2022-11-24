import { useState, useRef, useEffect, useCallback } from "react";
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
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getResetEmail, resetPassword } from "../../api/user";
import { useDispatch, useSelector } from "react-redux";

const SendResetEmail = () => {
  const emailRegExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: 600,
    margin: "20px auto",
  };

  let navigate = useNavigate();
  const inputRef = useRef(null);
  const btnstyle = { margin: "8px 0" };
  const gridStyle = { marginBottom: "20px" };
  const textFieldStyle = { marginBottom: "20px" };
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [remindMessage, setRemindMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const delayNavigate = () => {
    setTimeout(() => navigate("/home", { replace: true }), 1500);
  };
  useEffect(() => {
    inputRef.current.focus();
    // console.log("render");
    return () => {
      clearTimeout(delayNavigate);
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Required")
        .matches(emailRegExp, "Please enter a valid email address"),
    }),

    onSubmit: async (values) => {
      const result = await getResetEmail(values);
      if (result.status !== 200) {
        setErrorMessage(result.data.message);
        setIsError(true);
        setIsSuccess(false);
      } else {
        setIsError(false);
        setIsSuccess(true);
        setRemindMessage(result.data.message);
        window.localStorage.setItem("isResetPassword", JSON.stringify(true));
        delayNavigate();
      }
      // console.log(result);
    },
  });
  // console.log(token);
  return (
    <Box>
      <Paper elevation={0} style={paperStyle}>
        {/* show error if the user cannot login */}

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
                  <Typography variant="body1">
                    Please check your email address
                  </Typography>
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
                  <Typography variant="h5">Please check your email </Typography>

                  <Typography variant="body1" color="success.main">
                    {remindMessage}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Fade>
        <Grid align="left" style={gridStyle}>
          <Typography variant="h5">Reset Password</Typography>
        </Grid>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Email"
            placeholder="Enter your email to reset password"
            fullWidth
            id="email"
            inputRef={inputRef}
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            style={textFieldStyle}
          />

          <Button
            type="submit"
            color="primary"
            variant="contained"
            style={btnstyle}
            fullWidth
          >
            Send reset password email
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

const NewPassword = ({ resetCode }) => {
  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: 600,
    margin: "20px auto",
  };

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

  const delayNavigate = () => {
    setTimeout(() => navigate("/signin", { replace: true }), 1500);
  };
  useEffect(() => {
    inputRef.current.focus();
    // console.log("render");
    return () => {
      clearTimeout(delayNavigate);
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      password: "",
      rePassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(5, "Password should be of minimum 5 characters length")
        .required("Required"),
      rePassword: Yup.string().required().equalTo(Yup.ref("password")),
    }),

    onSubmit: async (values, { resetForm }) => {
      const data = { password: values.password, resetCode };
      const result = await resetPassword(data);

      if (result.data.message === "Password was reseted") {
        setIsError(false);
        setIsSuccess(true);
        setRemindMessage(result.data.message);
        window.localStorage.removeItem("isResetPassword");
        resetForm();
        delayNavigate();
      } else {
        setErrorMessage("Please recheck the link in your email");
        setIsError(true);
        setIsSuccess(false);
      }

      //   if (result.status !== 200) {
      //     setErrorMessage(result.data.message);
      //     setIsError(true);
      //     setIsSuccess(false);
      //   } else {
      //     setIsError(false);
      //     setIsSuccess(true);
      //     setRemindMessage(result.data.message);
      //     window.localStorage.removeItem("isResetPassword");
      //     resetForm();
      //     // delayNavigate();
      //   }
    },
  });
  // console.log(token);
  return (
    <Box>
      <Paper elevation={0} style={paperStyle}>
        {/* show error if the user cannot login */}

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
                  <Typography variant="h5">Please check your email </Typography>

                  <Typography variant="body1" color="success.main">
                    {remindMessage}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Fade>
        <Grid align="left" style={gridStyle}>
          <Typography variant="h5">Reset Password</Typography>
        </Grid>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Password"
            placeholder="Enter password"
            fullWidth
            id="password"
            name="password"
            inputRef={inputRef}
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
            Send reset password email
          </Button>
        </form>
      </Paper>
    </Box>
  );
};
const ResetPassword = () => {
  const { resetCode } = useParams();
  return resetCode ? <NewPassword resetCode={resetCode} /> : <SendResetEmail />;
};

export default ResetPassword;

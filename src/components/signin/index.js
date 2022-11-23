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
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { useNavigate } from "react-router-dom";
import { signin } from "../../api/user";
import { useDispatch, useSelector } from "react-redux";

const SignIn = () => {
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

  const [is401Error, setIs401Error] = useState(false);
  const [is403Error, setIs403Error] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const isEmail = (username) => {
    const regexExp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
    return regexExp.test(username);
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string(),
      password: Yup.string(),
    }),

    onSubmit: async (values) => {
      const submitUser = {};
      submitUser.password = values.password;
      if (isEmail(values.username)) {
        submitUser.email = values.username;
      } else {
        submitUser.username = values.username;
      }
      const result = await signin(submitUser);
      // console.log(result);
      if (result.status === 401) {
        setErrorMessage(result.data.message);
        setIs401Error(true);
        setIs403Error(false);
      } else if (result.status === 403) {
        setErrorMessage(result.data.message);
        setIs403Error(true);
        setIs401Error(false);
      } else {
        setIs401Error(false);
        setIs403Error(false);
        window.localStorage.setItem("token", JSON.stringify(result.data));
        // forceUpdate();
        navigate("/");
      }
    },
  });
  // console.log(token);
  return (
    <Box>
      <Paper elevation={0} style={paperStyle}>
        {/* show error if the user cannot login */}

        <Fade
          in={is401Error}
          timeout={{ enter: 500, exit: 1000 }}
          unmountOnExit
        >
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
                    We cannot find your account
                  </Typography>
                  <Typography variant="body1" color="error">
                    {errorMessage}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Fade>
        <Fade
          in={is403Error}
          timeout={{ enter: 500, exit: 1000 }}
          unmountOnExit
        >
          <Box sx={{ border: 1, borderColor: "info.main" }}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid align="middle" item xs={3}>
                <WarningAmberIcon fontSize="large" color="info" />
              </Grid>
              <Grid item xs={9}>
                <Box>
                  <Typography variant="h5"> There was an problem </Typography>
                  <Typography variant="body1">
                    You have been registered
                  </Typography>
                  <Typography variant="body1" color="info.main">
                    {errorMessage}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Fade>

        <Grid align="left" style={gridStyle}>
          <Typography variant="h5">Sign In</Typography>
        </Grid>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Email or Username"
            placeholder="Enter email or username"
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

          <Button
            type="submit"
            color="primary"
            variant="contained"
            style={btnstyle}
            fullWidth
          >
            Sign in
          </Button>
        </form>
        <Typography gutterBottom>
          <Link
            component="button"
            underline="hover"
            variant="body1"
            onClick={() => navigate("/resetPassword")}
          >
            Forgot password ?
          </Link>
        </Typography>

        <Divider>
          <Typography color="text.secondary">New user?</Typography>
        </Divider>
        <Button
          type="submit"
          color="action"
          variant="contained"
          style={btnstyle}
          fullWidth
          onClick={() => navigate("/signup")}
        >
          Create your account
        </Button>
      </Paper>
    </Box>
  );
};

export default SignIn;

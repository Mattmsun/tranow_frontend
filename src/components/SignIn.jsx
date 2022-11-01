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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { useNavigate } from "react-router-dom";
import { signin } from "../api/user";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, getToken } from "../store/user";

// import { UserContext } from "../App";
const SignIn = () => {
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
  const [openProcess, setOpenProcess] = useState(false);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  //login user and save token to store
  // const authUser = (user) => {
  //   dispatch(loginUser(user));
  // };
  //   const [, updateState] = useState();
  //   const forceUpdate = useCallback(() => updateState({}), []);
  const handleToggle = () => {
    setOpenProcess(!openProcess);
  };
  const handleCloseProcess = () => {
    setOpenProcess(false);
  };
  async function setProcess() {
    handleCloseProcess();
  }
  const isEmail = (username) => {
    const regexExp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
    return regexExp.test(username);
  };

  //   const handleChange = (e) => {
  //     setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  //   };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
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
      if (result.status !== 200) {
        setErrorMessage(result.data.message);
        setIsError(true);
        console.log(result);
      } else {
        setIsError(false);
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
        {isError ? (
          <Box sx={{ border: 1, borderColor: "red" }}>
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
        ) : null}

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
            // value={userInfo.username}
            // onChange={handleChange}
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
            // value={userInfo.password}
            // onChange={handleChange}
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
          <Link href="#" underline="hover">
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
        >
          Create your account
        </Button>
      </Paper>
    </Box>
  );
};

export default SignIn;

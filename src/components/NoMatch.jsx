import { Box, Grid, Paper, Typography, Link, Button } from "@mui/material";
import React from "react";
import emptyCart from "../images/page-not-found.jpeg";
import { useNavigate } from "react-router-dom";

const NoMatch = () => {
  let navigate = useNavigate();

  return (
    <Paper
      sx={{
        p: 2,
        marginX: "auto",
        mt: "20px",
        maxWidth: "90%",
      }}
      //   elevation={0}
      //   variant="outlined"
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <Grid item xs={4}>
          <Typography gutterBottom variant="h4">
            Pgae Not Found
          </Typography>

          <Typography variant="body1">
            Please check your address or back to{" "}
            <Link
              component="button"
              underline="hover"
              variant="body1"
              onClick={() => navigate("/home")}
            >
              home page
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={7}>
          <img style={{ width: "100%" }} src={emptyCart} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default NoMatch;

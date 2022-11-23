import { useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  ButtonBase,
  Divider,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const btn = {
  backgroundColor: "rgba(255, 255, 255, 0.8)",
};

const Footer = () => {
  useEffect(() => {
    // scroll to top on page load
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <Paper
      component="footer"
      sx={{
        // p: 2,
        // marginY: "40px",
        marginTop: "calc(10% + 20px)",
        height: "50vh",
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        flexShrink: 0,
        // position: "fixed",
        // bottom: "0px",
      }}
      elevation={0}
    >
      <Button
        sx={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}
        fullWidth
        variant="action"
        onClick={() => {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }}
      >
        <ArrowUpwardIcon />
        Back to Top
      </Button>

      <Box sx={{ marginY: "40px" }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          padding={3}
        >
          <Grid container item xs={2} direction="column" rowSpacing={2}>
            <Grid item>
              <Typography variant="h6"> Get to Know Us</Typography>
            </Grid>
            <Grid item>
              <ButtonBase>
                <Typography variant="body2">Customer service</Typography>
              </ButtonBase>
            </Grid>
            <Grid item>
              <ButtonBase>
                <Typography variant="body2"> About Tranow</Typography>
              </ButtonBase>
            </Grid>
            <Grid item>
              <ButtonBase>
                <Typography variant="body2"> Tranow customer</Typography>
              </ButtonBase>
            </Grid>
          </Grid>
          <Grid container item xs={2.3} direction="column" rowSpacing={2}>
            <Grid item>
              <Typography variant="h6"> Make Money With Us</Typography>
            </Grid>
            <Grid item>
              <ButtonBase>
                <Typography variant="body2">Sell products on Tranow</Typography>
              </ButtonBase>
            </Grid>
            <Grid item>
              <ButtonBase>
                <Typography variant="body2"> Tranow Devices</Typography>
              </ButtonBase>
            </Grid>
            <Grid item>
              <ButtonBase>
                <Typography variant="body2"> Tranow Science</Typography>
              </ButtonBase>
            </Grid>
          </Grid>

          <Grid container item xs={2} direction="column" rowSpacing={2}>
            <Grid item>
              <Typography variant="h6"> Payment Security</Typography>
            </Grid>
            <Grid item>
              <ButtonBase>
                <Typography variant="body2">Payment policy</Typography>
              </ButtonBase>
            </Grid>
            <Grid item>
              <ButtonBase>
                <Typography variant="body2"> Trade policy</Typography>
              </ButtonBase>
            </Grid>
            <Grid item>
              <ButtonBase>
                <Typography variant="body2"> Tranow security</Typography>
              </ButtonBase>
            </Grid>
          </Grid>

          <Grid container item xs={2} direction="column" rowSpacing={2}>
            <Grid item>
              <Typography variant="h6">Let Us Help You</Typography>
            </Grid>
            <Grid item>
              <ButtonBase>
                <Typography variant="body2">Tranow and COVID-19</Typography>
              </ButtonBase>
            </Grid>
            <Grid item>
              <ButtonBase>
                <Typography variant="body2">Your Order</Typography>
              </ButtonBase>
            </Grid>
            <Grid item>
              <ButtonBase>
                <Typography variant="body2">Reimbursement</Typography>
              </ButtonBase>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Divider />
    </Paper>
  );
};

export default Footer;

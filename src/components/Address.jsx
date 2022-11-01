import { useEffect, useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo, getUserAddress, loadUserAddress } from "../store/user";

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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SingleAddress from "./SingleAddress";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Address = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const emptyAddress = {
    city: "",
    country: "",
    address: null,
    phone: "",
    post_code: "",
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const userAddresses = useSelector(getUserAddress);

  useEffect(() => {
    dispatch(loadUserAddress());
  }, []);
  console.log(userAddresses);
  //   console.log(userAddresses);
  //   if (!isLoaded) {
  //     return <h1>Loading</h1>;
  //   }
  return (
    <Paper
      sx={{
        p: 2,
        marginX: "auto",
        mt: "20px",
        maxWidth: "80%",
        // flexGrow: 1,
      }}
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <Grid
          item
          container
          direction="row"
          // justifyContent="center"
          alignItems="center"
          // spacing={10}
        >
          <Grid align="right" item xs={7}>
            <Typography variant="h3">Address</Typography>
          </Grid>
          <Grid item xs={5} align="right" onClick={handleClickOpen}>
            <Button color="primary" variant="contained">
              New Address
            </Button>
          </Grid>
        </Grid>

        <Grid item>
          {userAddresses.length !== 0
            ? userAddresses.map((address, index) => (
                <Accordion
                  key={index}
                  sx={{ backgroundColor: "customerColor.lightDark" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>
                      {address.address}, {address.city}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <SingleAddress
                      userAddress={address}
                      type="manageOldAddress"
                    />
                  </AccordionDetails>
                </Accordion>
              ))
            : null}
        </Grid>

        {/* <Grid item>
          <Button
            color="primary"
            variant="contained"
            onClick={handleClickOpen}
            //   type="submit"
          >
            Add New Address
          </Button>
        </Grid> */}
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="new-address"
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle align="center">Add a new Address?</DialogTitle>
          <DialogContent>
            <DialogContentText id="new-address"></DialogContentText>

            <SingleAddress
              userAddress={emptyAddress}
              type="addNewaddress"
              closeDialog={handleClose}
            />
          </DialogContent>
          {/* <DialogActions>
              <Button onClick={handleClose}>Disagree</Button>
              <Button onClick={handleClose}>Agree</Button>
            </DialogActions> */}
        </Dialog>
      </Grid>
    </Paper>
  );
};

export default Address;

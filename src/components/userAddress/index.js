import { useEffect, useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getLoadingStatus,
  getUserAddress,
  loadUserAddress,
} from "../../store/user";

import {
  Grid,
  Typography,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SingleAddress from "./SingleAddress";
import EmptyAddress from "./EmptyAddress";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Loading = () => {
  return <h1>Loading ...</h1>;
};
const UserAddress = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const loadingStatus = useSelector(getLoadingStatus);
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

  // console.log(userAddresses);

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
      {!loadingStatus ? (
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
            {userAddresses.length !== 0 ? (
              userAddresses.map((address, index) => (
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
            ) : (
              <EmptyAddress />
            )}
          </Grid>

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
          </Dialog>
        </Grid>
      ) : (
        <Loading />
      )}
    </Paper>
  );
};

export default UserAddress;

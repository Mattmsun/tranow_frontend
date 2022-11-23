import "react-credit-cards/es/styles-compiled.css";

import { useEffect, useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadUserPayment,
  getUserPayment,
  getLoadingStatus,
} from "../../store/user";
import SinglePayment from "./SinglePayment";
import Cards from "react-credit-cards";
import {
  Grid,
  Typography,
  ButtonBase,
  Button,
  Paper,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Collapse,
} from "@mui/material";
import EmptyPayment from "./EmptyPayment";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const Loading = () => {
  return <h1>Loading ...</h1>;
};
const UserPayment = () => {
  const dispatch = useDispatch();
  const userPayment = useSelector(getUserPayment);
  const loadingStatus = useSelector(getLoadingStatus);

  const [open, setOpen] = useState(false);
  const [showCardInfo, setShowCardInfo] = useState([]);
  const emptyPayment = {
    issuer: "",
    account_name: "",
    account_number: "",
    expiry: "",
  };
  useEffect(() => {
    dispatch(loadUserPayment());
  }, []);

  const formatDate = (date) => {
    const arr = date.split("-");
    return arr[1] + "/" + arr[0].slice(2, 4);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleEditCard = (index) => {
    const newState = [...showCardInfo];
    newState[index] = !newState[index];
    setShowCardInfo(newState);
  };
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
            spacing={10}
          >
            <Grid align="right" item xs={9}>
              <Typography variant="h3">Cards and accounts</Typography>
            </Grid>
            <Grid item xs={3} align="right" onClick={handleClickOpen}>
              <Button color="primary" variant="contained">
                New Payment
              </Button>
            </Grid>
          </Grid>
          {userPayment.length !== 0 ? (
            userPayment.map((payment, index) => (
              <Grid
                key={index}
                item
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <Collapse
                    in={showCardInfo[index]}
                    // timeout="auto"
                    // orientation="horizontal"
                    timeout={{ enter: 500, exit: 1000 }}
                    unmountOnExit
                  >
                    <SinglePayment
                      payment={{
                        ...payment,
                        expiry: formatDate(payment.expiry),
                      }}
                      type="editCard"
                      closeDialog={handleClose}
                      closeCardInfo={() => handleEditCard(index)}
                    />
                  </Collapse>
                </Grid>
                <Grid item>
                  <Collapse
                    in={!showCardInfo[index]}
                    timeout={{ enter: 0, exit: 500 }}
                    unmountOnExit
                  >
                    <ButtonBase
                      sx={{ borderRadius: "11px" }}
                      onClick={() => handleEditCard(index)}
                    >
                      <Cards
                        name={payment.account_name}
                        number={payment.account_number}
                        expiry={formatDate(payment.expiry)}
                        cvc=""
                      />
                    </ButtonBase>
                  </Collapse>
                </Grid>
              </Grid>
            ))
          ) : (
            <EmptyPayment />
          )}

          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            // aria-describedby="manage-payment"
            fullWidth
            maxWidth="lg"
            // disableEscapeKeyDown
          >
            <DialogTitle align="center">Add a new Payment?</DialogTitle>
            <DialogContent>
              <DialogContentText
              // id="manage-payment"
              ></DialogContentText>

              <SinglePayment
                payment={emptyPayment}
                type="addCard"
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

export default UserPayment;

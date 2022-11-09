import "react-credit-cards/es/styles-compiled.css";

import { useEffect, useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUserPayment, getUserPayment } from "../store/user";
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
import { TransitionGroup } from "react-transition-group";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const Payment = () => {
  const dispatch = useDispatch();
  const userPayment = useSelector(getUserPayment);
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
  // console.log(showCardInfo);
  // console.log(userPayment);
  // console.log(formatDate("2022-10-02T13:00:00.000Z"));
  const Loading = () => <Typography variant="h4">Loading...</Typography>;

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
        {userPayment.length !== 0 &&
          userPayment.map((payment, index) => (
            <Grid
              key={index}
              item
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              {/* <Grid item>
                {showCardInfo[index] ? (
                  <SinglePayment
                    payment={{
                      ...payment,
                      expiry: formatDate(payment.expiry),
                    }}
                    type="editCard"
                    closeDialog={handleClose}
                    closeCardInfo={() => handleEditCard(index)}
                  />
                ) : (
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
                )}
              </Grid> */}
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
          ))}

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
    </Paper>
  );
};

export default Payment;

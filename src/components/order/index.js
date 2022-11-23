import "react-credit-cards/es/styles-compiled.css";
import Cards from "react-credit-cards";

import { useState, useEffect } from "react";
import {
  TablePagination,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TextField,
  Grid,
  Autocomplete,
  Button,
  Divider,
  DialogActions,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  loadNewOrder,
  getNewOrder,
  updateNewOrder,
  deleteOrder,
} from "../../store/order";
import {
  loadUserPayment,
  loadUserAddress,
  getUserPayment,
  getUserAddress,
} from "../../store/user";
import HomeIcon from "@mui/icons-material/Home";
import CallIcon from "@mui/icons-material/Call";
import SingleAddress from "../userAddress/SingleAddress";

import CreditCardIcon from "@mui/icons-material/CreditCard";
import PersonIcon from "@mui/icons-material/Person";
import _ from "lodash";
import SinglePayment from "../userPayment/SinglePayment";
import EmptyOrder from "./EmptyOrder";
import { cartReset } from "../../store/cart";

const Loading = () => <h1>Loading</h1>;

const OrderTable = ({ setOrder, order }) => {
  const dispatch = useDispatch();
  // const order = useSelector(getNewOrder);

  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const getItemPicture = (item) =>
    serverUrl + "/" + JSON.parse(item.product_photo)[0];

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // useEffect(() => {
  //   setOrder(order);
  // }, [order, setOrder]);

  // useEffect(() => {
  //   console.log("render");
  //   dispatch(loadNewOrder());
  // }, [dispatch]);

  {
    return !_.isEmpty(order) ? (
      <Paper
        sx={{
          p: 2,
          marginX: "auto",
          mt: "20px",
          maxWidth: "90%",
          // flexGrow: 1,
        }}
      >
        <Typography gutterBottom align="center" variant="h4">
          Order Items
        </Typography>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: "black" }}>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Seller</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map((item) => (
                <TableRow
                  key={item.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      spacing={2}
                    >
                      <Grid item>
                        <img
                          style={{ maxWidth: 100 }}
                          src={getItemPicture(item)}
                          alt={item.name}
                        />
                      </Grid>
                      <Grid item>{item.name}</Grid>
                    </Grid>
                  </TableCell>
                  <TableCell align="right">{item.seller}</TableCell>
                  <TableCell align="right">{item.price}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">
                    {item.quantity * item.price}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={order.items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Typography align="right" variant="h5">
          Total: {order.items[0].total}
        </Typography>
      </Paper>
    ) : (
      <Typography variant="h4">
        Currently, you don't have any order in process
      </Typography>
    );
  }
  // return (
  //   <Paper
  //     sx={{
  //       p: 2,
  //       marginX: "auto",
  //       mt: "20px",
  //       maxWidth: "90%",
  //       // flexGrow: 1,
  //     }}
  //   >
  //     <TableContainer component=<Paper elevation={0} />>
  //       <Table sx={{ minWidth: 650 }} aria-label="simple table">
  //         <TableHead>
  //           <TableRow>
  //             <TableCell>Product</TableCell>
  //             <TableCell align="right">Seller</TableCell>
  //             <TableCell align="right">Price</TableCell>
  //             <TableCell align="right">Quantity</TableCell>
  //             <TableCell align="right">Total</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {order.items.map((item) => (
  //             <TableRow
  //               key={item.name}
  //               sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
  //             >
  //               <TableCell component="th" scope="row">
  //                 <Grid
  //                   container
  //                   direction="row"
  //                   alignItems="center"
  //                   spacing={2}
  //                 >
  //                   <Grid item>
  //                     <img
  //                       style={{ maxWidth: 100 }}
  //                       src={getItemPicture(item)}
  //                       alt={item.name}
  //                     />
  //                   </Grid>
  //                   <Grid item>{item.name}</Grid>
  //                 </Grid>
  //               </TableCell>
  //               <TableCell align="right">{item.seller}</TableCell>
  //               <TableCell align="right">{item.price}</TableCell>
  //               <TableCell align="right">{item.quantity}</TableCell>
  //               <TableCell align="right">
  //                 {item.quantity * item.price}
  //               </TableCell>
  //             </TableRow>
  //           ))}
  //         </TableBody>
  //       </Table>
  //     </TableContainer>
  //   </Paper>
  // );
};

const AddressManage = ({ setOrderAddress }) => {
  const dispatch = useDispatch();
  const userAddresses = useSelector(getUserAddress);
  const [address, setAddress] = useState({});
  const [openEditAddress, setOpenEditAddress] = useState(false);
  const [openNewAddress, setOpenNewAddress] = useState(false);

  const emptyAddress = {
    city: "",
    country: "",
    address: "",
    phone: "",
    post_code: "",
  };
  const handleClickOpenEditAddress = () => {
    setOpenEditAddress(true);
  };

  const handleCloseEditAddress = () => {
    setOpenEditAddress(false);
  };
  const handleClickOpenNewAddress = () => {
    setOpenNewAddress(true);
  };

  const handleCloseNewAddress = () => {
    setOpenNewAddress(false);
  };

  const handleChangeAddress = (e, newValue) => {
    const newAddress = userAddresses.find(
      (a) => a.address === newValue.address
    );
    setAddress(newAddress);
  };

  useEffect(() => {
    setOrderAddress(address);
  }, [address, setOrderAddress]);
  useEffect(() => {
    setAddress(userAddresses[0]);
  }, [userAddresses]);
  useEffect(() => {
    dispatch(loadUserAddress());
    // dispatch(loadUserPayment());
  }, [dispatch]);

  // console.log("payment", userPayment);
  // console.log("address", userAddresses);
  // console.log("address______", address);

  return (
    <Grid
      container
      direction="column"
      spacing={3}
      // justifyContent="center"
      // alignItems="center"
    >
      <Grid item container direction="row" justifyContent="space-between">
        <Grid item>
          <Typography
            color="primary.main"
            gutterBottom
            align="left"
            variant="h5"
          >
            Set Your Address
          </Typography>
        </Grid>
        {/* {!_.isEmpty(address) && (
            <Grid item>
              <Button variant="contained"> New Address </Button>
            </Grid>
          )} */}
      </Grid>
      {!_.isEmpty(address) ? (
        <Grid
          container
          item
          xs={12}
          direction="row"
          justifyContent="center"
          alignItems="baseline"
          spacing={3}
        >
          <Grid
            item
            container
            xs={12}
            direction="row"
            justifyContent="space-between"
          >
            <Grid item xs={10}>
              <Autocomplete
                // value={address.address}
                value={address}
                onChange={handleChangeAddress}
                disableClearable
                options={userAddresses}
                getOptionLabel={(option) => option.address}
                id="address"
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                renderInput={(params) => (
                  <TextField {...params} label="Address" />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-start"
                      spacing={2}
                    >
                      <Grid item>
                        <HomeIcon />
                      </Grid>
                      <Grid item>
                        {option.address}, {option.city},{option.country},
                        {option.post_code}
                      </Grid>
                      <Grid item>
                        <CallIcon />
                      </Grid>
                      <Grid item>{option.phone}</Grid>
                    </Grid>
                  </Box>
                )}
              />
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleClickOpenEditAddress}>
                Edit Adress
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TableContainer>
              <Table sx={{ width: "100%" }} aria-label="address">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6">Address</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">Contact Infromation</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                  // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography variant="body1">
                        {address.address}, {address.city}, {address.country},
                        {address.post_code}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1">{address.phone}</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Dialog
              open={openEditAddress}
              onClose={handleCloseEditAddress}
              aria-describedby="edit-address"
              fullWidth
              maxWidth="lg"
            >
              <DialogTitle align="center">Edit Your Address?</DialogTitle>
              <DialogContent>
                <DialogContentText id="edit-address"></DialogContentText>

                <SingleAddress
                  userAddress={address}
                  type="manageOldAddress"
                  closeDialog={handleCloseEditAddress}
                />
              </DialogContent>
            </Dialog>
          </Grid>
          <Grid item xs={12}>
            <Divider>
              <Button onClick={handleClickOpenNewAddress}>
                Add a New Address?
              </Button>
            </Divider>

            <Dialog
              open={openNewAddress}
              onClose={handleCloseNewAddress}
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
                  closeDialog={handleCloseNewAddress}
                />
              </DialogContent>
            </Dialog>
          </Grid>
        </Grid>
      ) : (
        <Loading />
      )}
    </Grid>
  );
};

const PaymentManage = ({ setOrderPayment }) => {
  const dispatch = useDispatch();
  const [payment, setPayment] = useState({});
  const userPayment = useSelector(getUserPayment);
  const [openEditPayment, setOpenEditPayment] = useState(false);
  const [openNewPayment, setOpenNewPayment] = useState(false);
  const emptyPayment = {
    issuer: "",
    account_name: "",
    account_number: "",
    expiry: "",
  };
  const handleClickOpenEditPayment = () => {
    setOpenEditPayment(true);
  };

  const handleCloseEditPayment = () => {
    setOpenEditPayment(false);
  };
  const handleClickOpenNewPayment = () => {
    setOpenNewPayment(true);
  };

  const handleCloseNewPayment = () => {
    setOpenNewPayment(false);
  };

  const handleChangePayment = (e, newValue) => {
    const newPayment = userPayment.find(
      (a) => a.account_name === newValue.account_name
    );
    setPayment(newPayment);
  };
  const formatDate = (date) => {
    const arr = date.split("-");
    return arr[1] + "/" + arr[0].slice(2, 4);
  };
  useEffect(() => {
    setOrderPayment(payment);
  }, [payment, setOrderPayment]);
  useEffect(() => {
    dispatch(loadUserPayment());
  }, [dispatch]);
  useEffect(() => {
    setPayment(userPayment[0]);
  }, [userPayment]);
  // console.log(payment);
  return (
    <Grid
      container
      direction="column"
      spacing={3}
      // justifyContent="center"
      // alignItems="center"
    >
      <Grid item>
        <Typography color="primary.main" gutterBottom align="left" variant="h5">
          Set Your Payment
        </Typography>
      </Grid>

      {!_.isEmpty(payment) ? (
        <Grid
          item
          container
          xs={12}
          direction="row"
          justifyContent="flex-start"
          // alignItems="flex-start"
          rowSpacing={3}
        >
          <Grid item xs={10}>
            <Autocomplete
              // value={address.address}
              value={payment}
              onChange={handleChangePayment}
              disableClearable
              options={userPayment}
              getOptionLabel={(option) => option.account_number}
              id="payment"
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => (
                <TextField {...params} label="Payment" />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={2}
                  >
                    <Grid item>
                      <CreditCardIcon />
                    </Grid>
                    <Grid item>{option.account_number}</Grid>
                    <Grid item>
                      <PersonIcon />
                    </Grid>
                    <Grid item>{option.account_name}</Grid>
                  </Grid>
                </Box>
              )}
            />
          </Grid>
          <Grid align="end" item xs={2}>
            <Button variant="contained" onClick={handleClickOpenEditPayment}>
              Edit Payment
            </Button>
          </Grid>

          <Grid item xs={4}>
            <Cards
              name={payment.account_name}
              number={payment.account_number}
              expiry={formatDate(payment.expiry)}
              cvc=""
              // preview={true}
            />
          </Grid>
          <Grid
            item
            container
            xs={8}
            // justifyContent="center"
            // alignItems="flex-start"
          >
            <TableContainer>
              <Table sx={{ width: "100%" }} aria-label="address">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6">Card#</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">Card Holder</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">Expiry</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">Issuer</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                  // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography variant="body1">
                        {payment.account_number}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1">
                        {payment.account_name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1">
                        {formatDate(payment.expiry)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1">{payment.issuer}</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Dialog
            open={openEditPayment}
            onClose={handleCloseEditPayment}
            aria-describedby="edit-payment"
            fullWidth
            maxWidth="lg"
          >
            <DialogTitle align="center">Edit Your Payment?</DialogTitle>
            <DialogContent>
              <DialogContentText id="edit-payment"></DialogContentText>

              <SinglePayment
                payment={{
                  ...payment,
                  expiry: formatDate(payment.expiry),
                }}
                type="editCard"
                closeDialog={handleCloseEditPayment}
                // closeCardInfo={() => handleEditCard(index)}
              />
            </DialogContent>
          </Dialog>
          <Grid item xs={12}>
            <Divider>
              <Button onClick={handleClickOpenNewPayment}>
                Add a New Payment?
              </Button>
            </Divider>
            <Dialog
              open={openNewPayment}
              onClose={handleCloseNewPayment}
              aria-describedby="new-payment"
              fullWidth
              maxWidth="lg"
            >
              <DialogTitle align="center">Add a new Payment?</DialogTitle>
              <DialogContent>
                <DialogContentText id="new-payment"></DialogContentText>

                <SinglePayment
                  payment={emptyPayment}
                  type="addCard"
                  closeDialog={handleCloseNewPayment}
                />
              </DialogContent>
            </Dialog>
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  );
};
const OrderManage = () => {
  const [orederAddress, setOrderAddress] = useState({});
  const [orederPayment, setOrderPayment] = useState({});
  const [openCacelOrder, setOpenCancelOrder] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const dispatch = useDispatch();

  const handleClickOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const handleClickOpenCancel = () => {
    setOpenCancelOrder(true);
  };

  const handleCloseCancel = () => {
    dispatch(deleteOrder());
    setOpenCancelOrder(false);
  };
  const handelClickSubmit = async () => {
    const payment_id = orederPayment.id;
    const address_id = orederAddress.id;

    if (!payment_id || !address_id) return handleClickOpenAlert();
    const result = dispatch(updateNewOrder({ payment_id, address_id }));
    dispatch(cartReset());
    // console.log("--------", { payment_id, address_id });
    console.log("-----", result);
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
      <Typography gutterBottom align="center" variant="h4">
        Order Management
      </Typography>
      <AddressManage setOrderAddress={(address) => setOrderAddress(address)} />
      <PaymentManage setOrderPayment={(payment) => setOrderPayment(payment)} />
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={3}
      >
        <Grid item>
          <Button variant="contained" onClick={handelClickSubmit}>
            Submit
          </Button>
          <Dialog
            open={openAlert}
            onClose={handleCloseAlert}
            aria-labelledby="submit-order-title"
            aria-describedby="submit-order-description"
          >
            <DialogTitle id="submit-order-title">
              {"No payment method or address provided"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="submit-order-description">
                Make sure you provide your payment method and address to
                finalize your order
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={handleCloseAlert}>
                Continue
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={handleClickOpenCancel}>
            Cancel
          </Button>
          <Dialog
            open={openCacelOrder}
            onClose={handleCloseCancel}
            aria-labelledby="cancel-order-title"
            aria-describedby="cancel-order-description"
          >
            <DialogTitle id="cancel-order-title">
              {"Are you sure to cancel your order?"}
            </DialogTitle>
            {/* <DialogContent>
          <DialogContentText id="cancel-order-description">
            
          </DialogContentText>
        </DialogContent> */}
            <DialogActions>
              <Button variant="contained" onClick={handleCloseCancel}>
                Let me think
              </Button>
              <Button onClick={handleCloseCancel} autoFocus>
                Cancel Order
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </Paper>
  );
};

const NewOrder = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadNewOrder());
  }, [dispatch]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const order = useSelector(getNewOrder);

  // const [order, setOrder] = useState({});
  // console.log(order);

  {
    return !_.isEmpty(order) ? (
      <>
        <OrderTable
          // setOrder={(order) => setOrder(order)}
          order={order}
        />
        <OrderManage />
      </>
    ) : (
      <Paper
        sx={{
          p: 2,
          marginX: "auto",
          mt: "20px",
          maxWidth: "90%",
          // flexGrow: 1,
        }}
      >
        <EmptyOrder />
      </Paper>
    );
  }
};

export default NewOrder;

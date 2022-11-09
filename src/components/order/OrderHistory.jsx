import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadAllOrder, getAllOrders } from "../../store/order";
import {
  TablePagination,
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TableSortLabel,
  Tooltip,
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PaidIcon from "@mui/icons-material/Paid";
import { useNavigate } from "react-router-dom";

function Row(props) {
  let navigate = useNavigate();

  const { order } = props;
  const [open, setOpen] = useState(false);
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const getProductPicture = (product) =>
    serverUrl + "/" + JSON.parse(product.product_photo)[0];
  return (
    <>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {order.id}
        </TableCell>
        <TableCell align="right">{order.quantity}</TableCell>
        <TableCell align="right">{order.orderDate.substring(0, 10)}</TableCell>
        <TableCell
          align="right"
          sx={!order.address ? { color: "error.main" } : { color: "text.main" }}
        >
          {order.address ? order.address : "No Address Provided"}
        </TableCell>

        <TableCell
          align="right"
          sx={
            order.status !== "Completed"
              ? { color: "error.main" }
              : { color: "success.main" }
          }
        >
          {order.status ? order.status : "No Payment Provided"}
        </TableCell>
        <TableCell align="right">{order.total}</TableCell>
        {!order.address || !order.status ? (
          <TableCell>
            <Tooltip title="Finish your order">
              <IconButton
                aria-label="pay_order"
                size="small"
                onClick={() => {
                  navigate(`/myOrder/newOrder`);
                }}
              >
                <PaidIcon color="error" />
              </IconButton>
            </Tooltip>
          </TableCell>
        ) : null}
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Product
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Image</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {item.name}
                      </TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">
                        <img
                          style={{ maxWidth: 100 }}
                          src={getProductPicture(item)}
                          alt={item.name}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const OrderHistory = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getAllOrders);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("Order Date");

  const handleRequestSort = (event, value) => {
    const isAsc = orderBy === value && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(value);
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    dispatch(loadAllOrder());
  }, [dispatch]);
  const organizedOrder = orders.reduce(
    (
      a,
      {
        order_id,
        modified_at: orderDate,
        quantity,
        address,
        status,
        total,
        name,
        price,
        product_photo,
        // items = [],
      }
    ) => {
      const foundRole = a.find(({ id }) => id === order_id);

      if (foundRole) {
        foundRole.quantity = foundRole.quantity + quantity;
        foundRole.items.push({ name, price, quantity, product_photo });
      } else
        a.push({
          id: order_id,
          orderDate,
          quantity,
          address,
          status,
          total,
          items: [{ name, price, quantity, product_photo }],
        });
      return a;
    },
    []
  );
  //   console.log("orderBy", orderBy);
  // console.log("order", order);
  // console.log(orders);
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
      <Typography variant="h4" align="center">
        Order History
      </Typography>
      <TableContainer>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Order ID</TableCell>
              <TableCell align="right">Items</TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "orderDate"}
                  direction={orderBy === "orderDate" ? order : "asc"}
                  onClick={(e) => handleRequestSort(e, "orderDate")}
                ></TableSortLabel>
                Order Date
              </TableCell>

              <TableCell align="right">Shipping Address</TableCell>
              <TableCell align="right">Payment Status</TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "total"}
                  direction={orderBy === "total" ? order : "asc"}
                  onClick={(e) => handleRequestSort(e, "total")}
                ></TableSortLabel>
                Order Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {organizedOrder.map((order, index) => (
              <Row key={index} order={order} />
            ))} */}
            {organizedOrder

              .sort(getComparator(order, orderBy))
              .slice()
              .map((order, index) => (
                <Row key={index} order={order} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={organizedOrder.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default OrderHistory;

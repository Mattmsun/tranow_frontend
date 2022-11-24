import { useEffect, useState } from "react";
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
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import {
  loadTransaction,
  getTransaction,
  getLoadingStatus,
} from "../../store/order";
import EmptyTransaction from "./EmptyTransaction";

const Loading = () => <h1>Loading ...</h1>;

const UserTransaction = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(getTransaction);
  const loadingStatus = useSelector(getLoadingStatus);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("soldDate");

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
    dispatch(loadTransaction());
  }, [dispatch]);
  console.log(transactions);
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
        !_.isEmpty(transactions) ? (
          <>
            <Typography gutterBottom variant="h4" align="center">
              Transaction History
            </Typography>
            <TableContainer>
              <Table aria-label="transaction table">
                <TableHead sx={{ backgroundColor: "black" }}>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === "soldDate"}
                        direction={orderBy === "soldDate" ? order : "asc"}
                        onClick={(e) => handleRequestSort(e, "soldDate")}
                      >
                        Sold Date
                      </TableSortLabel>
                    </TableCell>

                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === "quantity"}
                        direction={orderBy === "quantity" ? order : "asc"}
                        onClick={(e) => handleRequestSort(e, "quantity")}
                      >
                        Quantity
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">Buyer</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...transactions]
                    .sort(getComparator(order, orderBy))
                    .slice()
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((transaction, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {transaction.product_name}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {transaction.category}
                        </TableCell>
                        <TableCell align="right">
                          {transaction.soldDate.substring(0, 10)}
                        </TableCell>
                        <TableCell align="right">
                          {transaction.quantity}
                        </TableCell>
                        <TableCell align="right">{transaction.buyer}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={transactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        ) : (
          <EmptyTransaction />
        )
      ) : (
        <Loading />
      )}
    </Paper>
  );
};

export default UserTransaction;

import { useState, useEffect } from "react";
import { Box, Pagination } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { getCartItems } from "../../store/cart";
const pageSize = 3;
const AppPagination = ({ items, setShowedItems }) => {
  const [pagination, setPagination] = useState({
    count: 0,
    from: 0,
    to: pageSize,
  });
  //   const items = useSelector(getCartItems);
  // console.log(items);
  useEffect(() => {
    setPagination({ ...pagination, count: items.length });
    // console.log("render");
    const showedItems = items.slice(pagination.from, pagination.to);
    setShowedItems(showedItems);
  }, [pagination.from, pagination.to, items]);

  const handlePageChange = (e, page) => {
    const from = (page - 1) * pageSize;
    const to = (page - 1) * pageSize + pageSize;
    setPagination({ ...pagination, from: from, to: to });
    //     const showedItems = items.slice(pagination.from, pagination.to);
    //     setShowedItems(showedItems);
  };
  //   console.log(pagination);

  return (
    <Box
      justifyContent="center"
      alignItems="center"
      display="flex"
      sx={{ margin: "20px,0px" }}
    >
      <Pagination
        count={Math.ceil(pagination.count / pageSize)}
        onChange={handlePageChange}
      />
    </Box>
  );
};

export default AppPagination;

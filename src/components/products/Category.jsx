import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategory, loadCategory } from "../../store/products";
import category_1 from "../../images/category/1.jpeg";
import category_2 from "../../images/category/2.jpeg";
import category_3 from "../../images/category/3.jpeg";
import category_4 from "../../images/category/4.jpeg";
import category_5 from "../../images/category/5.jpeg";
import category_6 from "../../images/category/6.jpeg";
import category_7 from "../../images/category/7.jpeg";
import category_8 from "../../images/category/8.jpeg";
import category_9 from "../../images/category/9.jpeg";
import category_10 from "../../images/category/10.jpeg";
import category_11 from "../../images/category/11.jpeg";
import category_12 from "../../images/category/12.jpeg";
import { useNavigate } from "react-router-dom";

import {
  CardActionArea,
  Grid,
  Typography,
  Box,
  CardMedia,
  CardContent,
  Card,
  ButtonBase,
  Divider,
  Zoom,
  Slide,
} from "@mui/material";
import _ from "lodash";

const Loading = () => <h1>Loading...</h1>;
const Category = () => {
  let navigate = useNavigate();

  const category = useSelector(getCategory);
  const dispatch = useDispatch();
  const categoryImages = [
    category_1,
    category_2,
    category_3,
    category_4,
    category_5,
    category_6,
    category_7,
    category_8,
    category_9,
    category_10,
    category_11,
    category_12,
  ];
  //   useEffect(() => {
  //     dispatch(loadCategory());
  //   }, [dispatch]);
  //   console.log(category);

  return _.isEmpty(category) ? (
    <Loading />
  ) : (
    <Box>
      <Box>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={3}
        >
          {category.map((c, index) => (
            <Grid item xs={3} key={c.id}>
              <Card sx={{ height: "400px" }}>
                <CardActionArea
                  sx={{ height: "200px" }}
                  onClick={() => {
                    navigate(`/category/${c.id}`);
                  }}
                >
                  <CardMedia
                    sx={{ height: "200px" }}
                    component="img"
                    image={categoryImages[index]}
                    alt={c.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5">
                      {c.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {c.desc}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Category;

import { useState } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { ButtonBase, Grid, Typography } from "@mui/material";
import bgImgae from "../images/home_bg.jpeg";
import game from "../images/games.jpeg";
import food from "../images/food.jpeg";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function Search() {
  // const iconButton = iconStyle();

  const [index, setIndex] = useState(0);
  const images = [game, food, bgImgae];

  const decreaseIndex = () => {
    if (index === 0) setIndex(images.length - 1);
    else setIndex(index - 1);
  };
  const increaseIndex = () => {
    if (index === images.length - 1) setIndex(0);
    else setIndex(index + 1);
  };
  // console.log(index);
  return (
    <Box sx={{ height: 300 }}>
      <img className="bgImage" src={images[index]} />
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid xs={0.5} item>
          <ButtonBase
            sx={{ height: 300, width: "100%" }}
            onClick={decreaseIndex}
          >
            <ArrowBackIosIcon fontSize="large" />
          </ButtonBase>
        </Grid>
        <Grid xs={11} item>
          <ButtonBase
            sx={{
              height: 300,
              width: "100%",
              // position: "absolute"
            }}
          >
            <Typography>Select Your Element</Typography>
          </ButtonBase>
        </Grid>
        <Grid xs={0.5} item>
          <ButtonBase
            sx={{ height: 300, width: "100%" }}
            onClick={increaseIndex}
          >
            <ArrowForwardIosIcon fontSize="large" />
          </ButtonBase>
        </Grid>
      </Grid>
      {/* <ButtonBase sx={{ height: 300, width: "100%", position: "absolute" }}>
        <img style={{ width: "100%", height: "100%" }} src={bgImgae} />
      </ButtonBase> */}

      {/* <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: { xs: "100%", sm: "100%,", md: "50%" },
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Your Items"
          inputProps={{ "aria-label": "Search Your Items" }}
        />
        <IconButton
          type="button"
          sx={{
            p: "10px",
          }}
          aria-label="search"
          //   disableRipple={true}
        >
          <SearchIcon />
        </IconButton>
      </Paper> */}
    </Box>
  );
}

import React from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Paper,
  CardMedia,
  Box,
} from "@mui/material";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import NordicWalkingIcon from "@mui/icons-material/NordicWalking";
import ShieldIcon from "@mui/icons-material/Shield";
import buy from "../images/buy-products.jpeg";
import sell from "../images/sell-products.jpeg";
import fashion from "../images/fashion.jpeg";
import aboutbg from "../images/about.jpeg";

const About = () => {
  const pros = [
    {
      text: "Faster buying process",
      icon: <ElectricBoltIcon color="primary" />,
    },
    { text: "Cost reduction", icon: <TrendingDownIcon color="primary" /> },
    {
      text: "Product and price comparison",
      icon: <CompareArrowsIcon color="primary" />,
    },
    {
      text: "No reach limitations",
      icon: <NordicWalkingIcon color="primary" />,
    },
    { text: "Secure payment modes", icon: <ShieldIcon color="primary" /> },
  ];
  return (
    <>
      <Box sx={{ position: "relative", overflow: "hidden", height: "80vh" }}>
        <img className="bgImage" src={aboutbg} />
      </Box>
      <Paper
        sx={{
          p: 2,
          marginX: "auto",
          mt: "20px",
          maxWidth: "90%",
          marginTop: "-50vh",
          // flexGrow: 1,
        }}
        elevation={8}
      >
        <Typography variant="h4" align="left" gutterBottom>
          About us
        </Typography>
        <Typography variant="h6" align="left" gutterBottom display="block">
          Tranow is a ecommerce website. We offter the best trade platform for
          both sellers and customers. We offer:
        </Typography>
        {pros.map((p, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            {p.icon}
            <Typography
              variant="body"
              align="left"
              gutterBottom
              display="block"
            >
              {p.text}
            </Typography>
          </Box>
        ))}

        <Typography variant="h6" align="left" gutterBottom>
          On this platform you can:
        </Typography>
        <Grid
          container
          direction="row"
          alignItems="flex-star"
          justifyContent="flex-start"
          spacing={3}
        >
          <Grid item xs={4}>
            <Card sx={{ maxWidth: 345, height: "30vh" }}>
              <CardMedia component="img" height="140" image={sell} alt="sell" />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Sell your products
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sell second-hand, new products are both acceptable on this
                  platform
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ maxWidth: 345, height: "30vh" }}>
              <CardMedia component="img" height="140" image={buy} alt="sell" />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Purchase your products
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We will check the seller's products regularly and feel free to
                  buy genuine products
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ maxWidth: 345, height: "30vh" }}>
              <CardMedia
                component="img"
                height="140"
                image={fashion}
                alt="sell"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Seek the popularity
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We will filter the most popular products to make sure your are
                  in the modern society
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default About;

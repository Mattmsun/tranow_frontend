import React from "react";
import {
  Grid,
  Typography,
  Paper,
  Link,
  Box,
  Icon,
  IconButton,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import wechatIcon from "../images/wechat.png";
import { blue } from "@mui/material/colors";
import help from "../images/help.png";
import helpbg from "../images/need-help-bg.webp";

const Contact = () => {
  const mailtoHref =
    "mailto:mattmsun@outlook.com?subject=SendMail&body=Description";
  const faceBookHref = "https://www.facebook.com/";
  const twirrerHref = "https://twitter.com/home";
  const wechat = "https://www.wechat.com/";
  const contacts = [
    {
      text: "email : ",
      icon: <MailIcon style={{ color: blue[400] }} />,
      href: mailtoHref,
    },
    {
      text: "facebook : ",
      icon: <FacebookIcon style={{ color: blue[400] }} />,
      href: faceBookHref,
    },
    {
      text: "twiter : ",
      icon: <TwitterIcon style={{ color: blue[400] }} />,
      href: twirrerHref,
    },
    {
      text: "wechat : ",
      icon: (
        <Icon sx={{ textAlign: "center" }}>
          <img style={{ height: "100%" }} src={wechatIcon} />
        </Icon>
      ),
      href: wechat,
    },
  ];
  return (
    <>
      <Box sx={{ position: "relative", overflow: "hidden", height: "80vh" }}>
        <img className="bgImage" src={helpbg} />
      </Box>
      <Paper
        sx={{
          p: 2,
          marginX: "auto",
          mt: "20px",
          maxWidth: "90%",
          marginTop: "-50vh",
        }}
        elevation={8}
      >
        <Typography variant="h4" gutterBottom>
          Contact
        </Typography>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={6}>
            <img style={{ width: "100%" }} src={help} />
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h5" gutterBottom>
              Ask how we can help you
            </Typography>
            {contacts.map((c, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Typography variant="body" gutterBottom>
                  {c.text}
                </Typography>
                <IconButton
                  sx={{ marginX: "10px" }}
                  onClick={() => window.open(c.href, "_blank")}
                >
                  {c.icon}
                </IconButton>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default Contact;

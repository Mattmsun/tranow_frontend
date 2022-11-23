import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ECB365",
    },
    secondary: {
      main: "#FF4C29",
    },
    customerColor: {
      main: "#6495E",
      secondary: "ECB365",
      lightDark: "#1A2027",
      lightBlue: "#6495E",
      darkred_2: "#E75F42",
      bloddOrange: "#e77600",
    },
  },
  typography: {
    fontFamily: "Lora",
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
});

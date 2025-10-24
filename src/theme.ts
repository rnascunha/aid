"use client";

import { createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const theme = createTheme(
  {
    colorSchemes: {
      light: {
        palette: {
          background: {
            paper: "#f0f0f0",
          },
        },
      },
      dark: {
        palette: {
          background: {
            paper: "#202020",
          },
        },
      },
    },
    cssVariables: {
      colorSchemeSelector: "class",
    },
    typography: {
      fontFamily: roboto.style.fontFamily,
    },
  }
);

export default theme;

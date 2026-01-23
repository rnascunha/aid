import { ReactNode } from "react";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
// import { GoogleTagManager } from "@next/third-parties/google";

import "./global.css";
import { Metadata } from "next";
// import { LocalizerProvider } from "@/components/localizerProvider";

import "@/libs/chat/storage/mongodb/connect";

const description = "Test site for AI features";
const name = "AId";
const template = `%s | ${name}`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_BASE_URL as string),
  title: {
    default: name,
    template,
  },
  description,
  authors: [{ name: "Rafael Cunha" }],
  keywords: ["ai", "artificial inteligence", "data"],
  openGraph: {
    title: {
      default: name,
      template,
    },
    description,
    url: process.env.SITE_BASE_URL as string,
    siteName: "AId",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/og/aid-logo-1200x630.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Company Logo",
      },
      {
        url: "/og/aid-logo-600x600.png",
        width: 600,
        height: 600,
        type: "image/png",
        alt: "Company Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: name,
      template,
    },
    description,
    images: [
      {
        url: "/og/aid-logo-1200x630.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Company Logo",
      },
      {
        url: "/og/aid-logo-600x600.png",
        width: 600,
        height: 600,
        type: "image/png",
        alt: "Company Logo",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <GoogleTagManager gtmId="GTM-NZBPVNQS" /> */}
      <body>
        <InitColorSchemeScript attribute="class" />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          {/* <LocalizerProvider> */}
          <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            {children}
          </ThemeProvider>
          {/* </LocalizerProvider> */}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

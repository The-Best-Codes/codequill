import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { appWithTranslation } from "./i18n";
import type { AppProps } from "next/app";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeQuill",
  description: "Create, share, and store your codes",
};

const RootLayout = ({ children }: any) => {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
};

export default appWithTranslation(RootLayout);

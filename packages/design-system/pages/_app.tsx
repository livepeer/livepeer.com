import React from "react";
import Head from "next/head";
import "../styles.css";
import { DesignSystemProvider } from "@modulz/design-system";
import { lightTheme, darkTheme, global } from "../stitches.config";
import { ThemeProvider } from "next-themes";

function App({ Component, pageProps }) {
  return (
    <DesignSystemProvider>
      <ThemeProvider
        disableTransitionOnChange
        attribute="class"
        defaultTheme="dark"
        value={{ dark: darkTheme.className, light: lightTheme.className }}>
        <div>
          <Head>
            <title>Design System</title>
            <link
              rel="stylesheet"
              href="https://develop.modulz.app/fonts/fonts.css"
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </DesignSystemProvider>
  );
}

export default App;

import * as React from "react";
import { ChakraProvider, CSSReset, theme } from "@chakra-ui/react";
import { Appwrite } from "appwrite";
import { Login } from "./pages/Login";

export const App = (): JSX.Element => {
  const appwrite = new Appwrite();

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Login appwrite={appwrite} />
    </ChakraProvider>
  );
};

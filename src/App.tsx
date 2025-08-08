import * as React from "react";
import { ReactElement } from "react";
import { ChakraProvider, CSSReset, theme } from "@chakra-ui/react";
import { Client } from "appwrite";
import { QueryClient, QueryClientProvider } from "react-query";
import { Routes } from "./components/Routes";
import { AppwriteProvider } from "./contexts/appwrite";

const queryClient = new QueryClient();
const appwrite = new Client();

export const App = (): ReactElement => {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <AppwriteProvider value={appwrite}>
        <QueryClientProvider client={queryClient}>
          <Routes />
        </QueryClientProvider>
      </AppwriteProvider>
    </ChakraProvider>
  );
};

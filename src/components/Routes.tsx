import * as React from "react";
import { ReactElement } from "react";
import { Center, Spinner } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Routes as RouterRoutes,
  Route,
} from "react-router-dom";
import { Login } from "../pages/Login";
import { Layout } from "./Layout";
import { useAppwrite } from "../contexts/appwrite";
import { Database } from "../pages/Database";
import { Storage } from "../pages/Storage";
import { Teams } from "../pages/Teams";
import { Functions } from "../pages/Functions";
import { TeamMemberships } from "../pages/TeamMemberships";
import { Realtime } from "../pages/Realtime";
import { useAccount } from "../hooks/useAccount";

export const Routes = (): ReactElement => {
  const client = useAppwrite();
  const { isLoading, data } = useAccount();

  return !client || isLoading ? (
    <Center minH="100vh">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="pink.500"
        size="xl"
      />
    </Center>
  ) : !data ? (
    <Login client={client} />
  ) : (
    <Router>
      <Layout>
        <RouterRoutes>
          <Route path="/storage" element={<Storage />} />
          <Route path="/teams/:id" element={<TeamMemberships />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/functions" element={<Functions />} />
          <Route path="/realtime" element={<Realtime />} />
          <Route path="/" element={<Database />} />
        </RouterRoutes>
      </Layout>
    </Router>
  );
};

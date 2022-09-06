import * as React from "react";
import { Center, Spinner } from "@chakra-ui/react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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

export const Routes = (): JSX.Element => {
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
    <Login client={client}></Login>
  ) : (
    <Router>
      <Layout>
        <Switch>
          <Route path="/storage">
            <Storage />
          </Route>
          <Route path="/teams/:id">
            <TeamMemberships />
          </Route>
          <Route path="/teams">
            <Teams />
          </Route>
          <Route path="/functions">
            <Functions />
          </Route>
          <Route path="/realtime">
            <Realtime />
          </Route>
          <Route path="/">
            <Database />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
};

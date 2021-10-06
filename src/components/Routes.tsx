import * as React from "react";
import { Spinner } from "@chakra-ui/react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from "../pages/Login";
import { Layout } from "./Layout";
import { useQuery } from "react-query";
import { LocalStorageKey, QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";
import { Documents } from "../pages/Documents";
import { Storage } from "../pages/Storage";

export const Routes = (): JSX.Element => {
  const appwrite = useAppwrite();
  const { isLoading, data } = useQuery(
    QueryKey.USER,
    async () => {
      if (!appwrite) return null;

      const endpoint = localStorage.getItem(LocalStorageKey.ENDPOINT);
      const project = localStorage.getItem(LocalStorageKey.PROJECT);
      if (endpoint && project) {
        appwrite.setEndpoint(endpoint);
        appwrite.setProject(project);
      }

      try {
        const result = await appwrite.account.get();
        return result;
      } catch (err) {}
      return null;
    },
    { enabled: !!appwrite, staleTime: Infinity }
  );

  return !appwrite || isLoading ? (
    <Spinner />
  ) : !data ? (
    <Login appwrite={appwrite}></Login>
  ) : (
    <Router>
      <Layout>
        <Switch>
          <Route path="/storage">
            <Storage />
          </Route>
          <Route path="/">
            <Documents />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
};

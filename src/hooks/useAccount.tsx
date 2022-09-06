import { Account, Models } from "appwrite";
import { useQuery, UseQueryResult } from "react-query";
import { LocalStorageKey, QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";

export const useAccount =
  (): UseQueryResult<Models.User<Models.Preferences> | null> => {
    const client = useAppwrite();

    return useQuery(
      QueryKey.USER,
      async () => {
        if (!client) return null;

        const endpoint = localStorage.getItem(LocalStorageKey.ENDPOINT);
        const project = localStorage.getItem(LocalStorageKey.PROJECT);
        if (endpoint && project) {
          client.setEndpoint(endpoint);
          client.setProject(project);
        }

        try {
          const account = new Account(client);
          const result = await account.get();
          return result;
        } catch (err) {}
        return null;
      },
      { enabled: !!client, staleTime: Infinity }
    );
  };

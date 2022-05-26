import { Models } from "appwrite";
import { useQuery, UseQueryResult } from "react-query";
import { LocalStorageKey, QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";

export const useAccount =
  (): UseQueryResult<Models.User<Models.Preferences> | null> => {
    const appwrite = useAppwrite();

    return useQuery(
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
  };

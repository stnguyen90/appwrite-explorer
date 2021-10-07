import { useQuery, UseQueryResult } from "react-query";
import { LocalStorageKey, QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";
import { User } from "../interfaces";

export const useAccount = (): UseQueryResult<User | null> => {
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
        const result: User = await appwrite.account.get();
        return result;
      } catch (err) {}
      return null;
    },
    { enabled: !!appwrite, staleTime: Infinity }
  );
};

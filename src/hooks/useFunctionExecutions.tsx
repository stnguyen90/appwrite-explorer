import { Models } from "appwrite";
import { useQuery, UseQueryResult } from "react-query";
import { LocalStorageKey, QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";
import { CommonListOptions } from "../interfaces";

export const useFunctionExecutions = (
  functionId: string,
  options: CommonListOptions
): UseQueryResult<Models.ExecutionList | null, unknown> => {
  const appwrite = useAppwrite();

  return useQuery(
    [QueryKey.FUNCTIONS, functionId, options],
    async () => {
      if (!appwrite || !functionId) return null;

      const result = await appwrite.functions.listExecutions(
        functionId,
        options.limit,
        options.offset
      );

      localStorage.setItem(LocalStorageKey.FUNCTION, functionId);

      return result;
    },
    { enabled: !!appwrite || !functionId }
  );
};

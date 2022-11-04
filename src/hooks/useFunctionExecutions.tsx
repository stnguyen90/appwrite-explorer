import { Functions, Models, Query } from "appwrite";
import { useQuery, UseQueryResult } from "react-query";
import { LocalStorageKey, QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";
import { CommonListOptions } from "../interfaces";

export const useFunctionExecutions = (
  functionId: string,
  options: CommonListOptions
): UseQueryResult<Models.ExecutionList | null, unknown> => {
  const client = useAppwrite();

  return useQuery(
    [QueryKey.FUNCTIONS, functionId, options],
    async () => {
      if (!client || !functionId) return null;

      const functions = new Functions(client);

      const result = await functions.listExecutions(functionId, [
        Query.limit(options.limit),
        Query.offset(options.offset),
        Query.orderDesc("$createdAt"),
      ]);

      localStorage.setItem(LocalStorageKey.FUNCTION, functionId);

      return result;
    },
    { enabled: !!client || !functionId }
  );
};

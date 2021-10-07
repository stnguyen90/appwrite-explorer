import { useQuery, UseQueryResult } from "react-query";
import { LocalStorageKey, QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";
import { CommonListOptions, Permissions } from "../interfaces";

export interface ExecutionList {
  executions: Execution[];
  sum: number;
}

export interface Execution {
  $id: string;
  $permissions: Permissions;
  name: string;
  functionId: string;
  dateCreated: number;
  trigger: string;
  status: string;
  exitCode: number;
  stdout: string;
  stderr: string;
  time: number;
}

// export interface ListExcecutionsOptions extends CommonListOptions {

// }

export const useFunctionExecutions = (
  functionId: string,
  options: CommonListOptions
): UseQueryResult<ExecutionList | null, unknown> => {
  const appwrite = useAppwrite();

  return useQuery(
    [QueryKey.FUNCTIONS, functionId, options],
    async () => {
      if (!appwrite) return null;

      const result = await appwrite.functions.listExecutions<ExecutionList>(
        functionId,
        undefined,
        options.limit,
        options.offset
      );

      localStorage.setItem(LocalStorageKey.FUNCTION, functionId);

      return result;
    },
    { enabled: !!appwrite }
  );
};

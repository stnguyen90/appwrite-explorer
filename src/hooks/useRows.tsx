import { AppwriteException, TablesDB, Models } from "appwrite";
import { useQuery, UseQueryResult } from "react-query";
import { LocalStorageKey, QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";

export interface ListRowsOptions {
  limit: number;
  offset: number;
  queries: string[];
  orderField: string;
  orderType: "ASC" | "DESC";
}

export const useRows = (
  databaseId: string,
  tableId: string,
  options: ListRowsOptions,
): UseQueryResult<Models.RowList<Models.Row> | null, AppwriteException> => {
  const client = useAppwrite();

  return useQuery(
    [QueryKey.DOCUMENTS, tableId, options],
    async () => {
      if (!client || !tableId) return null;

      const tablesDB = new TablesDB(client);

      const result = await tablesDB.listRows({
        databaseId: databaseId,
        tableId: tableId,
        queries: options.queries,
      });

      localStorage.setItem(LocalStorageKey.DATABASE, databaseId);
      localStorage.setItem(LocalStorageKey.COLLECTION, tableId);
      return result;
    },
    { enabled: !!client || !tableId },
  );
};

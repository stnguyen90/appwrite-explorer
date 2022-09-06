import { AppwriteException, Databases, Models } from "appwrite";
import { useQuery, UseQueryResult } from "react-query";
import { LocalStorageKey, QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";

export interface ListDocumentsOptions {
  limit: number;
  offset: number;
  queries: string[];
  orderField: string;
  orderType: "ASC" | "DESC";
}

export const useDocuments = (
  databaseId: string,
  collectionId: string,
  options: ListDocumentsOptions
): UseQueryResult<
  Models.DocumentList<Models.Document> | null,
  AppwriteException
> => {
  const client = useAppwrite();

  return useQuery(
    [QueryKey.DOCUMENTS, collectionId, options],
    async () => {
      if (!client || !collectionId) return null;

      const db = new Databases(client, databaseId);

      const result = await db.listDocuments(
        collectionId,
        options.queries,
        options.limit,
        options.offset,
        undefined,
        undefined,
        options.orderField != "" ? [options.orderField] : undefined,
        options.orderField != "" ? [options.orderType] : undefined
      );

      localStorage.setItem(LocalStorageKey.DATABASE, databaseId);
      localStorage.setItem(LocalStorageKey.COLLECTION, collectionId);
      return result;
    },
    { enabled: !!client || !collectionId }
  );
};

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
  options: ListDocumentsOptions,
): UseQueryResult<
  Models.DocumentList<Models.Document> | null,
  AppwriteException
> => {
  const client = useAppwrite();

  return useQuery(
    [QueryKey.DOCUMENTS, collectionId, options],
    async () => {
      if (!client || !collectionId) return null;

      const db = new Databases(client);

      const result = await db.listDocuments(
        databaseId,
        collectionId,
        options.queries,
      );

      localStorage.setItem(LocalStorageKey.DATABASE, databaseId);
      localStorage.setItem(LocalStorageKey.COLLECTION, collectionId);
      return result;
    },
    { enabled: !!client || !collectionId },
  );
};

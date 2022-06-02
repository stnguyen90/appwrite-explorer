import { AppwriteException, Models } from "appwrite";
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
  collectionId: string,
  options: ListDocumentsOptions
): UseQueryResult<
  Models.DocumentList<Models.Document> | null,
  AppwriteException
> => {
  const appwrite = useAppwrite();

  return useQuery(
    [QueryKey.DOCUMENTS, collectionId, options],
    async () => {
      if (!appwrite || !collectionId) return null;

      const result = await appwrite.database.listDocuments(
        collectionId,
        options.queries,
        options.limit,
        options.offset,
        undefined,
        undefined,
        options.orderField != "" ? [options.orderField] : undefined,
        options.orderField != "" ? [options.orderType] : undefined
      );

      localStorage.setItem(LocalStorageKey.COLLECTION, collectionId);
      return result;
    },
    { enabled: !!appwrite || !collectionId }
  );
};

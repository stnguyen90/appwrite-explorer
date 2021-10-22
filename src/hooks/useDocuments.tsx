import { AppwriteException } from "appwrite";
import { useQuery, UseQueryResult } from "react-query";
import { LocalStorageKey, QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";
import { DocumentList } from "../interfaces";

export interface ListDocumentsOptions {
  limit: number;
  offset: number;
  filters: string[];
  orderField: string;
  orderType: "ASC" | "DESC";
  orderCast: "string" | "int" | "date" | "time" | "datetime";
  search: string;
}

export const useDocuments = (
  collectionId: string,
  options: ListDocumentsOptions
): UseQueryResult<DocumentList | null, AppwriteException> => {
  const appwrite = useAppwrite();

  return useQuery(
    [QueryKey.DOCUMENTS, collectionId, options],
    async () => {
      if (!appwrite || !collectionId) return null;

      const result = await appwrite.database.listDocuments<DocumentList>(
        collectionId,
        options.filters,
        options.limit,
        options.offset,
        options.orderField != "" ? options.orderField : undefined,
        options.orderField != "" ? options.orderType : undefined,
        options.orderField != "" ? options.orderCast : undefined,
        options.search != "" ? options.search : undefined
      );

      localStorage.setItem(LocalStorageKey.COLLECTION, collectionId);
      return result;
    },
    { enabled: !!appwrite || !collectionId }
  );
};

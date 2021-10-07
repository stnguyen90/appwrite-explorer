import { useQuery, UseQueryResult } from "react-query";
import { LocalStorageKey, QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";

export interface DocumentList {
  documents: { [key: string]: string | number | boolean }[];
  sum: number;
}

export interface ListDocumentsOptions {
  limit: number;
  offset: number;
}

export const useDocuments = (
  collectionId: string,
  options: ListDocumentsOptions
): UseQueryResult<DocumentList | null, unknown> => {
  const appwrite = useAppwrite();

  return useQuery(
    [QueryKey.DOCUMENTS, collectionId, options],
    async () => {
      if (!appwrite || !collectionId) return null;

      const result = await appwrite.database.listDocuments<DocumentList>(
        collectionId,
        [],
        options.limit,
        options.offset
      );

      localStorage.setItem(LocalStorageKey.COLLECTION, collectionId);
      return result;
    },
    { enabled: !!appwrite || !collectionId }
  );
};

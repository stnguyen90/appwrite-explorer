import { useQuery } from "react-query";
import { LocalStorageKey, QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";

export const useDocuments = (collectionId: string) => {
  const appwrite = useAppwrite();

  return useQuery(
    [QueryKey.DOCUMENTS, collectionId],
    async () => {
      if (!appwrite || !collectionId) return null;

      const result = await appwrite.database.listDocuments<{
        documents: { [key: string]: any }[];
        sum: number;
      }>(collectionId);

      localStorage.setItem(LocalStorageKey.COLLECTION, collectionId);
      return result;
    },
    { enabled: !!appwrite }
  );
};

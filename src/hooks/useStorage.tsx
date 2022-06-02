import { Models } from "appwrite";
import { useQuery, UseQueryResult } from "react-query";
import { LocalStorageKey, QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";

export interface ListFilesOptions {
  limit: number;
  offset: number;
}

export const useStorage = (
  bucketId: string,
  options: ListFilesOptions
): UseQueryResult<Models.FileList | null, unknown> => {
  const appwrite = useAppwrite();

  return useQuery(
    [QueryKey.STORAGE, bucketId, options],
    async () => {
      if (!appwrite || !bucketId) return null;

      const result = await appwrite.storage.listFiles(
        bucketId,
        undefined,
        options.limit,
        options.offset,
        undefined,
        undefined,
        "DESC"
      );

      localStorage.setItem(LocalStorageKey.BUCKET, bucketId);
      return result;
    },
    { enabled: !!appwrite }
  );
};

import { Models, Storage } from "appwrite";
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
  const client = useAppwrite();

  return useQuery(
    [QueryKey.STORAGE, bucketId, options],
    async () => {
      if (!client || !bucketId) return null;

      const storage = new Storage(client);

      const result = await storage.listFiles(
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
    { enabled: !!client }
  );
};

import { useQuery, UseQueryResult } from "react-query";
import { QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";
import { CommonListOptions, FileList } from "../interfaces";

export const useStorage = (
  options: CommonListOptions
): UseQueryResult<FileList | null, unknown> => {
  const appwrite = useAppwrite();

  return useQuery(
    [QueryKey.STORAGE, options],
    async () => {
      if (!appwrite) return null;

      const result = await appwrite.storage.listFiles<FileList>(
        undefined,
        options.limit,
        options.offset
      );

      return result;
    },
    { enabled: !!appwrite }
  );
};

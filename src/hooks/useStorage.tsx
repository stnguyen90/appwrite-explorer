import { useQuery, UseQueryResult } from "react-query";
import { QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";

export interface FileList {
  files: File[];
  sum: number;
}

export interface File {
  $id: string;
  $permissions: Permissions;
  name: string;
  dateCreated: number;
  signature: string;
  mimeType: string;
  sizeOriginal: number;
}

export interface Permissions {
  read: string[];
  write: string[];
}

export interface ListFilesOptions {
  limit: number;
  offset: number;
}

export const useStorage = (
  options: ListFilesOptions
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

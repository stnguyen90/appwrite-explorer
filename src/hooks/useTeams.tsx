import { Models } from "appwrite";
import { useQuery, UseQueryResult } from "react-query";
import { QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";

export interface ListTeamsOptions {
  limit: number;
  offset: number;
  orderType: "ASC" | "DESC";
  search: string;
}

export const useTeams = (
  options: ListTeamsOptions
): UseQueryResult<Models.TeamList | null, unknown> => {
  const appwrite = useAppwrite();

  return useQuery(
    [QueryKey.TEAMS, options],
    async () => {
      if (!appwrite) return null;

      const result = await appwrite.teams.list(
        options.search != "" ? options.search : undefined,
        options.limit,
        options.offset,
        undefined,
        undefined,
        options.orderType
      );

      return result;
    },
    { enabled: !!appwrite }
  );
};

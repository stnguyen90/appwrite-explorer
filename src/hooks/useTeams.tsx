import { useQuery, UseQueryResult } from "react-query";
import { QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";
import { TeamsList } from "../interfaces";

export interface ListTeamsOptions {
  limit: number;
  offset: number;
  orderType: "ASC" | "DESC";
  search: string;
}

export const useTeams = (
  options: ListTeamsOptions
): UseQueryResult<TeamsList | null, unknown> => {
  const appwrite = useAppwrite();

  return useQuery(
    [QueryKey.TEAMS, options],
    async () => {
      if (!appwrite) return null;

      const result = await appwrite.teams.list<TeamsList>(
        options.search != "" ? options.search : undefined,
        options.limit,
        options.offset,
        options.orderType
      );

      return result;
    },
    { enabled: !!appwrite }
  );
};

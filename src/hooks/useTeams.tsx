import { type Models, Query, Teams } from "appwrite";
import { useQuery, type UseQueryResult } from "react-query";
import { QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";

export interface ListTeamsOptions {
  limit: number;
  offset: number;
  orderType: "ASC" | "DESC";
  search: string;
}

export const useTeams = (
  options: ListTeamsOptions,
): UseQueryResult<Models.TeamList<Models.Preferences> | null, unknown> => {
  const client = useAppwrite();

  return useQuery(
    [QueryKey.TEAMS, options],
    async () => {
      if (!client) return null;

      const teams = new Teams(client);

      const result = await teams.list(
        [
          Query.limit(options.limit),
          Query.offset(options.offset),
          options.orderType === "DESC"
            ? Query.orderDesc("")
            : Query.orderAsc(""),
        ],
        options.search !== "" ? options.search : undefined,
      );

      return result;
    },
    { enabled: !!client },
  );
};

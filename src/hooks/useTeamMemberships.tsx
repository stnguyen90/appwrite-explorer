import { Models, Query, Teams } from "appwrite";
import { useQuery, UseQueryResult } from "react-query";
import { QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";

export interface ListTeamMembershipsOptions {
  id: string;
  limit: number;
  offset: number;
  orderType: "ASC" | "DESC";
  search: string;
}

export const useTeamMemberships = (
  options: ListTeamMembershipsOptions
): UseQueryResult<Models.MembershipList | null, unknown> => {
  const client = useAppwrite();

  return useQuery(
    [QueryKey.TEAM_MEMBERSHIPS, options],
    async () => {
      if (!client) return null;

      const teams = new Teams(client);

      const result = await teams.listMemberships(
        options.id,
        [
          Query.limit(options.limit),
          Query.offset(options.offset),
          options.orderType === "DESC"
            ? Query.orderDesc("")
            : Query.orderAsc(""),
        ],
        options.search != "" ? options.search : undefined
      );

      return result;
    },
    { enabled: !!client }
  );
};

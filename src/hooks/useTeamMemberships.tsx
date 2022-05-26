import { Models } from "appwrite";
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
  const appwrite = useAppwrite();

  return useQuery(
    [QueryKey.TEAM_MEMBERSHIPS, options],
    async () => {
      if (!appwrite) return null;

      const result = await appwrite.teams.getMemberships(
        options.id,
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

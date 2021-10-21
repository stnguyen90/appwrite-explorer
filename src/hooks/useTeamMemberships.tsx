import { useQuery, UseQueryResult } from "react-query";
import { QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";
import { MembershipsList } from "../interfaces";

export interface ListTeamMembershipsOptions {
  id: string;
  limit: number;
  offset: number;
  orderType: "ASC" | "DESC";
  search: string;
}

export const useTeamMemberships = (
  options: ListTeamMembershipsOptions
): UseQueryResult<MembershipsList | null, unknown> => {
  const appwrite = useAppwrite();

  return useQuery(
    [QueryKey.TEAM_MEMBERSHIPS, options],
    async () => {
      if (!appwrite) return null;

      const result = await appwrite.teams.getMemberships<MembershipsList>(
        options.id,
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

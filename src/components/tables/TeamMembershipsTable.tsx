import {
  Box,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Models } from "appwrite";
import React from "react";

interface Data {
  $id: string;
  userId: string;
  userName: string;
  userEmail: string;
  invited: string;
  joined: string;
  roles: string;
}

export const TeamMembershipsTable = (
  props: Models.MembershipList,
): JSX.Element => {
  const data = props.memberships.map((f) => {
    const { invited, joined, roles, ...rest } = f;
    return {
      ...rest,
      invited: new Date(invited).toLocaleString(),
      joined: joined ? new Date(joined).toLocaleString() : "",
      roles: roles.join(", "),
    };
  });
  const columns = React.useMemo<
    { header: string; accessor: keyof Data; isNumeric?: boolean }[]
  >(
    () => [
      {
        header: "ID",
        accessor: "$id",
      },
      {
        header: "User ID",
        accessor: "userId",
      },
      {
        header: "Name",
        accessor: "userName",
      },
      {
        header: "Email",
        accessor: "userEmail",
      },
      {
        header: "Invited",
        accessor: "invited",
      },
      {
        header: "Joined",
        accessor: "joined",
      },
      {
        header: "Roles",
        accessor: "roles",
      },
    ],
    [],
  );

  return (
    <Box overflowX="auto" width="full">
      <Table variant="striped">
        <TableCaption>
          Showing {data.length} out of {props.total} teams
        </TableCaption>

        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th key={column.header}>{column.header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row) => {
            return (
              <Tr key={row.$id}>
                {columns.map((column) => (
                  <Td key={column.accessor}>{row[column.accessor]}</Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

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
import React from "react";
import { Membership } from "../../interfaces";

interface Data {
  $id: string;
  userId: string;
  name: string;
  email: string;
  invited: string;
  joined: string;
  roles: string;
}

export const TeamMembershipsTable = (props: {
  memberships: Membership[];
  total: number;
}): JSX.Element => {
  const data = props.memberships.map((f) => {
    const { invited, joined, roles, ...rest } = f;
    return {
      ...rest,
      invited: new Date(invited * 1000).toLocaleString(),
      joined: joined > 0 ? new Date(joined * 1000).toLocaleString() : "",
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
        accessor: "name",
      },
      {
        header: "Email",
        accessor: "email",
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
    []
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

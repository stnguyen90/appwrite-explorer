import {
  Box,
  Link,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import type { Models } from "appwrite";
import React, { ReactElement } from "react";
import { Link as RouterLink } from "react-router-dom";

interface Data {
  $id: string;
  $createdAt: string;
  name: string;
  total: number;
}

export const TeamsTable = (
  props: Models.TeamList<Models.Preferences>,
): ReactElement => {
  const data = props.teams.map((f) => {
    const { $createdAt, ...rest } = f;
    return {
      ...rest,
      $createdAt: new Date($createdAt).toLocaleString(),
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
        header: "Name",
        accessor: "name",
      },
      {
        header: "Members",
        accessor: "total",
      },
      {
        header: "Created",
        accessor: "$createdAt",
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
          {data.map((row: Data) => {
            return (
              <Tr key={row.$id}>
                {columns.map((column) => (
                  <Td key={column.accessor}>
                    {column.accessor === "total" ? (
                      <Link
                        color="pink.500"
                        as={RouterLink}
                        to={`/teams/${row.$id}`}
                      >
                        {row[column.accessor]}
                      </Link>
                    ) : (
                      row[column.accessor]
                    )}
                  </Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

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
import { Link as RouterLink } from "react-router-dom";
import React from "react";
import { Models } from "appwrite";

interface Data {
  $id: string;
  dateCreated: string;
  name: string;
  total: number;
}

export const TeamsTable = (props: Models.TeamList): JSX.Element => {
  const data = props.teams.map((f) => {
    const { dateCreated, ...rest } = f;
    return {
      ...rest,
      dateCreated: new Date(dateCreated * 1000).toLocaleString(),
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
        accessor: "dateCreated",
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
          {data.map((row: Data) => {
            return (
              <Tr key={row.$id}>
                {columns.map((column) => (
                  <Td key={column.accessor}>
                    {column.accessor == "total" ? (
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

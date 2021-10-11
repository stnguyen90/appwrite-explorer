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
import { Team } from "../interfaces";

interface Data {
  $id: string;
  dateCreated: string;
  name: string;
  sum: number;
}

export const TeamsTable = (props: {
  teams: Team[];
  total: number;
}): JSX.Element => {
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
        accessor: "sum",
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

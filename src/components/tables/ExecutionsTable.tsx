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
  $read: string;
  functionId: string;
  $createdAt: string;
  trigger: string;
  status: string;
  statusCode: number;
  response: string;
  stderr: string;
  time: number;
}

export const ExecutionsTable = (props: Models.ExecutionList): JSX.Element => {
  const data = props.executions.map((e) => {
    const { $read, $createdAt, ...rest } = e;
    return {
      ...rest,
      $createdAt: new Date($createdAt * 1000).toLocaleString(),
      $read: $read.join(", "),
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
        header: "Read Permissions",
        accessor: "$read",
      },
      {
        header: "Created",
        accessor: "$createdAt",
      },
      {
        header: "Trigger",
        accessor: "trigger",
      },
      {
        header: "Status",
        accessor: "status",
      },
      {
        header: "Status Code",
        accessor: "statusCode",
      },
      {
        header: "Runtime (s)",
        accessor: "time",
      },
      {
        header: "Output",
        accessor: "response",
      },
      {
        header: "Errors",
        accessor: "stderr",
      },
    ],
    []
  );

  return (
    <Box overflowX="auto" width="full">
      <Table variant="striped">
        <TableCaption>
          Showing {data.length} out of {props.total} executions
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

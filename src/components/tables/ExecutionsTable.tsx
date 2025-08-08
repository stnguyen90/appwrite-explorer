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
import type { Models } from "appwrite";
import React, { ReactElement } from "react";

interface Data {
  $id: string;
  $permissions: string;
  functionId: string;
  $createdAt: string;
  trigger: string;
  status: string;
  responseStatusCode: number;
  responseBody: string;
  duration: number;
}

export const ExecutionsTable = (props: Models.ExecutionList): ReactElement => {
  const data = props.executions.map((e) => {
    const { $permissions, $createdAt, ...rest } = e;
    return {
      ...rest,
      $createdAt: new Date($createdAt).toLocaleString(),
      $permissions: $permissions.join(", "),
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
        header: "Permissions",
        accessor: "$permissions",
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
        accessor: "responseStatusCode",
      },
      {
        header: "Runtime (s)",
        accessor: "duration",
      },
      {
        header: "Output",
        accessor: "responseBody",
      },
    ],
    [],
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

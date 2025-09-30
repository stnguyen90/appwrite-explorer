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
import React, { ReactElement } from "react";

interface Data {
  $id: string;
  $permissions: string;
  name: string;
  $createdAt: string;
  signature: string;
  mimeType: string;
  sizeOriginal: number;
}

export const StorageTable = (props: Models.FileList): ReactElement => {
  const data = props.files.map((f) => {
    const { $permissions, $createdAt, sizeOriginal, ...rest } = f;
    return {
      ...rest,
      $createdAt: new Date($createdAt).toLocaleString(),
      sizeOriginal: sizeOriginal / 1000, // KB
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
        header: "Name",
        accessor: "name",
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
        header: "Signature",
        accessor: "signature",
      },

      {
        header: "Mime Type",
        accessor: "mimeType",
      },

      {
        header: "Size (KB)",
        accessor: "sizeOriginal",
      },
    ],
    [],
  );

  return (
    <Box overflowX="auto" width="full" bg="white">
      <Table variant="striped">
        <TableCaption>
          Showing {data.length} out of {props.total} files
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

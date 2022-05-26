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
  read: string;
  write: string;
  name: string;
  dateCreated: string;
  signature: string;
  mimeType: string;
  sizeOriginal: number;
}

export const StorageTable = (props: Models.FileList): JSX.Element => {
  const data = props.files.map((f) => {
    const { $read, $write, dateCreated, sizeOriginal, ...rest } = f;
    return {
      ...rest,
      dateCreated: new Date(dateCreated * 1000).toLocaleString(),
      sizeOriginal: sizeOriginal / 1000, // KB
      read: $read.join(", "),
      write: $write.join(", "),
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
        header: "Read Permissions",
        accessor: "read",
      },
      {
        header: "Write Permissions",
        accessor: "write",
      },
      {
        header: "Created",
        accessor: "dateCreated",
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
    []
  );

  return (
    <Box overflowX="auto" width="full">
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

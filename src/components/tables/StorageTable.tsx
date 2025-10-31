import {
  Box,
  IconButton,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import { Models, Storage } from "appwrite";
import React, { ReactElement } from "react";
import { useAppwrite } from "../../contexts/appwrite";

interface Data {
  $id: string;
  $permissions: string;
  name: string;
  $createdAt: string;
  signature: string;
  mimeType: string;
  sizeOriginal: number;
}

interface StorageTableProps extends Models.FileList {
  bucketId: string;
}

export const StorageTable = (props: StorageTableProps): ReactElement => {
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

  const client = useAppwrite();

  const getDownloadUrl = (fileId: string): string | null => {
    if (!client || !props.bucketId || !fileId) return null;

    const storage = new Storage(client);
    return storage.getFileDownload({
      bucketId: props.bucketId,
      fileId,
    });
  };

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
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row: Data) => {
            return (
              <Tr key={row.$id}>
                {columns.map((column) => (
                  <Td key={column.accessor}>{row[column.accessor]}</Td>
                ))}
                <Td textAlign="center">
                  <IconButton
                    as="a"
                    href={getDownloadUrl(row.$id) || undefined}
                    aria-label="Download file"
                    icon={<DownloadIcon />}
                    size="sm"
                    colorScheme="pink"
                    variant="ghost"
                    isDisabled={!getDownloadUrl(row.$id)}
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

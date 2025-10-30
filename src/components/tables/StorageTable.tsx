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
  useToast,
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
  const toast = useToast();

  const handleDownload = (fileId: string) => {
    if (!client) return;

    // Validate parameters
    if (!props.bucketId || !fileId) {
      toast({
        title: "Error downloading file.",
        description: "Bucket ID and File ID are required.",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const storage = new Storage(client);
      const url = storage.getFileDownload({
        bucketId: props.bucketId,
        fileId,
      });

      // Create a temporary anchor element to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = ""; // Let the browser determine the filename from Content-Disposition header
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({
        title: "Error downloading file.",
        description:
          error instanceof Error ? error.message : "Unable to download file.",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    }
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
                <Td>
                  <IconButton
                    aria-label="Download file"
                    icon={<DownloadIcon />}
                    size="sm"
                    colorScheme="pink"
                    variant="ghost"
                    onClick={() => handleDownload(row.$id)}
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

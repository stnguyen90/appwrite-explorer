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
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import { DownloadIcon, ViewIcon } from "@chakra-ui/icons";
import { Models, Storage } from "appwrite";
import React, { ReactElement, useState } from "react";
import { useAppwrite } from "../../contexts/appwrite";
import { UpdateFileModal } from "../modals/UpdateFileModal";
import { isViewableMediaType } from "../../utils/mediaTypeDetector";

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
  const [selectedFile, setSelectedFile] = useState<Models.File | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const getViewUrl = (fileId: string): string | null => {
    if (!client || !props.bucketId || !fileId) return null;

    const storage = new Storage(client);
    return storage.getFileView({
      bucketId: props.bucketId,
      fileId,
    });
  };

  const handleViewFile = (fileId: string) => {
    const viewUrl = getViewUrl(fileId);
    if (viewUrl) {
      window.open(viewUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleFileClick = (fileId: string) => {
    const file = props.files.find((f) => f.$id === fileId);
    if (file) {
      setSelectedFile(file);
      onOpen();
    }
  };

  const handleModalClose = () => {
    setSelectedFile(null);
    onClose();
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
                  <Td
                    key={column.accessor}
                    cursor="pointer"
                    onClick={() => handleFileClick(row.$id)}
                    _hover={{ bg: "gray.50" }}
                  >
                    {row[column.accessor]}
                  </Td>
                ))}
                <Td textAlign="center">
                  <HStack spacing={2} justify="center">
                    {isViewableMediaType(row.mimeType) && (
                      <IconButton
                        aria-label="View file"
                        icon={<ViewIcon />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewFile(row.$id);
                        }}
                        isDisabled={!getViewUrl(row.$id)}
                      />
                    )}
                    <IconButton
                      as="a"
                      href={getDownloadUrl(row.$id) || undefined}
                      aria-label="Download file"
                      icon={<DownloadIcon />}
                      size="sm"
                      colorScheme="pink"
                      variant="ghost"
                      isDisabled={!getDownloadUrl(row.$id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </HStack>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {selectedFile && (
        <UpdateFileModal
          file={selectedFile}
          bucketId={props.bucketId}
          isOpen={isOpen}
          onClose={handleModalClose}
        />
      )}
    </Box>
  );
};

import {
  Box,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import React, { ReactElement, useState } from "react";
import { Models } from "appwrite";
import { UpdateDocumentModal } from "../modals/UpdateDocumentModal";

interface Data {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string;
  data: string;
}

export const DatabasesTable = (
  props: Models.DocumentList<Models.Document>,
): ReactElement => {
  const data = props.documents.map((f) => {
    const { $id, $createdAt, $updatedAt, $permissions } = f;
    return {
      $id,
      $createdAt: new Date($createdAt).toLocaleString(),
      $updatedAt: new Date($updatedAt).toLocaleString(),
      $permissions: $permissions.join(", "),
      data: JSON.stringify(f, null, 2),
    };
  });
  const [document, setDocument] = useState<Models.Document | null>(null);

  const columns = React.useMemo<
    { header: string; accessor: keyof Data; isNumeric?: boolean }[]
  >(
    () => [
      {
        header: "ID",
        accessor: "$id",
      },
      {
        header: "Created At",
        accessor: "$createdAt",
      },
      {
        header: "Updated At",
        accessor: "$updatedAt",
      },
      {
        header: "Permissions",
        accessor: "$permissions",
      },
      {
        header: "Data",
        accessor: "data",
      },
    ],
    [],
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const closeAndClear = () => {
    setDocument(null);
    onClose();
  };

  return (
    <Box overflowX="auto" width="full">
      <Table variant="striped">
        <TableCaption>
          Showing {data.length} out of {props.total} documents
        </TableCaption>

        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th key={column.header}>{column.header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row: Data, i) => {
            return (
              <Tr key={row.$id}>
                {columns.map((column) => (
                  <Td key={column.accessor}>
                    {column.accessor == "data" ? (
                      <>
                        <Button
                          variant="link"
                          color="pink.500"
                          onClick={() => {
                            const document = props.documents[i];
                            if (!document) return;
                            setDocument(document);
                            onOpen();
                          }}
                        >
                          <Text isTruncated maxWidth={100}>
                            {row[column.accessor]}
                          </Text>
                        </Button>
                      </>
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

      {document && (
        <UpdateDocumentModal
          document={document}
          isOpen={isOpen}
          onClose={closeAndClear}
        />
      )}
    </Box>
  );
};

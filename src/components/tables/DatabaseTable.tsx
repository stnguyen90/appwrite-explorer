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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Models } from "appwrite";

interface Data {
  $id: string;
  read: string;
  write: string;
  data: string;
}

export const DatabaseTable = (
  props: Models.DocumentList<Models.Document>
): JSX.Element => {
  const data = props.documents.map((f) => {
    const { $id, $read, $write } = f;
    return {
      $id,
      read: $read.join(", "),
      write: $write.join(", "),
      data: JSON.stringify(f, null, 2),
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
        header: "Read",
        accessor: "read",
      },
      {
        header: "Write",
        accessor: "write",
      },
      {
        header: "Data",
        accessor: "data",
      },
    ],
    []
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalBody, setModalBody] = useState("");

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
          {data.map((row: Data) => {
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
                            setModalBody(row[column.accessor]);
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
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Editor
              height="50vh"
              defaultLanguage="json"
              options={{
                readOnly: true,
                minimap: {
                  enabled: false,
                },
              }}
              value={modalBody}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="pink" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

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
import { RealtimeResponseEvent } from "appwrite";

interface Data {
  event: string;
  channels: string;
  timestamp: string;
  payload: string;
}

export const RealtimeTable = (props: {
  payloads: RealtimeResponseEvent<Record<string, any>>[];
}): JSX.Element => {
  const data = props.payloads.map((f) => {
    const { channels, timestamp, payload, ...rest } = f;
    return {
      ...rest,
      channels: channels.join(", "),
      timestamp: new Date(timestamp * 1000).toLocaleString(),
      payload: JSON.stringify(payload, null, 2),
    };
  });

  const columns = React.useMemo<
    { header: string; accessor: keyof Data; isNumeric?: boolean }[]
  >(
    () => [
      {
        header: "Event",
        accessor: "event",
      },
      {
        header: "Channels",
        accessor: "channels",
      },
      {
        header: "Timestamp",
        accessor: "timestamp",
      },
      {
        header: "Payload",
        accessor: "payload",
      },
    ],
    []
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalBody, setModalBody] = useState("");

  return (
    <Box overflowX="auto" width="full">
      <Table variant="striped">
        <TableCaption>Showing {data.length} events</TableCaption>

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
              <Tr key={row.timestamp}>
                {columns.map((column) => (
                  <Td key={column.accessor}>
                    {column.accessor == "payload" ? (
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
          <ModalHeader>Payload</ModalHeader>
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

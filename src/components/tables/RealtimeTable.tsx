import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { RealtimeResponseEvent } from "appwrite";
import React, { useState } from "react";

interface Data {
  events: string;
  channels: string;
  timestamp: string;
  payload: string;
}

export const RealtimeTable = (props: {
  payloads: RealtimeResponseEvent<Record<string, unknown>>[];
}): JSX.Element => {
  const data = props.payloads.map((f) => {
    const { events, channels, timestamp, payload, ...rest } = f;
    return {
      ...rest,
      events: events.join(", "),
      channels: channels.join(", "),
      timestamp: new Date(timestamp).toLocaleString(),
      payload: JSON.stringify(payload, null, 2),
    };
  });

  const columns = React.useMemo<
    { header: string; accessor: keyof Data; isNumeric?: boolean }[]
  >(
    () => [
      {
        header: "Events",
        accessor: "events",
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
    [],
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

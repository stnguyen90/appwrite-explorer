import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Editor, { OnChange } from "@monaco-editor/react";
import { Databases } from "appwrite";
import React, { ReactElement, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { QueryKey } from "../../constants";
import { useAppwrite } from "../../contexts/appwrite";

export const NewDocumentModal = (props: {
  databaseId: string;
  collectionId: string;
  isOpen: boolean;
  onClose: () => void;
}): ReactElement => {
  const [documentId, setDocumentId] = useState("unique()");
  const [value, setValue] = useState("{}");
  const appwriteClient = useAppwrite();
  const toast = useToast();
  const queryClient = useQueryClient();

  const onEditorChange: OnChange = (newValue) => {
    if (newValue) {
      setValue(newValue);
    }
  };

  const mutation = useMutation(
    async () => {
      if (!appwriteClient) return;

      const db = new Databases(appwriteClient);

      await db.createDocument(
        props.databaseId,
        props.collectionId,
        documentId,
        JSON.parse(value),
      );
    },
    {
      onError: (error: unknown) => {
        // An error happened!
        toast({
          title: "Error creating row.",
          description: `${error}`,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      },
      onSuccess: () => {
        toast({
          title: "Row created.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
        queryClient.invalidateQueries([QueryKey.DOCUMENTS, props.collectionId]);
        props.onClose();
      },
    },
  );

  const onCreateClick = () => {
    mutation.mutate();
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Row</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="start" spacing={5}>
            <Text>
              Enter an ID, the JSON for the new row, and click "Create".
            </Text>
            <FormControl>
              <FormLabel htmlFor="document-id">Row ID</FormLabel>
              <Input
                id="document-id"
                value={documentId}
                onChange={(e) => {
                  setDocumentId(e.target.value);
                }}
              />
            </FormControl>
            <FormLabel htmlFor="document-id">Data</FormLabel>
            <Box borderWidth={1} w="full">
              <Editor
                height="50vh"
                defaultLanguage="json"
                onChange={onEditorChange}
                value={value}
                options={{
                  minimap: {
                    enabled: false,
                  },
                }}
              />
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={props.onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="pink"
            onClick={onCreateClick}
            isLoading={mutation.isLoading}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

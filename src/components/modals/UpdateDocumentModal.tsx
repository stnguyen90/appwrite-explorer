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
import { Databases, Models } from "appwrite";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { QueryKey } from "../../constants";
import { useAppwrite } from "../../contexts/appwrite";

export const UpdateDocumentModal = (props: {
  document: Models.Document;
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element => {
  const {
    $databaseId,
    $collectionId,
    $id,
    $permissions,
    $createdAt,
    $updatedAt,
    ...data
  } = props.document;
  const [value, setValue] = useState(JSON.stringify(data, null, 2));
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

      const data = JSON.parse(value);
      const db = new Databases(appwriteClient);
      await db.updateDocument($databaseId, $collectionId, $id, data);
    },
    {
      onError: (error: unknown) => {
        // An error happened!
        toast({
          title: "Error updating document.",
          description: `${error}`,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      },
      onSuccess: () => {
        toast({
          title: "Document updated.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
        queryClient.invalidateQueries([QueryKey.DOCUMENTS, $collectionId]);
        props.onClose();
      },
    },
  );

  const updateDocument = () => {
    mutation.mutate();
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Data</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="start" spacing={5}>
            <Text>
              To update the document, edit the JSON below, and click "Update".
            </Text>
            <FormControl>
              <FormLabel htmlFor="document-id">Document ID</FormLabel>
              <Input id="document-id" value={$id} readOnly />
            </FormControl>
            <FormLabel htmlFor="document-id">Data</FormLabel>
            <Box borderWidth={1} w="full">
              <Editor
                height="50vh"
                defaultLanguage="json"
                onChange={onEditorChange}
                options={{
                  minimap: {
                    enabled: false,
                  },
                }}
                value={value}
              />
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={props.onClose}>
            Close
          </Button>
          <Button colorScheme="pink" mr={3} onClick={updateDocument}>
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

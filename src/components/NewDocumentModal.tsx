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
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Editor, { OnChange } from "@monaco-editor/react";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";

export const NewDocumentModal = (props: {
  collectionId: string;
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element => {
  const [value, setValue] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const appwrite = useAppwrite();
  const toast = useToast();
  const queryClient = useQueryClient();

  const onEditorChange: OnChange = (newValue) => {
    if (newValue) {
      setValue(newValue);
    }
  };

  const onCreateClick = async () => {
    if (!appwrite) return;
    try {
      setSubmitting(true);
      await appwrite.database.createDocument(
        props.collectionId,
        JSON.parse(value)
      );
      toast({
        title: "Document created.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      queryClient.invalidateQueries([QueryKey.DOCUMENTS, props.collectionId]);
      props.onClose();
    } catch (error) {
      toast({
        title: "Error creating document.",
        description: `${error}`,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Document</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="start" spacing={5}>
            <Text>Enter the JSON for the new document and click "Create".</Text>
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
              />
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={props.onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="teal"
            onClick={onCreateClick}
            isLoading={isSubmitting}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

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
import { Functions } from "appwrite";
import React, { ReactElement, useState } from "react";
import { useQueryClient } from "react-query";
import { QueryKey } from "../../constants";
import { useAppwrite } from "../../contexts/appwrite";

export const ExecuteNowModal = (props: {
  functionId: string;
  isOpen: boolean;
  onClose: () => void;
}): ReactElement => {
  const [value, setValue] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const client = useAppwrite();
  const toast = useToast();
  const queryClient = useQueryClient();

  const onEditorChange: OnChange = (newValue) => {
    if (newValue) {
      setValue(newValue);
    }
  };

  const onCreateClick = async () => {
    if (!client) return;
    try {
      setSubmitting(true);

      const functions = new Functions(client);

      await functions.createExecution(props.functionId, value);
      toast({
        title: "Function executed.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      queryClient.invalidateQueries([QueryKey.FUNCTIONS, props.functionId]);
      props.onClose();
    } catch (error) {
      toast({
        title: "Error executing function.",
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
        <ModalHeader>Execute Now</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="start" spacing={5}>
            <Text>
              Enter the payload for this execution and click "Execute".
            </Text>
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
            colorScheme="pink"
            onClick={onCreateClick}
            isLoading={isSubmitting}
          >
            Execute
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

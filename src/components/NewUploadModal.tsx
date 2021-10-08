import {
  Button,
  FormControl,
  FormErrorMessage,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
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
import React, { useRef, useState } from "react";
import { FiFile } from "react-icons/fi";
import { useQueryClient } from "react-query";
import { QueryKey } from "../constants";
import { useAppwrite } from "../contexts/appwrite";

export const NewUploadModal = (props: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const appwrite = useAppwrite();
  const toast = useToast();
  const queryClient = useQueryClient();

  const onInputClick = () => {
    fileRef?.current?.click();
  };

  const onFileChange = () => {
    const files = fileRef?.current?.files;
    if (!files) return;
    if (files.length == 0) return;
    setValue(files[0].name);
  };

  const onUploadClick = async () => {
    if (!appwrite) return;
    const files = fileRef?.current?.files;
    if (!files || files.length == 0) {
      setError("A file is required");
      return;
    }
    try {
      setSubmitting(true);
      await appwrite.storage.createFile(files[0]);
      toast({
        title: "File uploaded.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      queryClient.invalidateQueries([QueryKey.STORAGE]);
      setValue("");
      if (fileRef?.current?.files) {
        fileRef.current.files = null;
      }
      props.onClose();
    } catch (error) {
      toast({
        title: "Error uploading file.",
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
        <ModalHeader>Upload File</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="start" spacing={5}>
            <Text>Select a file and click "Upload".</Text>
            <FormControl isInvalid={!!error}>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FiFile} />}
                />
                <input
                  type="file"
                  ref={fileRef}
                  style={{ display: "none" }}
                  onChange={onFileChange}
                ></input>
                <Input
                  placeholder="Your file ..."
                  onClick={onInputClick}
                  value={value}
                  readOnly
                />
              </InputGroup>
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={props.onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="pink"
            onClick={onUploadClick}
            isLoading={isSubmitting}
          >
            Upload
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

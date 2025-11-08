import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
import { Storage } from "appwrite";
import React, { ReactElement, useRef, useState } from "react";
import { FiFile } from "react-icons/fi";
import { useQueryClient } from "react-query";
import { QueryKey } from "../../constants";
import { useAppwrite } from "../../contexts/appwrite";
import { PermissionsInput } from "../inputs/PermissionsInput";

export const NewUploadModal = (props: {
  bucketId: string;
  isOpen: boolean;
  onClose: () => void;
}): ReactElement => {
  const [fileId, setFileId] = useState("unique()");
  const [permissions, setPermissions] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const client = useAppwrite();
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
    if (!client) return;
    const files = fileRef?.current?.files;
    if (!files || files.length == 0) {
      setError("A file is required");
      return;
    }
    try {
      setSubmitting(true);
      const storage = new Storage(client);

      // Filter out empty permissions
      const validPermissions = permissions.filter((p) => p.trim() !== "");

      await storage.createFile({
        bucketId: props.bucketId,
        fileId,
        file: files[0],
        permissions: validPermissions.length > 0 ? validPermissions : undefined,
      });
      toast({
        title: "File uploaded.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      queryClient.invalidateQueries([QueryKey.STORAGE]);
      setValue("");
      setPermissions([]);
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
            <Text>
              Enter an ID, optional permissions, select a file, and click
              "Upload".
            </Text>
            <FormControl>
              <FormLabel htmlFor="file-id">File ID</FormLabel>
              <Input
                id="file-id"
                value={fileId}
                onChange={(e) => {
                  setFileId(e.target.value);
                }}
              />
            </FormControl>
            <PermissionsInput
              permissions={permissions}
              onChange={setPermissions}
            />
            <FormControl isInvalid={!!error}>
              <FormLabel htmlFor="file">File</FormLabel>
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

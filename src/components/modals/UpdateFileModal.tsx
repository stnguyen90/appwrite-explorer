import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Storage, Models } from "appwrite";
import React, { ReactElement, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { QueryKey } from "../../constants";
import { useAppwrite } from "../../contexts/appwrite";
import { PermissionsInput } from "../inputs/PermissionsInput";

export const UpdateFileModal = (props: {
  file: Models.File;
  bucketId: string;
  isOpen: boolean;
  onClose: () => void;
}): ReactElement => {
  const { $id, $permissions, name } = props.file;
  const [permissions, setPermissions] = useState<string[]>($permissions || []);
  const [fileName, setFileName] = useState(name);
  const appwriteClient = useAppwrite();
  const toast = useToast();
  const queryClient = useQueryClient();
  const {
    isOpen: isDeleteAlertOpen,
    onOpen: onDeleteAlertOpen,
    onClose: onDeleteAlertClose,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const mutation = useMutation(
    async () => {
      if (!appwriteClient) return;

      const storage = new Storage(appwriteClient);

      // Filter out empty permissions
      const validPermissions = permissions.filter((p) => p.trim() !== "");

      await storage.updateFile({
        bucketId: props.bucketId,
        fileId: $id,
        name: fileName,
        permissions: validPermissions.length > 0 ? validPermissions : undefined,
      });
    },
    {
      onError: (error: unknown) => {
        // An error happened!
        toast({
          title: "Error updating file.",
          description: `${error}`,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      },
      onSuccess: () => {
        toast({
          title: "File updated.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
        queryClient.invalidateQueries([QueryKey.STORAGE, props.bucketId]);
        props.onClose();
      },
    },
  );

  const updateFile = () => {
    mutation.mutate();
  };

  const deleteMutation = useMutation(
    async () => {
      if (!appwriteClient) return;

      const storage = new Storage(appwriteClient);

      await storage.deleteFile({
        bucketId: props.bucketId,
        fileId: $id,
      });
    },
    {
      onError: (error: unknown) => {
        toast({
          title: "Error deleting file.",
          description: `${error}`,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      },
      onSuccess: () => {
        toast({
          title: "File deleted.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
        queryClient.invalidateQueries([QueryKey.STORAGE, props.bucketId]);
        onDeleteAlertClose();
        props.onClose();
      },
    },
  );

  const deleteFile = () => {
    deleteMutation.mutate();
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>File Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="start" spacing={5}>
            <Text>
              To update the file, edit the name and permissions below, and click
              "Update".
            </Text>
            <FormControl>
              <FormLabel htmlFor="file-id">File ID</FormLabel>
              <Input id="file-id" value={$id} readOnly />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="file-name">Name</FormLabel>
              <Input
                id="file-name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </FormControl>
            <PermissionsInput
              permissions={permissions}
              onChange={setPermissions}
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="red"
            mr="auto"
            onClick={onDeleteAlertOpen}
            isLoading={deleteMutation.isLoading}
            isDisabled={mutation.isLoading}
          >
            Delete
          </Button>
          <Button variant="ghost" mr={3} onClick={props.onClose}>
            Close
          </Button>
          <Button
            colorScheme="pink"
            mr={3}
            onClick={updateFile}
            isLoading={mutation.isLoading}
            isDisabled={deleteMutation.isLoading}
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>

      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete File
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this file? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteAlertClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={deleteFile}
                ml={3}
                isLoading={deleteMutation.isLoading}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Modal>
  );
};

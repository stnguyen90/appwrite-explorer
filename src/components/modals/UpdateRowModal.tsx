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
import { TablesDB, Models } from "appwrite";
import React, { ReactElement, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { QueryKey } from "../../constants";
import { useAppwrite } from "../../contexts/appwrite";
import { PermissionsInput } from "../inputs/PermissionsInput";

export const UpdateRowModal = (props: {
  row: Models.Row;
  isOpen: boolean;
  onClose: () => void;
}): ReactElement => {
  const {
    $databaseId,
    $tableId,
    $id,
    $permissions,
    $createdAt,
    $updatedAt,
    $sequence,
    ...data
  } = props.row;
  const [permissions, setPermissions] = useState<string[]>($permissions || []);
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
      const tablesDB = new TablesDB(appwriteClient);

      // Filter out empty permissions
      const validPermissions = permissions.filter((p) => p.trim() !== "");

      await tablesDB.updateRow({
        databaseId: $databaseId,
        tableId: $tableId,
        rowId: $id,
        data: data,
        permissions: validPermissions.length > 0 ? validPermissions : undefined,
      });
    },
    {
      onError: (error: unknown) => {
        // An error happened!
        toast({
          title: "Error updating row.",
          description: `${error}`,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      },
      onSuccess: () => {
        toast({
          title: "Row updated.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
        queryClient.invalidateQueries([QueryKey.DOCUMENTS, $tableId]);
        props.onClose();
      },
    },
  );

  const updateRow = () => {
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
              To update the row, edit the permissions and JSON below, and click
              "Update".
            </Text>
            <FormControl>
              <FormLabel htmlFor="row-id">Row ID</FormLabel>
              <Input id="row-id" value={$id} readOnly />
            </FormControl>
            <PermissionsInput
              permissions={permissions}
              onChange={setPermissions}
            />
            <FormLabel htmlFor="row-data">Data</FormLabel>
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
          <Button colorScheme="pink" mr={3} onClick={updateRow}>
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

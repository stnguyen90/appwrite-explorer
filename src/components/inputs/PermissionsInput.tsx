import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  VStack,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import React, { ReactElement } from "react";

interface PermissionsInputProps {
  permissions: string[];
  onChange: (permissions: string[]) => void;
}

export const PermissionsInput = ({
  permissions,
  onChange,
}: PermissionsInputProps): ReactElement => {
  const handleAddPermission = () => {
    onChange([...permissions, ""]);
  };

  const handleRemovePermission = (index: number) => {
    const newPermissions = permissions.filter((_, i) => i !== index);
    onChange(newPermissions);
  };

  const handlePermissionChange = (index: number, value: string) => {
    const newPermissions = [...permissions];
    newPermissions[index] = value;
    onChange(newPermissions);
  };

  return (
    <FormControl>
      <FormLabel htmlFor="permissions">Permissions</FormLabel>
      <VStack align="stretch" spacing={2}>
        {permissions.map((permission, index) => (
          <HStack key={index} spacing={2}>
            <Input
              id={`permission-${index}`}
              placeholder='e.g., read("user:123") or write("team:456")'
              value={permission}
              onChange={(e) => handlePermissionChange(index, e.target.value)}
            />
            <IconButton
              aria-label="Remove permission"
              icon={<DeleteIcon />}
              onClick={() => handleRemovePermission(index)}
              colorScheme="red"
              variant="outline"
              size="sm"
            />
          </HStack>
        ))}
        <Box>
          <Button
            leftIcon={<AddIcon />}
            onClick={handleAddPermission}
            size="sm"
            variant="outline"
            colorScheme="pink"
          >
            Add Permission
          </Button>
        </Box>
      </VStack>
    </FormControl>
  );
};

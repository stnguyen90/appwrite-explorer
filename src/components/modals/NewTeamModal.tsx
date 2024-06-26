import { AddIcon } from "@chakra-ui/icons";
import {
  Input,
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
  FormControl,
  FormLabel,
  InputGroup,
  Tag,
  HStack,
  TagCloseButton,
  TagLabel,
  InputRightElement,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Teams } from "appwrite";
import React, { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { QueryKey } from "../../constants";
import { useAppwrite } from "../../contexts/appwrite";

export const NewTeamModal = (props: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element => {
  const [teamId, setTeamId] = useState("unique()");
  const [teamIdError, setTeamIdError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [roles, setRoles] = useState<string[]>(["owner"]);
  const [roleError, setRoleError] = useState("");
  const roleRef = useRef<HTMLInputElement | null>(null);
  const client = useAppwrite();
  const toast = useToast();
  const queryClient = useQueryClient();

  // const {
  //   control,
  //   handleSubmit,
  //   register,
  //   formState: { errors, isSubmitting },
  // } = useForm<IFormInput>({
  //   mode: "all",
  //   defaultValues: {
  //     name: "",
  //     roles: [{ value: "" }],
  //   },
  // });

  // const { fields, append, remove } = useFieldArray<IFormInput, "roles", "id">({
  //   control, // control props comes from useForm (optional: if you are using FormContext)
  //   name: "roles", // unique name for your Field Array
  //   // keyName: "id", default to "id", you can change the key name
  // });

  const mutation = useMutation(
    async () => {
      if (!client) return;

      const teams = new Teams(client);

      await teams.create(teamId, name, roles);
    },
    {
      onError: (error) => {
        // An error happened!
        toast({
          title: "Error creating team.",
          description: `${error}`,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      },
      onSuccess: () => {
        toast({
          title: "Team created.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
        queryClient.invalidateQueries([QueryKey.TEAMS]);
        setRoles([]);
        props.onClose();
      },
    },
  );

  const addRole = () => {
    const { current } = roleRef;
    if (!current) return;
    const { value } = current;
    if (!value) return;

    if (roles.includes(value)) {
      setRoleError("Roles must be unique");
    } else {
      setRoles([...roles, value]);
      current.value = "";
    }
  };

  const onCreateClick = async () => {
    mutation.mutate();
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Team</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="start" spacing={5}>
            <Text>Enter an ID, name, and click "Create".</Text>
            <FormControl isInvalid={!!teamIdError}>
              <FormLabel htmlFor="team-id">Team ID</FormLabel>
              <Input
                id="team-id"
                onChange={(e) => {
                  const { value } = e.target;
                  if (!value) {
                    setTeamIdError("ID is required");
                  } else {
                    setTeamId(value);
                    setTeamIdError("");
                  }
                }}
                value={teamId}
              />
              <FormErrorMessage>{nameError}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!nameError}>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                placeholder="Name"
                onChange={(e) => {
                  const { value } = e.target;
                  if (!value) {
                    setNameError("Name is required");
                  } else {
                    setName(value);
                    setNameError("");
                  }
                }}
              />
              <FormErrorMessage>{nameError}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!roleError}>
              <FormLabel htmlFor="role">Role</FormLabel>
              <HStack spacing={2} mb={2}>
                {roles.map((role) => (
                  <Tag
                    size="md"
                    key={role}
                    borderRadius="full"
                    variant="solid"
                    colorScheme="pink"
                  >
                    <TagLabel>{role}</TagLabel>
                    <TagCloseButton
                      onClick={() => {
                        setRoles(roles.filter((r) => r != role));
                      }}
                    />
                  </Tag>
                ))}
              </HStack>
              <InputGroup size="md">
                <Input
                  id="role"
                  placeholder="Role"
                  pr="4.5rem"
                  ref={roleRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addRole();
                    }
                  }}
                />
                <InputRightElement>
                  <Button
                    aria-label="Add Role"
                    as={AddIcon}
                    h="1.75rem"
                    w="1.25rem"
                    size="xs"
                    colorScheme="pink"
                    variant="link"
                    onClick={() => {
                      addRole();
                    }}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{roleError}</FormErrorMessage>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={props.onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="pink"
            onClick={onCreateClick}
            // isLoading={isSubmitting}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

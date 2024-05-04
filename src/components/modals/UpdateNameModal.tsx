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
  FormErrorMessage,
} from "@chakra-ui/react";
import { Account } from "appwrite";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { QueryKey } from "../../constants";
import { useAppwrite } from "../../contexts/appwrite";
import { useAccount } from "../../hooks/useAccount";

interface IFormInput {
  name: string;
}

export const UpdateNameModal = (props: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element => {
  const { data } = useAccount();
  const client = useAppwrite();
  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (name: string) => {
      if (!client) return;

      const account = new Account(client);

      await account.updateName(name);
    },
    {
      onError: (error) => {
        // An error happened!
        toast({
          title: "Error updating name.",
          description: `${error}`,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      },
      onSuccess: () => {
        toast({
          title: "Name updated.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
        queryClient.invalidateQueries([QueryKey.USER]);
        props.onClose();
      },
    },
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: "all",
    defaultValues: {
      name: data?.name || "Guest",
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (values) => {
    return new Promise<void>((resolve) => {
      mutation.mutate(values.name, { onSettled: resolve });
    });
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Update Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="start" spacing={5}>
              <Text>Enter the name and click "Update".</Text>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  id="name"
                  placeholder="Name"
                  {...register("name", {
                    required: "This is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={props.onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="pink"
              isLoading={mutation.isLoading}
              type="submit"
            >
              Update
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

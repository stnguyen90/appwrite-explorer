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
import React, { ReactElement } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { QueryKey } from "../../constants";
import { useAppwrite } from "../../contexts/appwrite";
import { useAccount } from "../../hooks/useAccount";

interface IFormInput {
  email: string;
  password: string;
}

export const UpdateEmailModal = (props: {
  isOpen: boolean;
  onClose: () => void;
}): ReactElement => {
  const { data } = useAccount();
  const client = useAppwrite();
  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (input: IFormInput) => {
      if (!client) return;

      const account = new Account(client);

      await account.updateEmail({
        email: input.email,
        password: input.password,
      });
    },
    {
      onError: (error) => {
        // An error happened!
        toast({
          title: "Error updating email.",
          description: `${error}`,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      },
      onSuccess: () => {
        toast({
          title: "Email updated.",
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
      email: data?.email || "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (values) => {
    return new Promise<void>((resolve) => {
      mutation.mutate(values, { onSettled: resolve });
    });
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Update Email</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="start" spacing={5}>
              <Text>
                Enter the new email address and your password, then click
                "Update".
              </Text>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  {...register("email", {
                    required: "This is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "This is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.password && errors.password.message}
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

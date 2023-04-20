import {
  AtSignIcon,
  InfoOutlineIcon,
  LinkIcon,
  LockIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { Account, Client, Models } from "appwrite";
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { LocalStorageKey, QueryKey } from "../constants";

export const Login = (props: { client: Client }): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClick = () => setShowPassword(!showPassword);
  const queryClient = useQueryClient();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSignIn = async (values: {
    endpoint: string;
    project: string;
    email: string;
    password: string;
  }) => {
    const { endpoint, project, email, password } = values;

    const { client } = props;

    client.setEndpoint(endpoint);
    client.setProject(project);

    const account = new Account(client);

    try {
      await account.createEmailSession(email, password);
      localStorage.setItem(LocalStorageKey.ENDPOINT, endpoint);
      localStorage.setItem(LocalStorageKey.PROJECT, project);
      queryClient.invalidateQueries(QueryKey.USER);
    } catch (error) {
      toast({
        title: "Error signing in.",
        description: `${error}`,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const onContinueAsGuest = async (values: {
    endpoint: string;
    project: string;
    email: string;
    password: string;
  }) => {
    const { endpoint, project } = values;

    const { client } = props;

    client.setEndpoint(endpoint);
    client.setProject(project);
    localStorage.setItem(LocalStorageKey.ENDPOINT, endpoint);
    localStorage.setItem(LocalStorageKey.PROJECT, project);

    queryClient.setQueryData<Models.Account<Models.Preferences>>(
      QueryKey.USER,
      () => {
        return {
          $id: "",
          $createdAt: 0,
          $updatedAt: 0,
          phone: "",
          phoneVerification: false,
          email: "",
          emailVerification: false,
          name: "Guest",
          passwordUpdate: 0,
          prefs: {},
          registration: 0,
          status: false,
        };
      }
    );
  };

  return (
    <Center minH="100vh" p={2}>
      <Container
        minH="md"
        minW="xs"
        borderWidth="1px"
        borderRadius="md"
        bg={useColorModeValue("gray.100", "gray.900")}
        paddingY={4}
      >
        <Center minH="md">
          <VStack w="full">
            <Heading>Sign In</Heading>
            <Text>Login using email and password</Text>
            <VStack w="full">
              <FormControl isInvalid={!!errors.endpoint}>
                <FormLabel htmlFor="endpoint">Endpoint</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<LinkIcon color="gray" />}
                  />
                  <Input
                    id="endpoint"
                    {...register("endpoint", {
                      required: "This is required",
                    })}
                    placeholder="http://appwrite.io/v1"
                  />
                </InputGroup>
                <FormErrorMessage>
                  {errors.endpoint && errors.endpoint.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.project}>
                <FormLabel htmlFor="project">Project ID</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<InfoOutlineIcon color="gray" />}
                  />
                  <Input
                    id="project"
                    {...register("project", {
                      required: "This is required",
                    })}
                    placeholder="Project ID"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit(onContinueAsGuest)();
                      }
                    }}
                  />
                </InputGroup>
                <FormErrorMessage>
                  {errors.project && errors.project.message}
                </FormErrorMessage>
              </FormControl>
              <Box>
                <Button
                  colorScheme="pink"
                  isLoading={isSubmitting}
                  type="submit"
                  size="lg"
                  marginTop={4}
                  onClick={handleSubmit(onContinueAsGuest)}
                >
                  Continue as Guest
                </Button>
              </Box>
              <FormControl isInvalid={errors.email}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<AtSignIcon color="gray" />}
                  />
                  <Input
                    id="email"
                    {...register("email")}
                    placeholder="Email"
                  />
                </InputGroup>
              </FormControl>
              <FormControl isInvalid={errors.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputGroup size="md">
                  <InputLeftElement
                    pointerEvents="none"
                    children={<LockIcon color="gray" />}
                  />
                  <Input
                    pr="4.5rem"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...register("password")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit(onSignIn)();
                      }
                    }}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? "Hide" : "Show"}
                      h="1.75rem"
                      w="1.25rem"
                      size="xm"
                      variant="link"
                      color="gray"
                      as={showPassword ? ViewOffIcon : ViewIcon}
                      onClick={handleClick}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Box>
                <Button
                  colorScheme="pink"
                  isLoading={isSubmitting}
                  type="submit"
                  size="lg"
                  marginTop={4}
                  onClick={handleSubmit(onSignIn)}
                >
                  Sign In
                </Button>
              </Box>
            </VStack>
          </VStack>
        </Center>
      </Container>
    </Center>
  );
};

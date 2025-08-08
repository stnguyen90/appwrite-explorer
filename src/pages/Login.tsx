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
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Account, type Client, type Models } from "appwrite";
import * as React from "react";
import { useState, ReactElement } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { LocalStorageKey, QueryKey } from "../constants";

interface IFormInput {
  endpoint: string;
  project: string;
  email: string;
  password: string;
}

export const Login = (props: { client: Client }): ReactElement => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClick = () => setShowPassword(!showPassword);
  const queryClient = useQueryClient();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    defaultValues: {
      endpoint:
        localStorage.getItem(LocalStorageKey.ENDPOINT) ||
        "https://REGION.cloud.appwrite.io/v1",
      project: localStorage.getItem(LocalStorageKey.PROJECT) || "",
      email: "",
      password: "",
    },
  });

  const onSignIn = async (values: IFormInput) => {
    const { endpoint, project, email, password } = values;

    const { client } = props;

    client.setEndpointRealtime(""); // clear previous value so that setEndpoint() will also set endpointRealtime
    client.setEndpoint(endpoint);
    client.setProject(project);

    const account = new Account(client);

    try {
      await account.createEmailPasswordSession(email, password);
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

  const onContinueAsGuest = async (values: IFormInput) => {
    const { endpoint, project } = values;

    const { client } = props;

    client.setEndpoint(endpoint);
    client.setProject(project);
    localStorage.setItem(LocalStorageKey.ENDPOINT, endpoint);
    localStorage.setItem(LocalStorageKey.PROJECT, project);

    queryClient.setQueryData<Models.User<Models.Preferences>>(
      QueryKey.USER,
      () => {
        return {
          $id: "",
          $createdAt: "",
          $updatedAt: "",
          phone: "",
          phoneVerification: false,
          email: "",
          emailVerification: false,
          name: "Guest",
          passwordUpdate: "",
          prefs: {},
          registration: "",
          status: false,
          accessedAt: "",
          labels: [],
          mfa: false,
          targets: [],
          hash: "",
          hashOptions: {},
          password: "",
        };
      },
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
                  <InputLeftElement pointerEvents="none">
                    <LinkIcon color="gray" />
                  </InputLeftElement>
                  <Input
                    id="endpoint"
                    {...register("endpoint", {
                      required: "This is required",
                    })}
                    placeholder="http://appwrite.io/v1"
                  />
                </InputGroup>
                <FormErrorMessage>{errors.endpoint?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.project}>
                <FormLabel htmlFor="project">Project ID</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <InfoOutlineIcon color="gray" />
                  </InputLeftElement>
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
                <FormErrorMessage>{errors.project?.message}</FormErrorMessage>
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
              <FormControl isInvalid={!!errors.email}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <AtSignIcon color="gray" />
                  </InputLeftElement>
                  <Input
                    id="email"
                    {...register("email")}
                    placeholder="Email"
                  />
                </InputGroup>
              </FormControl>
              <FormControl isInvalid={!!errors.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputGroup size="md">
                  <InputLeftElement pointerEvents="none">
                    <LockIcon color="gray" />
                  </InputLeftElement>
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

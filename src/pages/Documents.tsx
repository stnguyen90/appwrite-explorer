import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SimpleGrid,
  GridItem,
  Flex,
  VStack,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import { LocalStorageKey } from "../constants";
import { ListDocumentOptions, useDocuments } from "../hooks/useDocuments";
import { NewDocumentModal } from "../components/NewDocumentModal";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";

interface IFormInput {
  collection: string;
  limit: number;
  offset: number;
}
export const Documents = (): JSX.Element => {
  const [collectionId, setCollectionId] = useState(
    localStorage.getItem(LocalStorageKey.COLLECTION) || ""
  );
  const [options, setOptions] = useState<ListDocumentOptions>({
    limit: 25,
    offset: 0,
  });
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    mode: "all",
    defaultValues: {
      collection: collectionId,
      limit: options.limit,
      offset: options.offset,
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (values) => {
    return new Promise<void>((resolve) => {
      const { collection, ...rest } = values;
      setCollectionId(collection);
      setOptions((prevState) => {
        return { prevState, ...rest };
      });
      resolve();
    });
  };

  const { isLoading, error, data } = useDocuments(collectionId, options);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <VStack w="full">
      <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={2} spacing={5}>
          <GridItem>
            <FormControl isInvalid={!!errors.collection}>
              <FormLabel htmlFor="collection">Collection ID</FormLabel>
              <Input
                id="collection"
                placeholder="Collection ID"
                {...register("collection", {
                  required: "This is required",
                  minLength: {
                    value: 4,
                    message: "Minimum length should be 4",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.collection && errors.collection.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem />

          <GridItem>
            <FormControl isInvalid={!!errors.limit}>
              <FormLabel htmlFor="limit">Limit</FormLabel>
              <Input
                id="limit"
                placeholder="Limit"
                {...register("limit", {
                  min: 0,
                  max: 100,
                  pattern: /^[0-9]+$/i,
                })}
              />
              <FormErrorMessage>
                {errors.limit && "Limit must be from 0 to 100"}
              </FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isInvalid={!!errors.offset}>
              <FormLabel htmlFor="offset">Offset</FormLabel>
              <Input
                id="offset"
                placeholder="Offset"
                {...register("offset", { min: 0, pattern: /^[0-9]+$/i })}
              />
              <FormErrorMessage>
                {errors.offset && "Offset must be >= 0"}
              </FormErrorMessage>
            </FormControl>
          </GridItem>
        </SimpleGrid>
        <Flex w="full" justifyContent="space-between">
          <Button
            leftIcon={<SearchIcon />}
            mt={4}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
          >
            List Documents
          </Button>

          <Button
            leftIcon={<AddIcon />}
            variant="outline"
            mt={4}
            colorScheme="teal"
            onClick={onOpen}
          >
            New Document
          </Button>
          <NewDocumentModal
            collectionId={collectionId}
            isOpen={isOpen}
            onClose={onClose}
          />
        </Flex>
      </form>

      {isLoading ? (
        <Spinner />
      ) : (
        <Editor
          height="70vh"
          defaultLanguage="json"
          options={{
            readOnly: true,
            minimap: {
              enabled: false,
            },
          }}
          value={JSON.stringify(error ? error : data, null, 2)}
        />
      )}
    </VStack>
  );
};

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
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import { LocalStorageKey } from "../constants";
import { useDocuments } from "../hooks/useDocuments";

export const Documents = (): JSX.Element => {
  const [collectionId, setCollectionId] = useState(
    localStorage.getItem(LocalStorageKey.COLLECTION) || ""
  );
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      collection: collectionId,
    },
  });

  function onSubmit(values: { collection: string }) {
    return new Promise<void>((resolve) => {
      setCollectionId(values.collection);
      resolve();
    });
  }

  const { isLoading, error, data } = useDocuments(collectionId);

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
        </SimpleGrid>
        <Flex w="full" justifyContent="space-between">
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
          >
            List Documents
          </Button>

          <Button mt={4} colorScheme="teal">
            New Document
          </Button>
        </Flex>
      </form>

      {isLoading ? (
        <Spinner />
      ) : (
        <Editor
          height="70vh"
          defaultLanguage="json"
          options={{ readOnly: true }}
          value={JSON.stringify(error ? error : data, null, 2)}
        />
      )}
    </VStack>
  );
};

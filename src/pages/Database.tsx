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
  useDisclosure,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { LocalStorageKey } from "../constants";
import { ListDocumentsOptions, useDocuments } from "../hooks/useDocuments";
import { NewDocumentModal } from "../components/modals/NewDocumentModal";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { DatabaseTable } from "../components/tables/DatabaseTable";
import { useAccount } from "../hooks/useAccount";
import { QueriesInput } from "../components/inputs/QueriesInput";

interface IFormInput {
  database: string;
  collection: string;
  queries: { value: string }[];
}
export const Database = (): JSX.Element => {
  const { data: user } = useAccount();
  const [databaseId, setDatabaseId] = useState(
    localStorage.getItem(LocalStorageKey.DATABASE) || "",
  );
  const [collectionId, setCollectionId] = useState(
    localStorage.getItem(LocalStorageKey.COLLECTION) || "",
  );
  const [options, setOptions] = useState<ListDocumentsOptions>({
    limit: 25,
    offset: 0,
    queries: [],
    orderField: "",
    orderType: "ASC",
  });

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: "all",
    defaultValues: {
      database: databaseId,
      collection: collectionId,
      queries: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray<IFormInput, "queries", "id">(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "queries", // unique name for your Field Array
      // keyName: "id", default to "id", you can change the key name
    },
  );

  const onRemoveClick = (index: number) => {
    remove(index);
  };

  const onAddClick = () => {
    append({ value: "" });
  };

  const onSubmit: SubmitHandler<IFormInput> = (values) => {
    return new Promise<void>((resolve) => {
      const { database, collection, queries: queries, ...rest } = values;
      setDatabaseId(database);
      setCollectionId(collection);
      setOptions((prevState) => {
        return {
          ...prevState,
          ...rest,
          queries: queries.filter((q) => q.value != "").map((q) => q.value),
        };
      });
      resolve();
    });
  };

  const { isLoading, isError, error, data } = useDocuments(
    databaseId,
    collectionId,
    options,
  );

  if (isError) {
    console.log(error);
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  const getQueryOnChange = (index: number) => {
    const q = register(`queries.${index}.value`);
    return q.onChange;
  };

  const getQueryOnBlur = (index: number) => {
    const q = register(`queries.${index}.value`);
    return q.onBlur;
  };

  const getQueryRef = (index: number) => {
    const q = register(`queries.${index}.value`);
    return q.ref;
  };

  return (
    <VStack w="full">
      <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={2} spacing={2}>
          <GridItem>
            <FormControl isInvalid={!!errors.database}>
              <FormLabel htmlFor="database">Database ID</FormLabel>
              <Input
                id="database"
                placeholder="Database ID"
                {...register("database", {
                  required: "This is required",
                  minLength: {
                    value: 4,
                    message: "Minimum length should be 4",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.database && errors.database.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>
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

          <GridItem colSpan={2}>
            <QueriesInput
              fields={fields}
              getQueryOnChange={getQueryOnChange}
              getQueryOnBlur={getQueryOnBlur}
              getQueryRef={getQueryRef}
              onRemoveClick={onRemoveClick}
              onAddClick={onAddClick}
            ></QueriesInput>
          </GridItem>
        </SimpleGrid>
        <Flex w="full" justifyContent="space-between">
          <Button
            leftIcon={<SearchIcon />}
            mt={4}
            colorScheme="pink"
            isLoading={isLoading}
            type="submit"
          >
            List Documents
          </Button>

          {!!user?.$id && (
            <>
              <Button
                leftIcon={<AddIcon />}
                variant="outline"
                mt={4}
                colorScheme="pink"
                onClick={onOpen}
              >
                New Document
              </Button>
              <NewDocumentModal
                databaseId={databaseId}
                collectionId={collectionId}
                isOpen={isOpen}
                onClose={onClose}
              />
            </>
          )}
        </Flex>
      </form>

      {!isLoading &&
        (isError ? (
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <AlertIcon mr={0} />
            <AlertTitle mt={1} mb={1} fontSize="lg">
              Error Code {error?.code || ""}
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              {error?.message || ""}
            </AlertDescription>
          </Alert>
        ) : (
          <DatabaseTable
            documents={data?.documents || []}
            total={data?.total || 0}
          />
        ))}
    </VStack>
  );
};

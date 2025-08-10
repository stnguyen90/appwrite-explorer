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
import React, { ReactElement, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { LocalStorageKey } from "../constants";
import { ListDocumentsOptions, useDocuments } from "../hooks/useDocuments";
import { NewDocumentModal } from "../components/modals/NewDocumentModal";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { DatabasesTable } from "../components/tables/DatabasesTable";
import { QueriesEditor } from "../components/inputs/QueriesEditor";
import { parseQueries } from "../utils/queryParser";

interface IFormInput {
  database: string;
  collection: string;
  queries: string;
}
export const Databases = (): ReactElement => {
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
  const [queriesError, setQueriesError] = useState<string | undefined>();

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: "all",
    defaultValues: {
      database: databaseId,
      collection: collectionId,
      queries: `[
  Query.limit(25)
]`,
    },
  });

  const watchedQueries = watch("queries");

  const onSubmit: SubmitHandler<IFormInput> = (values) => {
    return new Promise<void>((resolve) => {
      const { database, collection, queries: queriesCode, ...rest } = values;

      // Parse the queries from Monaco editor
      const parseResult = parseQueries(queriesCode);

      if (parseResult.error) {
        setQueriesError(parseResult.error);
        resolve();
        return;
      }

      setQueriesError(undefined);
      setDatabaseId(database);
      setCollectionId(collection);
      setOptions((prevState) => ({
        ...prevState,
        ...rest,
        queries: parseResult.queries,
      }));
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
                })}
              />
              <FormErrorMessage>
                {errors.collection && errors.collection.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem colSpan={2}>
            <QueriesEditor
              value={watchedQueries}
              onChange={(value) => setValue("queries", value)}
              error={queriesError}
            />
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
          <DatabasesTable
            documents={data?.documents || []}
            total={data?.total || 0}
          />
        ))}
    </VStack>
  );
};

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  SimpleGrid,
  GridItem,
  Flex,
  VStack,
  useDisclosure,
  InputRightElement,
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
import { AddIcon, CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { LimitInput } from "../components/inputs/LimitInput";
import { OffsetInput } from "../components/inputs/OffsetInput";
import { OrderFieldInput } from "../components/inputs/OrderFieldInput";
import { OrderTypeInput } from "../components/inputs/OrderTypeInput";
import { DatabaseTable } from "../components/tables/DatabaseTable";
import { useAccount } from "../hooks/useAccount";

interface IFormInput {
  database: string;
  collection: string;
  limit: number;
  offset: number;
  queries: { value: string }[];
  orderField: string;
  orderType: "ASC" | "DESC";
}
export const Database = (): JSX.Element => {
  const { data: user } = useAccount();
  const [databaseId, setDatabaseId] = useState(
    localStorage.getItem(LocalStorageKey.DATABASE) || ""
  );
  const [collectionId, setCollectionId] = useState(
    localStorage.getItem(LocalStorageKey.COLLECTION) || ""
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
      limit: options.limit,
      offset: options.offset,
      queries: [{ value: "" }],
      orderField: "",
      orderType: "ASC",
    },
  });

  const { fields, append, remove } = useFieldArray<IFormInput, "queries", "id">(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "queries", // unique name for your Field Array
      // keyName: "id", default to "id", you can change the key name
    }
  );

  const onRemoveClick = (index: number) => {
    return () => {
      remove(index);
    };
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
    options
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
            <FormControl>
              <FormLabel>Queries</FormLabel>
              <VStack justifyContent="flex-start">
                {fields.map((field, index) => {
                  return (
                    <InputGroup key={field.id}>
                      <Input
                        placeholder='attribute.equal("value")'
                        {...register(`queries.${index}.value` as const)}
                      />
                      {index != 0 && (
                        <InputRightElement>
                          <IconButton
                            aria-label="Remove Query"
                            h="1.5rem"
                            w="1rem"
                            size="xm"
                            variant="link"
                            color="pink.500"
                            as={CloseIcon}
                            onClick={onRemoveClick(index)}
                          />
                        </InputRightElement>
                      )}
                    </InputGroup>
                  );
                })}

                <Button
                  leftIcon={<AddIcon />}
                  variant="outline"
                  colorScheme="pink"
                  onClick={onAddClick}
                >
                  Add Filter
                </Button>
              </VStack>
            </FormControl>
          </GridItem>

          <GridItem>
            <LimitInput register={register as any} errors={errors} />
          </GridItem>

          <GridItem>
            <OffsetInput register={register as any} errors={errors} />
          </GridItem>

          <GridItem>
            <OrderFieldInput register={register as any}></OrderFieldInput>
          </GridItem>

          <GridItem>
            <OrderTypeInput register={register as any}></OrderTypeInput>
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

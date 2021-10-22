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
import { OrderCastInput } from "../components/inputs/OrderCastInput";
import { OrderTypeInput } from "../components/inputs/OrderTypeInput";
import { DatabaseTable } from "../components/tables/DatabaseTable";
import { useAccount } from "../hooks/useAccount";

interface IFormInput {
  collection: string;
  limit: number;
  offset: number;
  filters: { value: string }[];
  orderField: string;
  orderType: "ASC" | "DESC";
  orderCast: "string" | "int" | "date" | "time" | "datetime";
  search: string;
}
export const Database = (): JSX.Element => {
  const { data: user } = useAccount();
  const [collectionId, setCollectionId] = useState(
    localStorage.getItem(LocalStorageKey.COLLECTION) || ""
  );
  const [options, setOptions] = useState<ListDocumentsOptions>({
    limit: 25,
    offset: 0,
    filters: [],
    orderField: "",
    orderType: "ASC",
    orderCast: "string",
    search: "",
  });

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: "all",
    defaultValues: {
      collection: collectionId,
      limit: options.limit,
      offset: options.offset,
      filters: [{ value: "" }],
      orderField: "",
      orderType: "ASC",
      orderCast: "string",
      search: "",
    },
  });

  const { fields, append, remove } = useFieldArray<IFormInput, "filters", "id">(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "filters", // unique name for your Field Array
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
      const { collection, filters, ...rest } = values;
      setCollectionId(collection);
      setOptions((prevState) => {
        return {
          ...prevState,
          ...rest,
          filters: filters.filter((f) => f.value != "").map((f) => f.value),
        };
      });
      resolve();
    });
  };

  const { isLoading, isError, error, data } = useDocuments(
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

          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel htmlFor="search">Search</FormLabel>
              <Input
                id="search"
                placeholder="Search Query"
                {...register("search")}
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>Filters</FormLabel>
              <VStack justifyContent="flex-start">
                {fields.map((field, index) => {
                  return (
                    <InputGroup key={field.id}>
                      <Input
                        placeholder="name=John Doe"
                        {...register(`filters.${index}.value` as const)}
                      />
                      {index != 0 && (
                        <InputRightElement>
                          <IconButton
                            aria-label="Remove Filter"
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
            <LimitInput register={register} errors={errors} />
          </GridItem>

          <GridItem>
            <OffsetInput register={register} errors={errors} />
          </GridItem>

          <GridItem>
            <OrderFieldInput register={register}></OrderFieldInput>
          </GridItem>

          <GridItem>
            <OrderCastInput register={register}></OrderCastInput>
          </GridItem>

          <GridItem>
            <OrderTypeInput register={register}></OrderTypeInput>
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
            total={data?.sum || 0}
          />
        ))}
    </VStack>
  );
};

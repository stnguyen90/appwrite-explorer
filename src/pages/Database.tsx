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
  Radio,
  Stack,
  RadioGroup,
  Flex,
  VStack,
  Spinner,
  useDisclosure,
  Box,
  Select,
  InputRightElement,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import { LocalStorageKey } from "../constants";
import { ListDocumentsOptions, useDocuments } from "../hooks/useDocuments";
import { NewDocumentModal } from "../components/NewDocumentModal";
import { AddIcon, CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { LimitInput } from "../components/LimitInput";
import { OffsetInput } from "../components/OffsetInput";

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
    formState: { errors, isSubmitting },
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

  const { isLoading, error, data } = useDocuments(collectionId, options);

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
            <FormControl>
              <FormLabel htmlFor="orderField">Order Field</FormLabel>
              <Input
                id="orderField"
                placeholder="Field Key"
                {...register("orderField")}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel htmlFor="orderCast" defaultValue="string">
                Order Cast
              </FormLabel>

              <Select {...register("orderCast")}>
                <option value="string">String</option>
                <option value="int">Number</option>
                <option value="date">Date</option>
                <option value="time">Time</option>
                <option value="datetime">Datetime</option>
              </Select>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel htmlFor="orderType">Order Type</FormLabel>

              <RadioGroup defaultValue="ASC">
                <Stack direction="row">
                  <Radio {...register("orderType")} value="ASC">
                    Ascending
                  </Radio>
                  <Radio {...register("orderType")} value="DESC">
                    Descending
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </GridItem>
        </SimpleGrid>
        <Flex w="full" justifyContent="space-between">
          <Button
            leftIcon={<SearchIcon />}
            mt={4}
            colorScheme="pink"
            isLoading={isSubmitting}
            type="submit"
          >
            List Documents
          </Button>

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
        </Flex>
      </form>

      {isLoading ? (
        <Spinner />
      ) : (
        <Box width="full" pt={3}>
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
        </Box>
      )}
    </VStack>
  );
};

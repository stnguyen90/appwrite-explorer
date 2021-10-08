import React, { useState } from "react";
import {
  Button,
  Flex,
  GridItem,
  SimpleGrid,
  Spinner,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useStorage } from "../hooks/useStorage";
import { SubmitHandler, useForm } from "react-hook-form";
import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import { LimitInput } from "../components/LimitInput";
import { OffsetInput } from "../components/OffsetInput";
import { StorageTable } from "../components/StorageTable";
import { CommonListOptions } from "../interfaces";
import { NewUploadModal } from "../components/NewUploadModal";

export interface IFormInput {
  limit: number;
  offset: number;
}

export const Storage = (): JSX.Element => {
  const [options, setOptions] = useState<CommonListOptions>({
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
      limit: options.limit,
      offset: options.offset,
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (values) => {
    return new Promise<void>((resolve) => {
      setOptions(values);
      resolve();
    });
  };

  const { isLoading, error, data } = useStorage(options);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <VStack w="full">
      <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={2} spacing={5}>
          <GridItem>
            <LimitInput register={register} errors={errors} />
          </GridItem>
          <GridItem>
            <OffsetInput register={register} errors={errors} />
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
            List Files
          </Button>

          <Button
            leftIcon={<AddIcon />}
            variant="outline"
            mt={4}
            colorScheme="pink"
            onClick={onOpen}
          >
            Upload
          </Button>
          <NewUploadModal isOpen={isOpen} onClose={onClose} />
        </Flex>
      </form>

      {isLoading ? (
        <Spinner />
      ) : (
        <StorageTable
          files={data?.files || []}
          total={data?.sum || 0}
        ></StorageTable>
      )}
    </VStack>
  );
};

import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Input,
  SimpleGrid,
  Spinner,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { SubmitHandler, UseFormRegister, useForm } from "react-hook-form";
import { LimitInput } from "../components/inputs/LimitInput";
import { OffsetInput } from "../components/inputs/OffsetInput";
import { NewUploadModal } from "../components/modals/NewUploadModal";
import { StorageTable } from "../components/tables/StorageTable";
import { LocalStorageKey } from "../constants";
import { useAccount } from "../hooks/useAccount";
import { ListFilesOptions, useStorage } from "../hooks/useStorage";

export interface IFormInput {
  bucket: string;
  limit: number;
  offset: number;
}

export const Storage = (): JSX.Element => {
  const { data: user } = useAccount();
  const [bucketId, setBucketId] = useState(
    localStorage.getItem(LocalStorageKey.BUCKET) || "",
  );
  const [options, setOptions] = useState<ListFilesOptions>({
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
      bucket: bucketId,
      limit: options.limit,
      offset: options.offset,
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (values) => {
    return new Promise<void>((resolve) => {
      setBucketId(values.bucket);
      setOptions(values);
      resolve();
    });
  };

  const { isLoading, data } = useStorage(bucketId, options);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <VStack w="full">
      <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={2} spacing={2}>
          <GridItem>
            <FormControl isInvalid={!!errors.bucket}>
              <FormLabel htmlFor="bucket">Bucket ID</FormLabel>
              <Input
                id="bucket"
                placeholder="Bucket ID"
                {...register("bucket", {
                  required: "This is required",
                  minLength: {
                    value: 4,
                    message: "Minimum length should be 4",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.bucket && errors.bucket.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem />
          <GridItem>
            <LimitInput
              register={
                register as unknown as UseFormRegister<{ limit: number }>
              }
              errors={errors}
            />
          </GridItem>
          <GridItem>
            <OffsetInput
              register={
                register as unknown as UseFormRegister<{ offset: number }>
              }
              errors={errors}
            />
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

          {!!user?.$id && (
            <>
              <Button
                leftIcon={<AddIcon />}
                variant="outline"
                mt={4}
                colorScheme="pink"
                onClick={onOpen}
              >
                Upload
              </Button>
              <NewUploadModal
                bucketId={bucketId}
                isOpen={isOpen}
                onClose={onClose}
              />
            </>
          )}
        </Flex>
      </form>

      {isLoading ? (
        <Spinner />
      ) : (
        <StorageTable
          files={data?.files || []}
          total={data?.total || 0}
        ></StorageTable>
      )}
    </VStack>
  );
};

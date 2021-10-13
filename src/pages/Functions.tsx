import React, { useState } from "react";
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
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import { LimitInput } from "../components/inputs/LimitInput";
import { OffsetInput } from "../components/inputs/OffsetInput";
import { ExecutionsTable } from "../components/tables/ExecutionsTable";
import { LocalStorageKey } from "../constants";
import { CommonListOptions } from "../interfaces";
import { useFunctionExecutions } from "../hooks/useFunctionExecutions";
import { ExecuteNowModal } from "../components/modals/ExecuteNowModal";

export interface IFormInput {
  functionId: string;
  limit: number;
  offset: number;
}

export const Functions = (): JSX.Element => {
  const [functionId, setFunctionId] = useState(
    localStorage.getItem(LocalStorageKey.FUNCTION) || ""
  );
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
      functionId: functionId,
      limit: options.limit,
      offset: options.offset,
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (values) => {
    return new Promise<void>((resolve) => {
      const { functionId, ...rest } = values;
      setFunctionId(functionId);
      setOptions(rest);
      resolve();
    });
  };

  const { isLoading, data } = useFunctionExecutions(functionId, options);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <VStack w="full">
      <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={2} spacing={2}>
          <GridItem>
            <FormControl isInvalid={!!errors.functionId}>
              <FormLabel htmlFor="function">Function ID</FormLabel>
              <Input
                id="function"
                placeholder="Function ID"
                {...register("functionId", {
                  required: "This is required",
                  minLength: {
                    value: 4,
                    message: "Minimum length should be 4",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.functionId && errors.functionId.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem />
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
            List Executions
          </Button>

          <Button
            leftIcon={<AddIcon />}
            variant="outline"
            mt={4}
            colorScheme="pink"
            onClick={onOpen}
          >
            Execute Now
          </Button>
          <ExecuteNowModal
            functionId={functionId}
            isOpen={isOpen}
            onClose={onClose}
          />
        </Flex>
      </form>

      {isLoading ? (
        <Spinner />
      ) : (
        <ExecutionsTable
          executions={data?.executions || []}
          total={data?.sum || 0}
        ></ExecutionsTable>
      )}
    </VStack>
  );
};

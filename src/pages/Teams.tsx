import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  GridItem,
  SimpleGrid,
  Spinner,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { ReactElement, useState } from "react";
import {
  type SubmitHandler,
  type UseFormRegister,
  useForm,
} from "react-hook-form";
import { LimitInput } from "../components/inputs/LimitInput";
import { OffsetInput } from "../components/inputs/OffsetInput";
import { OrderTypeInput } from "../components/inputs/OrderTypeInput";
import { SearchInput } from "../components/inputs/SearchInput";
import { NewTeamModal } from "../components/modals/NewTeamModal";
import { TeamsTable } from "../components/tables/TeamsTable";
import { type ListTeamsOptions, useTeams } from "../hooks/useTeams";

interface IFormInput {
  limit: number;
  offset: number;
  orderType: "ASC" | "DESC";
  search: string;
}
export const Teams = (): ReactElement => {
  const [options, setOptions] = useState<ListTeamsOptions>({
    limit: 25,
    offset: 0,
    orderType: "ASC",
    search: "",
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    mode: "all",
    defaultValues: {
      limit: 25,
      offset: 0,
      orderType: "ASC",
      search: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (values) => {
    console.log(values);
    return new Promise<void>((resolve) => {
      setOptions((prevState) => {
        return {
          ...prevState,
          ...values,
        };
      });
      resolve();
    });
  };

  const { isLoading, data } = useTeams(options);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <VStack w="full">
      <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={2} spacing={2}>
          <GridItem colSpan={2}>
            <SearchInput
              register={
                register as unknown as UseFormRegister<{ search: string }>
              }
            />
          </GridItem>

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

          <GridItem>
            <OrderTypeInput
              register={
                register as unknown as UseFormRegister<{ orderType: string }>
              }
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
            List Teams
          </Button>

          <Button
            leftIcon={<AddIcon />}
            variant="outline"
            mt={4}
            colorScheme="pink"
            onClick={onOpen}
          >
            New Team
          </Button>
          <NewTeamModal isOpen={isOpen} onClose={onClose} />
        </Flex>
      </form>

      {isLoading ? (
        <Spinner />
      ) : (
        <TeamsTable teams={data?.teams || []} total={data?.total || 0} />
      )}
    </VStack>
  );
};

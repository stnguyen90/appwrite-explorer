import {
  Button,
  SimpleGrid,
  GridItem,
  Flex,
  VStack,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ListTeamsOptions, useTeams } from "../hooks/useTeams";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { LimitInput } from "../components/LimitInput";
import { OffsetInput } from "../components/OffsetInput";
import { OrderTypeInput } from "../components/OrderTypeInput";
import { SearchInput } from "../components/SearchInput";
import { TeamsTable } from "../components/TeamsTable";
// import { NewTeamModal } from "../components/NewTeamModal";

interface IFormInput {
  limit: number;
  offset: number;
  orderType: "ASC" | "DESC";
  search: string;
}
export const Teams = (): JSX.Element => {
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
        <SimpleGrid columns={2} spacing={5}>
          <GridItem colSpan={2}>
            <SearchInput register={register}></SearchInput>
          </GridItem>

          <GridItem>
            <LimitInput register={register} errors={errors} />
          </GridItem>

          <GridItem>
            <OffsetInput register={register} errors={errors} />
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
            isLoading={isSubmitting}
            type="submit"
          >
            List Teams
          </Button>

          {/* <Button
            leftIcon={<AddIcon />}
            variant="outline"
            mt={4}
            colorScheme="pink"
            onClick={onOpen}
          >
            New Team
          </Button>
          <NewTeamModal isOpen={isOpen} onClose={onClose} /> */}
        </Flex>
      </form>

      {isLoading ? (
        <Spinner />
      ) : (
        <TeamsTable
          teams={data?.teams || []}
          total={data?.sum || 0}
        ></TeamsTable>
      )}
    </VStack>
  );
};
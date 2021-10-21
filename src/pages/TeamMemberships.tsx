import {
  Button,
  SimpleGrid,
  GridItem,
  Flex,
  VStack,
  Spinner,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  ListTeamMembershipsOptions,
  useTeamMemberships,
} from "../hooks/useTeamMemberships";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { LimitInput } from "../components/inputs/LimitInput";
import { OffsetInput } from "../components/inputs/OffsetInput";
import { OrderTypeInput } from "../components/inputs/OrderTypeInput";
import { SearchInput } from "../components/inputs/SearchInput";
import { useParams } from "react-router";
import { TeamMembershipsTable } from "../components/tables/TeamMembershipsTable";
import { NewTeamMemberModal } from "../components/modals/NewTeamMemberModal";

interface IFormInput {
  id: string;
  limit: number;
  offset: number;
  orderType: "ASC" | "DESC";
  search: string;
}
export const TeamMemberships = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [options, setOptions] = useState<ListTeamMembershipsOptions>({
    id,
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
      id,
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

  const { isLoading, data } = useTeamMemberships(options);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <VStack w="full">
      <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={2} spacing={2}>
          <GridItem>
            <FormControl>
              <FormLabel htmlFor="id">Team ID</FormLabel>
              <Input id="id" value={id} readOnly />
            </FormControl>
          </GridItem>
          <GridItem />

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

          <Button
            leftIcon={<AddIcon />}
            variant="outline"
            mt={4}
            colorScheme="pink"
            onClick={onOpen}
          >
            Invite User
          </Button>
          <NewTeamMemberModal teamId={id} isOpen={isOpen} onClose={onClose} />
        </Flex>
      </form>

      {isLoading ? (
        <Spinner />
      ) : (
        <TeamMembershipsTable
          memberships={data?.memberships || []}
          total={data?.sum || 0}
        ></TeamMembershipsTable>
      )}
    </VStack>
  );
};
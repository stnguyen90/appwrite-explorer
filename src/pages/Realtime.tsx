import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  SimpleGrid,
  Flex,
  VStack,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import { useAppwrite } from "../contexts/appwrite";
import { RealtimeTable } from "../components/tables/RealtimeTable";
import { RealtimeResponseEvent } from "appwrite";

interface IFormInput {
  channels: { name: string; isChecked: boolean }[];
}
export const Realtime = (): JSX.Element => {
  const [channels, setChannels] = useState<string[]>([]);
  const [events, setEvents] = useState<
    RealtimeResponseEvent<Record<string, any>>[]
  >([]);
  const appwrite = useAppwrite();

  useEffect(() => {
    if (!appwrite || channels.length == 0) return;
    // events from the outside scope doesn't update in the subscription callback
    // so we create the scopedEvents so that we can update and persist the data
    const scopedEvents: RealtimeResponseEvent<Record<string, any>>[] = [];
    const unsubscribe = appwrite?.subscribe<
      RealtimeResponseEvent<Record<string, any>>
    >(channels, (response) => {
      scopedEvents.push(response);
      setEvents([...scopedEvents]);
    });
    return unsubscribe;
  }, [channels]);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    mode: "all",
    defaultValues: {
      channels: [
        {
          name: "account",
          isChecked: false,
        },
        {
          name: "collections",
          isChecked: false,
        },
        {
          name: "documents",
          isChecked: false,
        },
        {
          name: "files",
          isChecked: false,
        },
        {
          name: "teams",
          isChecked: false,
        },
        {
          name: "memberships",
          isChecked: false,
        },
        {
          name: "executions",
          isChecked: false,
        },
      ],
    },
  });

  const { fields } = useFieldArray<IFormInput, "channels", "name">({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "channels", // unique name for your Field Array
  });

  const onSubmit: SubmitHandler<IFormInput> = (values) => {
    return new Promise<void>((resolve) => {
      if (!appwrite) {
        resolve();
        return;
      }

      const selectedChannels = values.channels
        .filter((c) => c.isChecked)
        .map((c) => c.name);

      setChannels([...selectedChannels]);

      resolve();
    });
  };

  return (
    <VStack w="full">
      <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.channels}>
          <FormLabel htmlFor="channels">Channels</FormLabel>
          <CheckboxGroup colorScheme="pink">
            <SimpleGrid minChildWidth="200px" spacing={2}>
              {fields.map((field, index) => {
                return (
                  <Checkbox
                    key={field.name}
                    {...register(`channels.${index}.isChecked`)}
                    checked={field.isChecked}
                  >
                    {field.name}
                  </Checkbox>
                );
              })}
            </SimpleGrid>
          </CheckboxGroup>
          <FormErrorMessage>{errors.channels}</FormErrorMessage>
        </FormControl>
        <Flex w="full" justifyContent="space-between">
          <Button
            leftIcon={<SearchIcon />}
            mt={4}
            colorScheme="pink"
            isLoading={isSubmitting}
            type="submit"
          >
            Subscribe
          </Button>
          <Button
            leftIcon={<DeleteIcon />}
            variant="outline"
            mt={4}
            colorScheme="pink"
            onClick={() => {
              setEvents([]);
            }}
          >
            Clear Events
          </Button>
        </Flex>
      </form>

      <RealtimeTable payloads={events}></RealtimeTable>
    </VStack>
  );
};

import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  SimpleGrid,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  VStack,
} from "@chakra-ui/react";
import { RealtimeResponseEvent } from "appwrite";
import React, { useEffect, useRef, useState } from "react";
import { RealtimeTable } from "../components/tables/RealtimeTable";
import { useAppwrite } from "../contexts/appwrite";

export const Realtime = (): JSX.Element => {
  const [channels, setChannels] = useState<string[]>([]);
  const channelRef = useRef<HTMLInputElement | null>(null);
  const [channelError, setChannelError] = useState("");
  const [events, setEvents] = useState<
    RealtimeResponseEvent<Record<string, unknown>>[]
  >([]);
  const client = useAppwrite();

  const addChannel = () => {
    const { current } = channelRef;
    if (!current) return;
    const { value } = current;
    if (!value) return;

    if (channels.includes(value)) {
      setChannelError("Channels must be unique");
    } else {
      setChannels([...channels, value]);
      current.value = "";
    }
  };

  useEffect(() => {
    if (!client || channels.length == 0) return;
    // events from the outside scope doesn't update in the subscription callback
    // so we create the scopedEvents so that we can update and persist the data
    const scopedEvents: RealtimeResponseEvent<Record<string, unknown>>[] = [];
    const unsubscribe = client?.subscribe<
      RealtimeResponseEvent<Record<string, unknown>>
    >(channels, (response) => {
      scopedEvents.push(response);
      setEvents([...scopedEvents]);
    });
    return unsubscribe;
  }, [channels]);

  return (
    <VStack w="full">
      <form style={{ width: "100%" }}>
        <FormControl isInvalid={!!channelError}>
          <FormLabel htmlFor="channels">Channels</FormLabel>
          <Text>
            Refer to the{" "}
            <Link
              color="pink.500"
              href="https://appwrite.io/docs/realtime#channels"
              target="_blank"
            >
              Appwrite Docs
            </Link>{" "}
            for list of available channels.
          </Text>
          <HStack spacing={2} mb={2} mt={2}>
            {channels.map((channel) => (
              <Tag
                size="md"
                key={channel}
                borderRadius="full"
                variant="solid"
                colorScheme="pink"
              >
                <TagLabel>{channel}</TagLabel>
                <TagCloseButton
                  onClick={() => {
                    setChannels(channels.filter((c) => c != channel));
                  }}
                />
              </Tag>
            ))}
          </HStack>
          <SimpleGrid columns={2} spacing={2}>
            <GridItem>
              <InputGroup size="md">
                <Input
                  id="channel"
                  placeholder="Channel"
                  pr="4.5rem"
                  ref={channelRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addChannel();
                      e.preventDefault();
                    }
                  }}
                />
                <InputRightElement>
                  <Button
                    aria-label="Add Channel"
                    as={AddIcon}
                    h="1.75rem"
                    w="1.25rem"
                    size="xs"
                    colorScheme="pink"
                    variant="link"
                    onClick={() => {
                      addChannel();
                    }}
                  />
                </InputRightElement>
              </InputGroup>
            </GridItem>
          </SimpleGrid>
          <FormErrorMessage>{channelError}</FormErrorMessage>
        </FormControl>
        <Flex w="full" justifyContent="end">
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

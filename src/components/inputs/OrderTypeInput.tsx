import {
  FormControl,
  FormLabel,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
import React from "react";
import { UseFormRegister } from "react-hook-form";

export const OrderTypeInput = (props: {
  register: UseFormRegister<{ orderType: string }>;
}): JSX.Element => {
  return (
    <FormControl>
      <FormLabel htmlFor="orderType">Order Type</FormLabel>

      <RadioGroup defaultValue="ASC">
        <Stack direction="row">
          <Radio
            colorScheme="pink"
            {...props.register("orderType")}
            value="ASC"
          >
            Ascending
          </Radio>
          <Radio
            colorScheme="pink"
            {...props.register("orderType")}
            value="DESC"
          >
            Descending
          </Radio>
        </Stack>
      </RadioGroup>
    </FormControl>
  );
};

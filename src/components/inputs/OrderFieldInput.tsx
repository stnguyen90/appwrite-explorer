import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { UseFormRegister } from "react-hook-form";

export const OrderFieldInput = (props: {
  register: UseFormRegister<{ orderField: string }>;
}): ReactElement => {
  return (
    <FormControl>
      <FormLabel htmlFor="orderField">Order Field</FormLabel>
      <Input
        id="orderField"
        placeholder="Field Key"
        {...props.register("orderField")}
      />
    </FormControl>
  );
};

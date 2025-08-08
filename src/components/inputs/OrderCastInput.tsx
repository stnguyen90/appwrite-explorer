import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { UseFormRegister } from "react-hook-form";

export const OrderCastInput = (props: {
  register: UseFormRegister<{ orderCast: string }>;
}): ReactElement => {
  return (
    <FormControl>
      <FormLabel htmlFor="orderCast" defaultValue="string">
        Order Cast
      </FormLabel>

      <Select {...props.register("orderCast")}>
        <option value="string">String</option>
        <option value="int">Number</option>
        <option value="date">Date</option>
        <option value="time">Time</option>
        <option value="datetime">Datetime</option>
      </Select>
    </FormControl>
  );
};

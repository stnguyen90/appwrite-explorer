import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import React, { ReactElement } from "react";
import type {
  DeepMap,
  DeepPartial,
  FieldError,
  UseFormRegister,
} from "react-hook-form";

interface IFormInput {
  limit: number;
}

export const LimitInput = (props: {
  register: UseFormRegister<IFormInput>;
  errors: DeepMap<DeepPartial<IFormInput>, FieldError>;
}): ReactElement => {
  return (
    <FormControl isInvalid={!!props.errors.limit}>
      <FormLabel htmlFor="limit">Limit</FormLabel>
      <Input
        id="limit"
        placeholder="Limit"
        {...props.register("limit", {
          min: 0,
          max: 100,
          pattern: /^[0-9]+$/i,
        })}
      />
      <FormErrorMessage>
        {props.errors.limit && "Limit must be from 0 to 100"}
      </FormErrorMessage>
    </FormControl>
  );
};

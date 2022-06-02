import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import React from "react";
import {
  DeepMap,
  DeepPartial,
  FieldError,
  UseFormRegister,
} from "react-hook-form";

interface IFormInput {
  offset: number;
}

export const OffsetInput = (props: {
  register: UseFormRegister<IFormInput>;
  errors: DeepMap<DeepPartial<IFormInput>, FieldError>;
}): JSX.Element => {
  return (
    <FormControl isInvalid={!!props.errors.offset}>
      <FormLabel htmlFor="offset">Offset</FormLabel>
      <Input
        id="offset"
        placeholder="Offset"
        {...props.register("offset", { min: 0, pattern: /^[0-9]+$/i })}
      />
      <FormErrorMessage>
        {props.errors.offset && "Offset must be >= 0"}
      </FormErrorMessage>
    </FormControl>
  );
};

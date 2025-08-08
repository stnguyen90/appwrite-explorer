import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { UseFormRegister } from "react-hook-form";

export const SearchInput = (props: {
  register: UseFormRegister<{ search: string }>;
}): ReactElement => {
  return (
    <FormControl>
      <FormLabel htmlFor="search">Search</FormLabel>
      <Input
        id="search"
        placeholder="Search Query"
        {...props.register("search")}
      />
    </FormControl>
  );
};

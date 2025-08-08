import { CloseIcon, AddIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { ChangeHandler, RefCallBack } from "react-hook-form";

export const QueriesInput = (props: {
  fields: { id: string }[];
  getQueryOnChange: (index: number) => ChangeHandler;
  getQueryOnBlur: (index: number) => ChangeHandler;
  getQueryRef: (index: number) => RefCallBack;
  onRemoveClick: (index: number) => void;
  onAddClick: VoidFunction;
}): ReactElement => {
  return (
    <FormControl>
      <FormLabel>Queries</FormLabel>
      <VStack justifyContent="flex-start">
        {props.fields.map((field, index) => {
          return (
            <InputGroup key={field.id}>
              <Input
                list="queries"
                name={`queries.${index}.value`}
                onChange={props.getQueryOnChange(index)}
                onBlur={props.getQueryOnBlur(index)}
                ref={props.getQueryRef(index)}
                placeholder='equal("attribute", "value")'
              />
              {index != 0 && (
                <InputRightElement>
                  <IconButton
                    aria-label="Remove Query"
                    h="1.5rem"
                    w="1rem"
                    size="xm"
                    variant="link"
                    color="pink.500"
                    as={CloseIcon}
                    onClick={() => {
                      props.onRemoveClick(index);
                    }}
                  />
                </InputRightElement>
              )}
            </InputGroup>
          );
        })}

        <datalist id="queries">
          <option value='equal("attribute", ["value1", "value2"])'></option>
          <option value='notEqual("attribute", "value")'></option>
          <option value='lessThan("attribute", "value")'></option>
          <option value='lessThanEqual("attribute", "value")'></option>
          <option value='greaterThan("attribute", "value")'></option>
          <option value='greaterThanEqual("attribute", "value")'></option>
          <option value='search("attribute", "value")'></option>
          <option value='orderDesc("attribute")'></option>
          <option value='orderAsc("attribute")'></option>
          <option value="limit(25)"></option>
          <option value="offset(0)"></option>
          <option value='cursorAfter("id")'></option>
          <option value='cursorBefore("id")'></option>
        </datalist>
        <Button
          leftIcon={<AddIcon />}
          variant="outline"
          colorScheme="pink"
          onClick={props.onAddClick}
        >
          Add Filter
        </Button>
      </VStack>
    </FormControl>
  );
};

import { LockIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import React, {
  ChangeEventHandler,
  FocusEventHandler,
  MutableRefObject,
  useState,
} from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const PasswordInput = React.forwardRef(
  (
    props: {
      name: string;
      onChange: ChangeEventHandler;
      onBlur?: FocusEventHandler;
    },
    ref?:
      | ((instance: HTMLInputElement | null) => void)
      | MutableRefObject<HTMLInputElement | null>
      | null,
  ) => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    return (
      <InputGroup size="md">
        <InputLeftElement
          pointerEvents="none"
          children={<LockIcon color="gray.300" />}
        />
        <Input
          pr="4.5rem"
          type={show ? "text" : "password"}
          placeholder="Password"
          onChange={props.onChange}
          onBlur={props.onBlur}
          ref={ref}
        />
        <InputRightElement>
          <IconButton
            aria-label={show ? "Hide" : "Show"}
            h="1.75rem"
            size="xm"
            variant="link"
            color="gray.300"
            as={show ? FaEyeSlash : FaEye}
            onClick={handleClick}
          />
        </InputRightElement>
      </InputGroup>
    );
  },
);

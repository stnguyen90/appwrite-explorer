import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Box,
  Text,
  Textarea,
} from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import React, { ReactElement } from "react";

interface MonacoQueriesInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export const MonacoQueriesInput = ({
  value,
  onChange,
  error,
  placeholder = `// Enter an array of queries
[
  Query.equal("status", "published"),
  Query.limit(25),
  Query.orderDesc("createdAt")
]`,
}: MonacoQueriesInputProps): ReactElement => {
  const handleEditorDidMount = () => {
    // Monaco editor loaded successfully
  };

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>Queries</FormLabel>
      <Text fontSize="sm" color="gray.600" mb={2}>
        Enter a JavaScript array of Query objects. Use Query.equal(),
        Query.limit(), etc.
      </Text>
      <Box
        border="1px"
        borderColor="gray.200"
        borderRadius="md"
        overflow="hidden"
      >
        <Editor
          height="200px"
          defaultLanguage="javascript"
          value={value}
          onChange={(val) => onChange(val || "")}
          onMount={handleEditorDidMount}
          loading={
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              height="200px"
              resize="vertical"
              fontFamily="monospace"
              fontSize="14px"
              border="none"
              borderRadius="0"
              _focus={{ boxShadow: "none" }}
            />
          }
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: "on",
            wordWrap: "on",
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
          }}
          theme="vs-light"
        />
      </Box>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
      <Text fontSize="xs" color="gray.500" mt={1}>
        Examples: Query.equal("name", "value"), Query.limit(10),
        Query.orderAsc("createdAt")
      </Text>
    </FormControl>
  );
};

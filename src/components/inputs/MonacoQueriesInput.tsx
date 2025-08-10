import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Box,
  Text,
  Link,
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
  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Add autocomplete for Query methods
    monaco.languages.registerCompletionItemProvider("javascript", {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const queryMethods = [
          "equal",
          "notEqual",
          "lessThan",
          "lessThanEqual",
          "greaterThan",
          "greaterThanEqual",
          "isNull",
          "isNotNull",
          "between",
          "startsWith",
          "endsWith",
          "select",
          "search",
          "orderDesc",
          "orderAsc",
          "cursorAfter",
          "cursorBefore",
          "limit",
          "offset",
          "contains",
          "or",
          "and",
        ];

        const suggestions = queryMethods.map((method) => ({
          label: `Query.${method}`,
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: `Query.${method}($1)`,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          documentation: `Query.${method} method for building database queries`,
        }));

        return { suggestions };
      },
    });
  };

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>Queries</FormLabel>
      <Box borderWidth={1} w="full">
        <Editor
          height="200px"
          defaultLanguage="javascript"
          value={value}
          onChange={(val) => onChange(val || "")}
          onMount={handleEditorDidMount}
          options={{
            minimap: {
              enabled: false,
            },
          }}
        />
      </Box>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
      <Text fontSize="xs" color="gray.500" mt={1}>
        Examples: Query.equal("name", "value"), Query.limit(10),
        Query.orderAsc("createdAt") |{" "}
        <Link
          href="https://appwrite.io/docs/products/databases/queries"
          target="_blank"
          color="blue.500"
          textDecoration="underline"
        >
          Documentation
        </Link>
      </Text>
    </FormControl>
  );
};

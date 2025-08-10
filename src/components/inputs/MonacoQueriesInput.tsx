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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MonacoEditor = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Monaco = any;

export const MonacoQueriesInput = ({
  value,
  onChange,
  error,
}: MonacoQueriesInputProps): ReactElement => {
  const handleEditorDidMount = (editor: MonacoEditor, monaco: Monaco) => {
    // Disable default JavaScript suggestions to only show Query methods
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      noLib: true,
      allowNonTsExtensions: true,
    });

    // Add Query type definitions for hover information
    const queryTypeDefinitions = `
      declare class Query {
        /** Filter resources where attribute is equal to value */
        static equal(attribute: string, value: string | number | boolean | Array<string | number | boolean>): string;
        
        /** Filter resources where attribute is not equal to value */
        static notEqual(attribute: string, value: string | number | boolean | Array<string | number | boolean>): string;
        
        /** Filter resources where attribute is less than value */
        static lessThan(attribute: string, value: string | number | boolean | Array<string | number | boolean>): string;
        
        /** Filter resources where attribute is less than or equal to value */
        static lessThanEqual(attribute: string, value: string | number | boolean | Array<string | number | boolean>): string;
        
        /** Filter resources where attribute is greater than value */
        static greaterThan(attribute: string, value: string | number | boolean | Array<string | number | boolean>): string;
        
        /** Filter resources where attribute is greater than or equal to value */
        static greaterThanEqual(attribute: string, value: string | number | boolean | Array<string | number | boolean>): string;
        
        /** Filter resources where attribute is null */
        static isNull(attribute: string): string;
        
        /** Filter resources where attribute is not null */
        static isNotNull(attribute: string): string;
        
        /** Filter resources where attribute is between start and end (inclusive) */
        static between(attribute: string, start: string | number, end: string | number): string;
        
        /** Filter resources where attribute starts with value */
        static startsWith(attribute: string, value: string): string;
        
        /** Filter resources where attribute ends with value */
        static endsWith(attribute: string, value: string): string;
        
        /** Specify which attributes should be returned by the API call */
        static select(attributes: string[]): string;
        
        /** Filter resources by searching attribute for value. A fulltext index on attribute is required for this query to work */
        static search(attribute: string, value: string): string;
        
        /** Sort results by attribute descending */
        static orderDesc(attribute: string): string;
        
        /** Sort results by attribute ascending */
        static orderAsc(attribute: string): string;
        
        /** Return results after documentId */
        static cursorAfter(documentId: string): string;
        
        /** Return results before documentId */
        static cursorBefore(documentId: string): string;
        
        /** Return only limit results */
        static limit(limit: number): string;
        
        /** Filter resources by skipping the first offset results */
        static offset(offset: number): string;
        
        /** Filter resources where attribute contains the specified value */
        static contains(attribute: string, value: string | string[]): string;
        
        /** Combine multiple queries using logical OR operator */
        static or(queries: string[]): string;
        
        /** Combine multiple queries using logical AND operator */
        static and(queries: string[]): string;
      }
    `;

    // Add the type definitions to Monaco for IntelliSense
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      queryTypeDefinitions,
      "query-types.d.ts",
    );

    // Add autocomplete for Query methods with detailed information
    monaco.languages.registerCompletionItemProvider("javascript", {
      provideCompletionItems: (model: MonacoEditor, position: Monaco) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const queryMethods = [
          {
            method: "equal",
            signature:
              "Query.equal(attribute: string, value: string | number | boolean | Array<string | number | boolean>)",
            documentation: "Filter resources where attribute is equal to value",
            insertText: 'Query.equal("${1:attribute}", "${2:value}")',
          },
          {
            method: "notEqual",
            signature:
              "Query.notEqual(attribute: string, value: string | number | boolean | Array<string | number | boolean>)",
            documentation:
              "Filter resources where attribute is not equal to value",
            insertText: 'Query.notEqual("${1:attribute}", "${2:value}")',
          },
          {
            method: "lessThan",
            signature:
              "Query.lessThan(attribute: string, value: string | number | boolean | Array<string | number | boolean>)",
            documentation:
              "Filter resources where attribute is less than value",
            insertText: 'Query.lessThan("${1:attribute}", ${2:value})',
          },
          {
            method: "lessThanEqual",
            signature:
              "Query.lessThanEqual(attribute: string, value: string | number | boolean | Array<string | number | boolean>)",
            documentation:
              "Filter resources where attribute is less than or equal to value",
            insertText: 'Query.lessThanEqual("${1:attribute}", ${2:value})',
          },
          {
            method: "greaterThan",
            signature:
              "Query.greaterThan(attribute: string, value: string | number | boolean | Array<string | number | boolean>)",
            documentation:
              "Filter resources where attribute is greater than value",
            insertText: 'Query.greaterThan("${1:attribute}", ${2:value})',
          },
          {
            method: "greaterThanEqual",
            signature:
              "Query.greaterThanEqual(attribute: string, value: string | number | boolean | Array<string | number | boolean>)",
            documentation:
              "Filter resources where attribute is greater than or equal to value",
            insertText: 'Query.greaterThanEqual("${1:attribute}", ${2:value})',
          },
          {
            method: "isNull",
            signature: "Query.isNull(attribute: string)",
            documentation: "Filter resources where attribute is null",
            insertText: 'Query.isNull("${1:attribute}")',
          },
          {
            method: "isNotNull",
            signature: "Query.isNotNull(attribute: string)",
            documentation: "Filter resources where attribute is not null",
            insertText: 'Query.isNotNull("${1:attribute}")',
          },
          {
            method: "between",
            signature:
              "Query.between(attribute: string, start: string | number, end: string | number)",
            documentation:
              "Filter resources where attribute is between start and end (inclusive)",
            insertText: 'Query.between("${1:attribute}", ${2:start}, ${3:end})',
          },
          {
            method: "startsWith",
            signature: "Query.startsWith(attribute: string, value: string)",
            documentation: "Filter resources where attribute starts with value",
            insertText: 'Query.startsWith("${1:attribute}", "${2:value}")',
          },
          {
            method: "endsWith",
            signature: "Query.endsWith(attribute: string, value: string)",
            documentation: "Filter resources where attribute ends with value",
            insertText: 'Query.endsWith("${1:attribute}", "${2:value}")',
          },
          {
            method: "select",
            signature: "Query.select(attributes: string[])",
            documentation:
              "Specify which attributes should be returned by the API call",
            insertText: 'Query.select([${1:"attribute1", "attribute2"}])',
          },
          {
            method: "search",
            signature: "Query.search(attribute: string, value: string)",
            documentation:
              "Filter resources by searching attribute for value. A fulltext index on attribute is required for this query to work",
            insertText: 'Query.search("${1:attribute}", "${2:value}")',
          },
          {
            method: "orderDesc",
            signature: "Query.orderDesc(attribute: string)",
            documentation: "Sort results by attribute descending",
            insertText: 'Query.orderDesc("${1:attribute}")',
          },
          {
            method: "orderAsc",
            signature: "Query.orderAsc(attribute: string)",
            documentation: "Sort results by attribute ascending",
            insertText: 'Query.orderAsc("${1:attribute}")',
          },
          {
            method: "cursorAfter",
            signature: "Query.cursorAfter(documentId: string)",
            documentation: "Return results after documentId",
            insertText: 'Query.cursorAfter("${1:documentId}")',
          },
          {
            method: "cursorBefore",
            signature: "Query.cursorBefore(documentId: string)",
            documentation: "Return results before documentId",
            insertText: 'Query.cursorBefore("${1:documentId}")',
          },
          {
            method: "limit",
            signature: "Query.limit(limit: number)",
            documentation: "Return only limit results",
            insertText: "Query.limit(${1:25})",
          },
          {
            method: "offset",
            signature: "Query.offset(offset: number)",
            documentation:
              "Filter resources by skipping the first offset results",
            insertText: "Query.offset(${1:0})",
          },
          {
            method: "contains",
            signature:
              "Query.contains(attribute: string, value: string | string[])",
            documentation:
              "Filter resources where attribute contains the specified value",
            insertText: 'Query.contains("${1:attribute}", "${2:value}")',
          },
          {
            method: "or",
            signature: "Query.or(queries: string[])",
            documentation: "Combine multiple queries using logical OR operator",
            insertText: "Query.or([${1:/* queries */}])",
          },
          {
            method: "and",
            signature: "Query.and(queries: string[])",
            documentation:
              "Combine multiple queries using logical AND operator",
            insertText: "Query.and([${1:/* queries */}])",
          },
        ];

        const suggestions = queryMethods.map((methodInfo) => ({
          label: `Query.${methodInfo.method}`,
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: methodInfo.insertText,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          documentation: {
            value: `**${methodInfo.signature}**\n\n${methodInfo.documentation}`,
            isTrusted: true,
          },
          detail: methodInfo.signature,
        }));

        return { suggestions };
      },
      triggerCharacters: ["."],
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
        Query.orderAsc("createdAt") | Refer to{" "}
        <Link
          href="https://appwrite.io/docs/products/databases/queries"
          target="_blank"
          color="blue.500"
          textDecoration="underline"
        >
          documentation on queries
        </Link>{" "}
        for more info.
      </Text>
    </FormControl>
  );
};

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

interface QueriesEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MonacoEditor = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Monaco = any;

interface QueryMethodDefinition {
  method: string;
  signature: string;
  documentation: string;
  insertText: string;
  parameters: string;
}

// Single source of truth for all Query method definitions
const QUERY_METHODS: QueryMethodDefinition[] = [
  {
    method: "equal",
    signature:
      "Query.equal(attribute: string, value: string | number | boolean | Array<string | number | boolean>)",
    documentation: "Filter resources where column is equal to value",
    insertText: 'Query.equal("${1:attribute}", "${2:value}")',
    parameters:
      "attribute: string, value: string | number | boolean | Array<string | number | boolean>",
  },
  {
    method: "notEqual",
    signature:
      "Query.notEqual(attribute: string, value: string | number | boolean | Array<string | number | boolean>)",
    documentation: "Filter resources where column is not equal to value",
    insertText: 'Query.notEqual("${1:attribute}", "${2:value}")',
    parameters:
      "attribute: string, value: string | number | boolean | Array<string | number | boolean>",
  },
  {
    method: "lessThan",
    signature:
      "Query.lessThan(attribute: string, value: string | number | boolean | Array<string | number | boolean>)",
    documentation: "Filter resources where column is less than value",
    insertText: 'Query.lessThan("${1:attribute}", ${2:value})',
    parameters:
      "attribute: string, value: string | number | boolean | Array<string | number | boolean>",
  },
  {
    method: "lessThanEqual",
    signature:
      "Query.lessThanEqual(attribute: string, value: string | number | boolean | Array<string | number | boolean>)",
    documentation:
      "Filter resources where column is less than or equal to value",
    insertText: 'Query.lessThanEqual("${1:attribute}", ${2:value})',
    parameters:
      "attribute: string, value: string | number | boolean | Array<string | number | boolean>",
  },
  {
    method: "greaterThan",
    signature:
      "Query.greaterThan(attribute: string, value: string | number | boolean | Array<string | number | boolean>)",
    documentation: "Filter resources where column is greater than value",
    insertText: 'Query.greaterThan("${1:attribute}", ${2:value})',
    parameters:
      "attribute: string, value: string | number | boolean | Array<string | number | boolean>",
  },
  {
    method: "greaterThanEqual",
    signature:
      "Query.greaterThanEqual(attribute: string, value: string | number | boolean | Array<string | number | boolean>)",
    documentation:
      "Filter resources where column is greater than or equal to value",
    insertText: 'Query.greaterThanEqual("${1:attribute}", ${2:value})',
    parameters:
      "attribute: string, value: string | number | boolean | Array<string | number | boolean>",
  },
  {
    method: "isNull",
    signature: "Query.isNull(attribute: string)",
    documentation: "Filter resources where column is null",
    insertText: 'Query.isNull("${1:attribute}")',
    parameters: "attribute: string",
  },
  {
    method: "isNotNull",
    signature: "Query.isNotNull(attribute: string)",
    documentation: "Filter resources where column is not null",
    insertText: 'Query.isNotNull("${1:attribute}")',
    parameters: "attribute: string",
  },
  {
    method: "between",
    signature:
      "Query.between(attribute: string, start: string | number, end: string | number)",
    documentation:
      "Filter resources where column is between start and end (inclusive)",
    insertText: 'Query.between("${1:attribute}", ${2:start}, ${3:end})',
    parameters:
      "attribute: string, start: string | number, end: string | number",
  },
  {
    method: "startsWith",
    signature: "Query.startsWith(attribute: string, value: string)",
    documentation: "Filter resources where column starts with value",
    insertText: 'Query.startsWith("${1:attribute}", "${2:value}")',
    parameters: "attribute: string, value: string",
  },
  {
    method: "endsWith",
    signature: "Query.endsWith(attribute: string, value: string)",
    documentation: "Filter resources where column ends with value",
    insertText: 'Query.endsWith("${1:attribute}", "${2:value}")',
    parameters: "attribute: string, value: string",
  },
  {
    method: "select",
    signature: "Query.select(attributes: string[])",
    documentation: "Specify which columns should be returned by the API call",
    insertText: 'Query.select([${1:"attribute1", "attribute2"}])',
    parameters: "attributes: string[]",
  },
  {
    method: "search",
    signature: "Query.search(attribute: string, value: string)",
    documentation:
      "Filter resources by searching column for value. A fulltext index on column is required for this query to work",
    insertText: 'Query.search("${1:attribute}", "${2:value}")',
    parameters: "attribute: string, value: string",
  },
  {
    method: "orderDesc",
    signature: "Query.orderDesc(attribute: string)",
    documentation: "Sort results by column descending",
    insertText: 'Query.orderDesc("${1:attribute}")',
    parameters: "attribute: string",
  },
  {
    method: "orderAsc",
    signature: "Query.orderAsc(attribute: string)",
    documentation: "Sort results by column ascending",
    insertText: 'Query.orderAsc("${1:attribute}")',
    parameters: "attribute: string",
  },
  {
    method: "cursorAfter",
    signature: "Query.cursorAfter(documentId: string)",
    documentation: "Return results after rowId",
    insertText: 'Query.cursorAfter("${1:documentId}")',
    parameters: "documentId: string",
  },
  {
    method: "cursorBefore",
    signature: "Query.cursorBefore(documentId: string)",
    documentation: "Return results before rowId",
    insertText: 'Query.cursorBefore("${1:documentId}")',
    parameters: "documentId: string",
  },
  {
    method: "limit",
    signature: "Query.limit(limit: number)",
    documentation: "Return only limit results",
    insertText: "Query.limit(${1:25})",
    parameters: "limit: number",
  },
  {
    method: "offset",
    signature: "Query.offset(offset: number)",
    documentation: "Filter resources by skipping the first offset results",
    insertText: "Query.offset(${1:0})",
    parameters: "offset: number",
  },
  {
    method: "contains",
    signature: "Query.contains(attribute: string, value: string | string[])",
    documentation: "Filter resources where column contains the specified value",
    insertText: 'Query.contains("${1:attribute}", "${2:value}")',
    parameters: "attribute: string, value: string | string[]",
  },
  {
    method: "or",
    signature: "Query.or(queries: string[])",
    documentation: "Combine multiple queries using logical OR operator",
    insertText: "Query.or([${1:/* queries */}])",
    parameters: "queries: string[]",
  },
  {
    method: "and",
    signature: "Query.and(queries: string[])",
    documentation: "Combine multiple queries using logical AND operator",
    insertText: "Query.and([${1:/* queries */}])",
    parameters: "queries: string[]",
  },
  {
    method: "notContains",
    signature: "Query.notContains(attribute: string, value: string | string[])",
    documentation:
      "Filter resources where column does not contain the specified value",
    insertText: 'Query.notContains("${1:attribute}", "${2:value}")',
    parameters: "attribute: string, value: string | string[]",
  },
  {
    method: "notSearch",
    signature: "Query.notSearch(attribute: string, value: string)",
    documentation:
      "Filter resources by searching column for value (inverse of search). A fulltext index on column is required for this query to work",
    insertText: 'Query.notSearch("${1:attribute}", "${2:value}")',
    parameters: "attribute: string, value: string",
  },
  {
    method: "notBetween",
    signature:
      "Query.notBetween(attribute: string, start: string | number, end: string | number)",
    documentation:
      "Filter resources where column is not between start and end (exclusive)",
    insertText: 'Query.notBetween("${1:attribute}", ${2:start}, ${3:end})',
    parameters:
      "attribute: string, start: string | number, end: string | number",
  },
  {
    method: "notStartsWith",
    signature: "Query.notStartsWith(attribute: string, value: string)",
    documentation: "Filter resources where column does not start with value",
    insertText: 'Query.notStartsWith("${1:attribute}", "${2:value}")',
    parameters: "attribute: string, value: string",
  },
  {
    method: "notEndsWith",
    signature: "Query.notEndsWith(attribute: string, value: string)",
    documentation: "Filter resources where column does not end with value",
    insertText: 'Query.notEndsWith("${1:attribute}", "${2:value}")',
    parameters: "attribute: string, value: string",
  },
  {
    method: "orderRandom",
    signature: "Query.orderRandom()",
    documentation: "Sort results randomly",
    insertText: "Query.orderRandom()",
    parameters: "",
  },
  {
    method: "createdBefore",
    signature: "Query.createdBefore(value: string)",
    documentation: "Filter resources where row was created before date",
    insertText: 'Query.createdBefore("${1:date}")',
    parameters: "value: string",
  },
  {
    method: "createdAfter",
    signature: "Query.createdAfter(value: string)",
    documentation: "Filter resources where row was created after date",
    insertText: 'Query.createdAfter("${1:date}")',
    parameters: "value: string",
  },
  {
    method: "createdBetween",
    signature: "Query.createdBetween(start: string, end: string)",
    documentation: "Filter resources where row was created between dates",
    insertText: 'Query.createdBetween("${1:startDate}", "${2:endDate}")',
    parameters: "start: string, end: string",
  },
  {
    method: "updatedBefore",
    signature: "Query.updatedBefore(value: string)",
    documentation: "Filter resources where row was updated before date",
    insertText: 'Query.updatedBefore("${1:date}")',
    parameters: "value: string",
  },
  {
    method: "updatedAfter",
    signature: "Query.updatedAfter(value: string)",
    documentation: "Filter resources where row was updated after date",
    insertText: 'Query.updatedAfter("${1:date}")',
    parameters: "value: string",
  },
  {
    method: "updatedBetween",
    signature: "Query.updatedBetween(start: string, end: string)",
    documentation: "Filter resources where row was updated between dates",
    insertText: 'Query.updatedBetween("${1:startDate}", "${2:endDate}")',
    parameters: "start: string, end: string",
  },
  {
    method: "distanceEqual",
    signature:
      "Query.distanceEqual(attribute: string, values: any[], distance: number, meters: boolean = true)",
    documentation:
      "Filter resources where column is at a specific distance from the given coordinates",
    insertText:
      'Query.distanceEqual("${1:attribute}", [${2:lat}, ${3:lng}], ${4:distance}, ${5:true})',
    parameters:
      "attribute: string, values: any[], distance: number, meters: boolean",
  },
  {
    method: "distanceNotEqual",
    signature:
      "Query.distanceNotEqual(attribute: string, values: any[], distance: number, meters: boolean = true)",
    documentation:
      "Filter resources where column is not at a specific distance from the given coordinates",
    insertText:
      'Query.distanceNotEqual("${1:attribute}", [${2:lat}, ${3:lng}], ${4:distance}, ${5:true})',
    parameters:
      "attribute: string, values: any[], distance: number, meters: boolean",
  },
  {
    method: "distanceGreaterThan",
    signature:
      "Query.distanceGreaterThan(attribute: string, values: any[], distance: number, meters: boolean = true)",
    documentation:
      "Filter resources where column is at a distance greater than the specified value from the given coordinates",
    insertText:
      'Query.distanceGreaterThan("${1:attribute}", [${2:lat}, ${3:lng}], ${4:distance}, ${5:true})',
    parameters:
      "attribute: string, values: any[], distance: number, meters: boolean",
  },
  {
    method: "distanceLessThan",
    signature:
      "Query.distanceLessThan(attribute: string, values: any[], distance: number, meters: boolean = true)",
    documentation:
      "Filter resources where column is at a distance less than the specified value from the given coordinates",
    insertText:
      'Query.distanceLessThan("${1:attribute}", [${2:lat}, ${3:lng}], ${4:distance}, ${5:true})',
    parameters:
      "attribute: string, values: any[], distance: number, meters: boolean",
  },
  {
    method: "intersects",
    signature: "Query.intersects(attribute: string, values: any[])",
    documentation:
      "Filter resources where column intersects with the given geometry",
    insertText: 'Query.intersects("${1:attribute}", [${2:geometry}])',
    parameters: "attribute: string, values: any[]",
  },
  {
    method: "notIntersects",
    signature: "Query.notIntersects(attribute: string, values: any[])",
    documentation:
      "Filter resources where column does not intersect with the given geometry",
    insertText: 'Query.notIntersects("${1:attribute}", [${2:geometry}])',
    parameters: "attribute: string, values: any[]",
  },
  {
    method: "crosses",
    signature: "Query.crosses(attribute: string, values: any[])",
    documentation: "Filter resources where column crosses the given geometry",
    insertText: 'Query.crosses("${1:attribute}", [${2:geometry}])',
    parameters: "attribute: string, values: any[]",
  },
  {
    method: "notCrosses",
    signature: "Query.notCrosses(attribute: string, values: any[])",
    documentation:
      "Filter resources where column does not cross the given geometry",
    insertText: 'Query.notCrosses("${1:attribute}", [${2:geometry}])',
    parameters: "attribute: string, values: any[]",
  },
  {
    method: "overlaps",
    signature: "Query.overlaps(attribute: string, values: any[])",
    documentation:
      "Filter resources where column overlaps with the given geometry",
    insertText: 'Query.overlaps("${1:attribute}", [${2:geometry}])',
    parameters: "attribute: string, values: any[]",
  },
  {
    method: "notOverlaps",
    signature: "Query.notOverlaps(attribute: string, values: any[])",
    documentation:
      "Filter resources where column does not overlap with the given geometry",
    insertText: 'Query.notOverlaps("${1:attribute}", [${2:geometry}])',
    parameters: "attribute: string, values: any[]",
  },
  {
    method: "touches",
    signature: "Query.touches(attribute: string, values: any[])",
    documentation: "Filter resources where column touches the given geometry",
    insertText: 'Query.touches("${1:attribute}", [${2:geometry}])',
    parameters: "attribute: string, values: any[]",
  },
  {
    method: "notTouches",
    signature: "Query.notTouches(attribute: string, values: any[])",
    documentation:
      "Filter resources where column does not touch the given geometry",
    insertText: 'Query.notTouches("${1:attribute}", [${2:geometry}])',
    parameters: "attribute: string, values: any[]",
  },
];

// Generate TypeScript type definitions from method definitions
const generateTypeDefinitions = (methods: QueryMethodDefinition[]): string => {
  const methodDefinitions = methods
    .map(
      (method) =>
        `        /** ${method.documentation} */\n        static ${method.method}(${method.parameters}): string;`,
    )
    .join("\n\n");

  return `
      declare class Query {
${methodDefinitions}
      }
    `;
};

export const QueriesEditor = ({
  value,
  onChange,
  error,
}: QueriesEditorProps): ReactElement => {
  const handleEditorDidMount = (editor: MonacoEditor, monaco: Monaco) => {
    // Disable default JavaScript suggestions to only show Query methods
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      noLib: true,
      allowNonTsExtensions: true,
    });

    // Generate and add Query type definitions for hover information
    const queryTypeDefinitions = generateTypeDefinitions(QUERY_METHODS);
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

        const suggestions = QUERY_METHODS.map((methodInfo) => ({
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
        Refer to{" "}
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

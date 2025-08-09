import { FormControl, FormLabel, FormErrorMessage, Text, Textarea } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import React, { ReactElement, useState, useEffect } from "react";

export interface QueriesJsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const QueriesJsonEditor = ({
  value,
  onChange,
  error,
}: QueriesJsonEditorProps): ReactElement => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  const handleEditorChange = (newValue: string | undefined) => {
    onChange(newValue || "");
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const handleEditorDidMount = () => {
    setIsLoading(false);
  };

  const handleEditorError = (error: any) => {
    setLoadError("Failed to load Monaco editor, using fallback textarea");
    setIsLoading(false);
    setUseFallback(true);
    console.error("Monaco editor error:", error);
  };

  useEffect(() => {
    // Auto-fallback after 5 seconds if Monaco hasn't loaded
    const timeout = setTimeout(() => {
      if (isLoading) {
        setLoadError("Monaco editor took too long to load, using fallback textarea");
        setIsLoading(false);
        setUseFallback(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const defaultValue = `[
  {
    "method": "limit",
    "values": [25]
  }
]`;

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>Queries (JSON)</FormLabel>
      {loadError && (
        <Text color="orange.500" mb={2} fontSize="sm">
          {loadError}
        </Text>
      )}
      {useFallback ? (
        <Textarea
          value={value || defaultValue}
          onChange={handleTextareaChange}
          placeholder="Enter JSON queries here..."
          rows={8}
          fontFamily="mono"
          fontSize="sm"
        />
      ) : (
        <Editor
          height="200px"
          defaultLanguage="json"
          value={value || defaultValue}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          loading={isLoading ? "Loading Monaco editor..." : undefined}
          options={{
            minimap: { enabled: false },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            theme: "vs-light",
            formatOnPaste: true,
            formatOnType: true,
            wordWrap: "on",
            tabSize: 2,
          }}
        />
      )}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
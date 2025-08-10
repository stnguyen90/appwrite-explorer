import { Query } from "appwrite";

export interface ParseQueriesResult {
  queries: string[];
  error?: string;
}

export function parseQueries(code: string): ParseQueriesResult {
  if (!code.trim()) {
    return { queries: [] };
  }

  try {
    // Create a safe evaluation environment with Query class available
    const func = new Function(
      "Query",
      `
      "use strict";
      return ${code};
    `,
    );

    const result = func(Query);

    if (!Array.isArray(result)) {
      return {
        queries: [],
        error: "Code must return an array of queries",
      };
    }

    // Convert query objects to strings
    const queries = result.map((item, index) => {
      if (typeof item === "string") {
        return item;
      } else if (typeof item === "object" && item !== null) {
        // Convert query object to string
        return JSON.stringify(item);
      }
      throw new Error(`Item at index ${index} is not a valid query`);
    });

    return { queries };
  } catch (error) {
    return {
      queries: [],
      error: error instanceof Error ? error.message : "Invalid JavaScript code",
    };
  }
}

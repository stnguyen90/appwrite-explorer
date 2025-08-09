// Query class implementation based on the issue description
export class Query {
  method: string;
  attribute: string | string[] | undefined;
  values: (string | number | boolean)[] | undefined;

  constructor(
    method: string,
    attribute?: string | string[],
    values?: string | number | boolean | (string | number | boolean)[],
  ) {
    this.method = method;
    this.attribute = attribute;

    if (values !== undefined) {
      if (Array.isArray(values)) {
        this.values = values;
      } else {
        this.values = [values];
      }
    }
  }

  toString(): string {
    return JSON.stringify({
      method: this.method,
      attribute: this.attribute,
      values: this.values,
    });
  }

  // Static methods for building queries
  static equal = (
    attribute: string,
    value: string | number | boolean | (string | number | boolean)[],
  ): string => new Query("equal", attribute, value).toString();

  static notEqual = (
    attribute: string,
    value: string | number | boolean | (string | number | boolean)[],
  ): string => new Query("notEqual", attribute, value).toString();

  static lessThan = (
    attribute: string,
    value: string | number | boolean,
  ): string => new Query("lessThan", attribute, value).toString();

  static lessThanEqual = (
    attribute: string,
    value: string | number | boolean,
  ): string => new Query("lessThanEqual", attribute, value).toString();

  static greaterThan = (
    attribute: string,
    value: string | number | boolean,
  ): string => new Query("greaterThan", attribute, value).toString();

  static greaterThanEqual = (
    attribute: string,
    value: string | number | boolean,
  ): string => new Query("greaterThanEqual", attribute, value).toString();

  static isNull = (attribute: string): string =>
    new Query("isNull", attribute).toString();

  static isNotNull = (attribute: string): string =>
    new Query("isNotNull", attribute).toString();

  static between = (
    attribute: string,
    start: string | number,
    end: string | number,
  ): string => new Query("between", attribute, [start, end]).toString();

  static startsWith = (attribute: string, value: string): string =>
    new Query("startsWith", attribute, value).toString();

  static endsWith = (attribute: string, value: string): string =>
    new Query("endsWith", attribute, value).toString();

  static select = (attributes: string[]): string =>
    new Query("select", undefined, attributes).toString();

  static search = (attribute: string, value: string): string =>
    new Query("search", attribute, value).toString();

  static orderDesc = (attribute: string): string =>
    new Query("orderDesc", attribute).toString();

  static orderAsc = (attribute: string): string =>
    new Query("orderAsc", attribute).toString();

  static cursorAfter = (documentId: string): string =>
    new Query("cursorAfter", undefined, documentId).toString();

  static cursorBefore = (documentId: string): string =>
    new Query("cursorBefore", undefined, documentId).toString();

  static limit = (limit: number): string =>
    new Query("limit", undefined, limit).toString();

  static offset = (offset: number): string =>
    new Query("offset", undefined, offset).toString();

  static contains = (attribute: string, value: string | string[]): string =>
    new Query("contains", attribute, value).toString();

  static or = (queries: string[]): string =>
    new Query(
      "or",
      undefined,
      queries.map((query) => JSON.parse(query)),
    ).toString();

  static and = (queries: string[]): string =>
    new Query(
      "and",
      undefined,
      queries.map((query) => JSON.parse(query)),
    ).toString();
}

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

    // Validate that all items are strings (serialized queries)
    const queries = result.map((item, index) => {
      if (typeof item === "string") {
        return item;
      }
      throw new Error(`Item at index ${index} is not a valid query string`);
    });

    return { queries };
  } catch (error) {
    return {
      queries: [],
      error: error instanceof Error ? error.message : "Invalid JavaScript code",
    };
  }
}

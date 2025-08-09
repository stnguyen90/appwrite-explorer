import { Query } from "appwrite";

export interface QueryObject {
  method: string;
  attribute?: string;
  values?: unknown[];
}

export const convertJsonQueriesToAppwriteQueries = (
  jsonQueries: string,
): string[] => {
  try {
    const parsedQueries: QueryObject[] = JSON.parse(jsonQueries);

    if (!Array.isArray(parsedQueries)) {
      throw new Error("Queries must be an array");
    }

    const appwriteQueries: string[] = [];

    for (const query of parsedQueries) {
      const { method, attribute, values } = query;

      switch (method) {
        case "equal":
          if (attribute && values) {
            appwriteQueries.push(Query.equal(attribute, values as string[]));
          }
          break;
        case "notEqual":
          if (attribute && values && values.length === 1) {
            appwriteQueries.push(
              Query.notEqual(attribute, values[0] as string),
            );
          }
          break;
        case "lessThan":
          if (attribute && values && values.length === 1) {
            appwriteQueries.push(
              Query.lessThan(attribute, values[0] as string | number),
            );
          }
          break;
        case "lessThanEqual":
          if (attribute && values && values.length === 1) {
            appwriteQueries.push(
              Query.lessThanEqual(attribute, values[0] as string | number),
            );
          }
          break;
        case "greaterThan":
          if (attribute && values && values.length === 1) {
            appwriteQueries.push(
              Query.greaterThan(attribute, values[0] as string | number),
            );
          }
          break;
        case "greaterThanEqual":
          if (attribute && values && values.length === 1) {
            appwriteQueries.push(
              Query.greaterThanEqual(attribute, values[0] as string | number),
            );
          }
          break;
        case "isNull":
          if (attribute) {
            appwriteQueries.push(Query.isNull(attribute));
          }
          break;
        case "isNotNull":
          if (attribute) {
            appwriteQueries.push(Query.isNotNull(attribute));
          }
          break;
        case "between":
          if (attribute && values && values.length === 2) {
            appwriteQueries.push(
              Query.between(
                attribute,
                values[0] as string | number,
                values[1] as string | number,
              ),
            );
          }
          break;
        case "startsWith":
          if (attribute && values && values.length === 1) {
            appwriteQueries.push(
              Query.startsWith(attribute, values[0] as string),
            );
          }
          break;
        case "endsWith":
          if (attribute && values && values.length === 1) {
            appwriteQueries.push(Query.endsWith(attribute, values[0] as string));
          }
          break;
        case "select":
          if (values && values.length > 0) {
            appwriteQueries.push(Query.select(values as string[]));
          }
          break;
        case "search":
          if (attribute && values && values.length === 1) {
            appwriteQueries.push(Query.search(attribute, values[0] as string));
          }
          break;
        case "orderDesc":
          if (attribute) {
            appwriteQueries.push(Query.orderDesc(attribute));
          }
          break;
        case "orderAsc":
          if (attribute) {
            appwriteQueries.push(Query.orderAsc(attribute));
          }
          break;
        case "cursorAfter":
          if (values && values.length === 1) {
            appwriteQueries.push(Query.cursorAfter(values[0] as string));
          }
          break;
        case "cursorBefore":
          if (values && values.length === 1) {
            appwriteQueries.push(Query.cursorBefore(values[0] as string));
          }
          break;
        case "limit":
          if (values && values.length === 1 && typeof values[0] === "number") {
            appwriteQueries.push(Query.limit(values[0]));
          }
          break;
        case "offset":
          if (values && values.length === 1 && typeof values[0] === "number") {
            appwriteQueries.push(Query.offset(values[0]));
          }
          break;
        case "contains":
          if (attribute && values) {
            appwriteQueries.push(Query.contains(attribute, values as string[]));
          }
          break;
        case "or":
          if (values && values.length > 0) {
            const nestedQueries = values
              .map((nestedQuery) => {
                const nestedResult = convertJsonQueriesToAppwriteQueries(
                  JSON.stringify([nestedQuery]),
                );
                return nestedResult[0];
              })
              .filter(Boolean);
            if (nestedQueries.length > 0) {
              appwriteQueries.push(Query.or(nestedQueries));
            }
          }
          break;
        case "and":
          if (values && values.length > 0) {
            const nestedQueries = values
              .map((nestedQuery) => {
                const nestedResult = convertJsonQueriesToAppwriteQueries(
                  JSON.stringify([nestedQuery]),
                );
                return nestedResult[0];
              })
              .filter(Boolean);
            if (nestedQueries.length > 0) {
              appwriteQueries.push(Query.and(nestedQueries));
            }
          }
          break;
        default:
          console.warn(`Unknown query method: ${method}`);
      }
    }

    return appwriteQueries;
  } catch (error) {
    console.error("Error parsing queries:", error);
    throw new Error(
      `Invalid JSON format: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

export const validateJsonQueries = (jsonQueries: string): string | null => {
  try {
    convertJsonQueriesToAppwriteQueries(jsonQueries);
    return null; // No error
  } catch (error) {
    return error instanceof Error ? error.message : "Invalid query format";
  }
};

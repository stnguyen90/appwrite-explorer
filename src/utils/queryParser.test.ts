import { parseQueries } from "./queryParser";

describe("Query Parser", () => {
  test("should parse simple query array", () => {
    const code = `[
      Query.equal("status", "published"),
      Query.limit(10)
    ]`;

    const result = parseQueries(code);

    expect(result.error).toBeUndefined();
    expect(result.queries).toHaveLength(2);
    expect(result.queries[0]).toContain('"method":"equal"');
    expect(result.queries[1]).toContain('"method":"limit"');
  });

  test("should handle empty queries", () => {
    const result = parseQueries("");
    expect(result.queries).toEqual([]);
    expect(result.error).toBeUndefined();
  });

  test("should handle syntax errors", () => {
    const result = parseQueries('[Query.equal("status",]');
    expect(result.error).toBeDefined();
    expect(result.queries).toEqual([]);
  });

  test("should validate return type is array", () => {
    const result = parseQueries('Query.equal("status", "published")');
    expect(result.error).toBe("Code must return an array of queries");
    expect(result.queries).toEqual([]);
  });
});

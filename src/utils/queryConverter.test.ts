import { convertJsonQueriesToAppwriteQueries, validateJsonQueries } from '../utils/queryConverter';

describe('Query Converter', () => {
  test('converts valid JSON queries to Appwrite queries', () => {
    const jsonQueries = `[
      {
        "method": "equal",
        "attribute": "status",
        "values": ["active"]
      },
      {
        "method": "limit",
        "values": [10]
      }
    ]`;

    const result = convertJsonQueriesToAppwriteQueries(jsonQueries);
    expect(result).toHaveLength(2);
    expect(result[0]).toContain('equal');
    expect(result[1]).toContain('limit');
  });

  test('validates JSON queries correctly', () => {
    const validJson = `[{"method": "limit", "values": [25]}]`;
    const invalidJson = `{"invalid": "format"}`;

    expect(validateJsonQueries(validJson)).toBeNull();
    expect(validateJsonQueries(invalidJson)).toContain('Queries must be an array');
  });

  test('handles invalid JSON format', () => {
    const invalidJson = `{invalid json`;
    expect(validateJsonQueries(invalidJson)).toContain('Invalid JSON format');
  });
});
// Basic test to ensure Jest is working
test("Jest is working correctly", () => {
  expect(1 + 1).toBe(2);
});

test("TypeScript compilation works", () => {
  const message: string = "Hello World";
  expect(message).toBe("Hello World");
});

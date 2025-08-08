import React from "react";
import { App } from "./App";

test("App component can be imported and renders JSX", () => {
  // Test that the App component can be created and returns valid JSX
  const appElement = React.createElement(App);
  expect(appElement).toBeTruthy();
  expect(appElement.type).toBe(App);
  
  // Verify the component is a valid React function component
  expect(typeof App).toBe("function");
  expect(App.name).toBe("App");
});

test("App component renders without throwing errors", () => {
  // Test that calling the App component function doesn't throw
  expect(() => {
    const result = App();
    expect(result).toBeTruthy();
    expect(React.isValidElement(result)).toBe(true);
  }).not.toThrow();
});

test("App component returns expected JSX structure", () => {
  // Verify the component returns a React element with expected structure
  const result = App();
  expect(React.isValidElement(result)).toBe(true);
  
  // The App should return a ChakraProvider as the root element
  expect(result.type.displayName || result.type.name).toMatch(/ChakraProvider|Provider/i);
  expect(result.props).toBeTruthy();
  expect(result.props.children).toBeTruthy();
});

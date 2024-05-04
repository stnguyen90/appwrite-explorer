import React from "react";
import { screen } from "@testing-library/react";
import { render } from "./test-utils";
import { App } from "./App";

test("renders", () => {
  render(<App />);
  const element = screen.getByText(/Loading.../i);
  expect(element).toBeInTheDocument();
});

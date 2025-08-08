import React from "react";
import { render } from "./test-utils";
import { App } from "./App";

test("renders", () => {
  const { getByText } = render(<App />);
  const element = getByText(/Loading.../i);
  expect(element).toBeInTheDocument();
});

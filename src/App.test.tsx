import React from "react";
import { render as customRender } from "./test-utils";
import { screen } from "@testing-library/dom";
import { App } from "./App";

test("renders", () => {
  customRender(<App />);
  const element = screen.getByText(/Loading.../i);
  expect(element).toBeInTheDocument();
});

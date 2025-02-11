import { render, screen } from "@testing-library/react";
import React from "react";
import App from "../../src/App";
import { BrowserRouter } from "react-router-dom";

describe("App Component", () => {
  it("renders without crashing", () => {
    render(
        <App />
    );

  });
});

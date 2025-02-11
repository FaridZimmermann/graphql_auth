import { render, screen } from "@testing-library/react";
import App from "../src/App";
import { BrowserRouter } from "react-router-dom";

describe("App Component", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

  });
});

require("dotenv").config(".env");
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Index from "../pages/[space]";
import { StateProvider as Provider } from "../contexts/store";
import RouterMock, { Router } from "../utils/RouterMock";
import { createExpiredJWT, createValidJWT } from "../utils/front-helpers";

jest.mock("next/config", () => () => ({
  publicRuntimeConfig: process.env,
}));

describe("test login scenarios", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  test("No token means a redirect to login", () => {
    render(
      <RouterMock>
        <Provider>
          <Index />
        </Provider>
      </RouterMock>
    );
    expect(Router.router.pathname).toEqual("/login");
  });

  test("current token means no redirect", () => {
    localStorage.setItem("token", createValidJWT());
    render(
      <RouterMock>
        <Provider>
          <Index />
        </Provider>
      </RouterMock>
    );
    expect(Router.router.pathname).toEqual("/");
  });

  test("expired token means redirect to login", () => {
    localStorage.setItem("token", createExpiredJWT());
    render(
      <RouterMock>
        <Provider>
          <Index />
        </Provider>
      </RouterMock>
    );
    expect(Router.router.pathname).toEqual("/login");
  });
});

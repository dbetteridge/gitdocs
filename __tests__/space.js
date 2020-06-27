require("dotenv").config(".env");
import React from "react";
import {
  render,
  fireEvent,
  queryByAttribute,
  waitForElement,
} from "@testing-library/react";
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

describe("test adding users", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("Test adding a single user to list with onblur", () => {
    localStorage.setItem("token", createValidJWT());

    const { findByText, ...page } = render(
      <RouterMock>
        <Provider>
          <Index />
        </Provider>
      </RouterMock>
    );
    const getById = queryByAttribute.bind(null, "id");
    const nameInputElement = getById(page.container, "emails");
    fireEvent.change(nameInputElement, { target: { value: "test@test.com" } });
    fireEvent.blur(nameInputElement);
    expect(findByText("test@test.com")).toBeTruthy();
  });

  test("Test adding a single user to list with timeout", () => {
    localStorage.setItem("token", createValidJWT());

    const { findByText, ...page } = render(
      <RouterMock>
        <Provider>
          <Index />
        </Provider>
      </RouterMock>
    );
    const getById = queryByAttribute.bind(null, "id");
    const nameInputElement = getById(page.container, "emails");
    fireEvent.change(nameInputElement, { target: { value: "test@test.com" } });

    expect(findByText("test@test.com")).toBeTruthy();
  });
});

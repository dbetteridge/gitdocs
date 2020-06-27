import React from "react";
import { render, fireEvent, queryByAttribute } from "@testing-library/react";
import Index from "../pages/register";
import { StateProvider as Provider } from "../contexts/store";
import RouterMock from "../utils/RouterMock";
import fetchMock from "../utils/FetchMock";
import Themer from "@components/Themed";

beforeEach(() => {
  localStorage.clear();
});

test("The register form renders correctly", () => {
  const { getAllByText } = render(
    <RouterMock>
      <Themer>
        <Provider>
          <Index />
        </Provider>
      </Themer>
    </RouterMock>
  );

  const registerButtonElement = getAllByText("Register");
  expect(registerButtonElement[0]).toBeInTheDocument();
});

test("Register API returns token", async () => {
  global.fetch = fetchMock(jest, { token: "blah" });
  const { getByRole, ...page } = render(
    <RouterMock>
      <Themer>
        <Provider>
          <Index />
        </Provider>
      </Themer>
    </RouterMock>
  );

  const getById = queryByAttribute.bind(null, "id");
  const nameInputElement = getById(page.container, "name");
  fireEvent.change(nameInputElement, { target: { value: "John Smith" } });
  const emailInputElement = getById(page.container, "email");
  fireEvent.change(emailInputElement, { target: { value: "username" } });
  const passwordInputElement = getById(page.container, "password");
  fireEvent.change(passwordInputElement, { target: { value: "testpassword" } });
  const registerButtonElement = getById(page.container, "register");

  await registerButtonElement.click();
});

test("Register API returns empty token, no token in localstorage", async () => {
  global.fetch = fetchMock(jest, { token: "" });
  const { findByText, ...page } = render(
    <RouterMock>
      <Provider>
        <Index />
      </Provider>
    </RouterMock>
  );
  const getById = queryByAttribute.bind(null, "id");
  const nameInputElement = getById(page.container, "name");
  fireEvent.change(nameInputElement, { target: { value: "John Smith" } });
  const emailInputElement = getById(page.container, "email");
  fireEvent.change(emailInputElement, { target: { value: "username" } });
  const passwordInputElement = getById(page.container, "password");
  fireEvent.change(passwordInputElement, { target: { value: "testpassword" } });
  const registerButtonElement = getById(page.container, "register");

  await registerButtonElement.click();
  expect(localStorage.getItem("token")).toBeNull();
});

test("No empty username/password", async () => {
  global.fetch = fetchMock(jest, "");
  const { findByText, ...page } = render(
    <RouterMock>
      <Provider>
        <Index />
      </Provider>
    </RouterMock>
  );
  const getById = queryByAttribute.bind(null, "id");
  const nameInputElement = getById(page.container, "name");
  fireEvent.change(nameInputElement, { target: { value: "John Smith" } });
  const emailInputElement = getById(page.container, "email");
  fireEvent.change(emailInputElement, { target: { value: "username" } });
  const passwordInputElement = getById(page.container, "password");
  fireEvent.change(passwordInputElement, { target: { value: "" } });
  const registerButtonElement = getById(page.container, "register");

  await registerButtonElement.click();
  await findByText("Email and Password cannot be empty");
});

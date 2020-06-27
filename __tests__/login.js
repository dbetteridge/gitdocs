import React from "react";
import { render, fireEvent, queryByAttribute } from "@testing-library/react";
import Index from "../pages/login";
import { StateProvider as Provider } from "../contexts/store";
import RouterMock from "../utils/RouterMock";
import fetchMock from "../utils/FetchMock";
import Themer from "@components/Themed";

test("The login form renders correctly", () => {
  const { getAllByText } = render(
    <RouterMock>
      <Themer>
        <Provider>
          <Index />
        </Provider>
      </Themer>
    </RouterMock>
  );

  const loginButtonElement = getAllByText("Login");
  expect(loginButtonElement[0]).toBeInTheDocument();
});

test("Login API returns token", async () => {
  global.fetch = fetchMock(jest, "result");
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
  const emailInputElement = getById(page.container, "email");
  fireEvent.change(emailInputElement, { target: { value: "username" } });
  const passwordInputElement = getById(page.container, "password");
  fireEvent.change(passwordInputElement, { target: { value: "testpassword" } });
  const loginButtonElement = getById(page.container, "login");

  await loginButtonElement.click();
});

test("Login API returns empty token", async () => {
  global.fetch = fetchMock(jest, "");
  const { findByText, ...page } = render(
    <RouterMock>
      <Provider>
        <Index />
      </Provider>
    </RouterMock>
  );
  const getById = queryByAttribute.bind(null, "id");
  const emailInputElement = getById(page.container, "email");
  fireEvent.change(emailInputElement, { target: { value: "username" } });
  const passwordInputElement = getById(page.container, "password");
  fireEvent.change(passwordInputElement, { target: { value: "testpassword" } });
  const loginButtonElement = getById(page.container, "login");

  await loginButtonElement.click();
  await findByText("Email or Password is incorrect");
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
  const emailInputElement = getById(page.container, "email");
  fireEvent.change(emailInputElement, { target: { value: "username" } });
  const passwordInputElement = getById(page.container, "password");
  fireEvent.change(passwordInputElement, { target: { value: "" } });
  const loginButtonElement = getById(page.container, "login");

  await loginButtonElement.click();
  await findByText("Email and Password cannot be empty");
});

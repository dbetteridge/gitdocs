import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Index from "../pages/login";
import { StateProvider as Provider } from "../contexts/store";
import RouterMock from "../utils/RouterMock";
import fetchMock from "../utils/FetchMock";

test("The login form renders correctly", () => {
  const { getByText, getByLabelText } = render(
    <RouterMock>
      <Provider>
        <Index />
      </Provider>
    </RouterMock>
  );
  const emailInputElement = getByLabelText("Email");
  expect(emailInputElement).toBeInTheDocument();
  const passwordInputElement = getByLabelText("Password");
  expect(passwordInputElement).toBeInTheDocument();
  const loginButtonElement = getByText("Login");
  expect(loginButtonElement).toBeInTheDocument();
});

test("Login API returns token", async () => {
  global.fetch = fetchMock(jest, "result");
  const { getByText, getByLabelText } = render(
    <RouterMock>
      <Provider>
        <Index />
      </Provider>
    </RouterMock>
  );
  const emailInputElement = getByLabelText("Email");
  fireEvent.change(emailInputElement, { target: { value: "username" } });
  const passwordInputElement = getByLabelText("Password");
  fireEvent.change(passwordInputElement, { target: { value: "testpassword" } });
  const loginButtonElement = getByText("Login");

  await loginButtonElement.click();
});

test("Login API returns empty token", async () => {
  global.fetch = fetchMock(jest, "");
  const { getByText, getByLabelText, findByText } = render(
    <RouterMock>
      <Provider>
        <Index />
      </Provider>
    </RouterMock>
  );
  const emailInputElement = getByLabelText("Email");
  fireEvent.change(emailInputElement, { target: { value: "username" } });
  const passwordInputElement = getByLabelText("Password");
  fireEvent.change(passwordInputElement, { target: { value: "testpassword" } });
  const loginButtonElement = getByText("Login");

  await loginButtonElement.click();
  await findByText("Email or Password is incorrect");
});

test("No empty username/password", async () => {
  global.fetch = fetchMock(jest, "");
  const { getByText, getByLabelText, findByText } = render(
    <RouterMock>
      <Provider>
        <Index />
      </Provider>
    </RouterMock>
  );
  const emailInputElement = getByLabelText("Email");
  fireEvent.change(emailInputElement, { target: { value: "username" } });
  const passwordInputElement = getByLabelText("Password");
  fireEvent.change(passwordInputElement, { target: { value: "" } });
  const loginButtonElement = getByText("Login");
  await loginButtonElement.click();
  await findByText("Email and Password cannot be empty");
});

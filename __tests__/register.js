import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Index from "../pages/register";
import { StateProvider as Provider } from "../contexts/store";
import RouterMock from "../utils/RouterMock";
import fetchMock from "../utils/FetchMock";

test("The registration form renders correctly", () => {
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
  const loginButtonElement = getByText("Register");
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
  const nameInputElement = getByLabelText("Name");
  fireEvent.change(nameInputElement, { target: { value: "users name" } });
  const emailInputElement = getByLabelText("Email");
  fireEvent.change(emailInputElement, { target: { value: "username" } });
  const passwordInputElement = getByLabelText("Password");
  fireEvent.change(passwordInputElement, { target: { value: "testpassword" } });
  const loginButtonElement = getByText("Register");

  await loginButtonElement.click();
});

test("Registration API returns err", async () => {
  global.fetch = fetchMock(jest, { error: "Email already exists" });
  const { getByText, getByLabelText, findByText } = render(
    <RouterMock>
      <Provider>
        <Index />
      </Provider>
    </RouterMock>
  );
  const nameInputElement = getByLabelText("Name");
  fireEvent.change(nameInputElement, { target: { value: "users name" } });
  const emailInputElement = getByLabelText("Email");
  fireEvent.change(emailInputElement, { target: { value: "username" } });
  const passwordInputElement = getByLabelText("Password");
  fireEvent.change(passwordInputElement, { target: { value: "testpassword" } });
  const loginButtonElement = getByText("Register");

  await loginButtonElement.click();
  await findByText("Email already exists");
});

test("No empty name/email/password", async () => {
  global.fetch = fetchMock(jest, "");
  const { getByText, getByLabelText, findByText } = render(
    <RouterMock>
      <Provider>
        <Index />
      </Provider>
    </RouterMock>
  );
  const nameInputElement = getByLabelText("Name");
  fireEvent.change(nameInputElement, { target: { value: "users name" } });
  const emailInputElement = getByLabelText("Email");
  fireEvent.change(emailInputElement, { target: { value: "username" } });
  const passwordInputElement = getByLabelText("Password");
  fireEvent.change(passwordInputElement, { target: { value: "" } });
  const loginButtonElement = getByText("Register");
  await loginButtonElement.click();
  await findByText("Username and Password cannot be empty");
});

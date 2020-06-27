import React from "react";
import { render, queryByAttribute } from "@testing-library/react";
import Index from "../pages/index";
import { StateProvider as Provider } from "../contexts/store";
import Themer from "@components/Themed";
import RouterMock from "../utils/RouterMock";

test("renders title h2", () => {
  const { getByText } = render(
    <RouterMock>
      <Themer>
        <Provider>
          <Index />
        </Provider>
      </Themer>
    </RouterMock>
  );
  const linkElement = getByText("A documentation sharing space");
  expect(linkElement).toBeInTheDocument();
  expect(linkElement.nodeName).toEqual("H2");
});

test("render Try it for free button", () => {
  const { getByText } = render(
    <Themer>
      <Provider>
        <Index />
      </Provider>
    </Themer>
  );

  const buttonElement = getByText("Try it out for free");
  expect(buttonElement).toBeInTheDocument();
});

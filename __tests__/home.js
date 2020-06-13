import React from "react";
import { render, queryByAttribute } from "@testing-library/react";
import Index from "../pages/index";
import { StateProvider as Provider } from "../contexts/store";
import Themer from "@components/Themed";
import RouterMock from "../utils/RouterMock";

test("renders Spaces h2", () => {
  const { getByText } = render(
    <RouterMock>
      <Provider>
        <Index />
      </Provider>
    </RouterMock>
  );
  const linkElement = getByText("Spaces");
  expect(linkElement).toBeInTheDocument();
  expect(linkElement.nodeName).toEqual("H2");
});

test("render add spaces button", () => {
  const page = render(
    <Themer>
      <Provider>
        <Index />
      </Provider>
    </Themer>
  );

  const getById = queryByAttribute.bind(null, "id");
  const buttonElement = getById(page.container, "toggleNewSpaceForm");
  expect(buttonElement).toBeInTheDocument();
});

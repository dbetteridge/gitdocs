import { RouterContext } from "next/dist/next-server/lib/router-context";
import PropTypes from "prop-types";
import { useState } from "react";
import Router from "next/router";
import { act } from "react-dom/test-utils";

function RouterMock({ children }) {
  const [pathname, setPathname] = useState("/");

  const mockRouter = {
    pathname,
    prefetch: () => {},
    push: async (newPathname) => {
      act(() => {
        setPathname(newPathname);
      });
      return newPathname;
    },
    query: {},
  };

  Router.router = mockRouter;

  return (
    <RouterContext.Provider value={mockRouter}>
      {children}
    </RouterContext.Provider>
  );
}

RouterMock.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RouterMock;
export { Router };

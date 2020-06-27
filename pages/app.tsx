import Spaces from "@components/Spaces";
import AuthProvider from "@components/AuthProvider";
import { checkLoginStatus } from "../utils/front-helpers";
import { useState, useEffect } from "react";

export default () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(checkLoginStatus());
  });

  return (
    <AuthProvider>
      <Spaces />
    </AuthProvider>
  );
};

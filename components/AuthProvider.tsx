import { checkLoginStatus } from "../utils/front-helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Error from "@components/Error";

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (
      !checkLoginStatus() &&
      router.pathname !== "/login" &&
      router.pathname !== "/register" &&
      router.pathname !== "/" &&
      router.pathname !== "/app"
    ) {
      setLoggedIn(false);
    }
  });

  if (loggedIn) {
    return <Error />;
  }
  return children;
};

export default AuthProvider;

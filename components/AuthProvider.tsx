import { checkLoginStatus } from "../utils/front-helpers";
import { useRouter } from "next/router";
import { useEffect } from "react";

const AuthProvider = ({ children }) => {
  const router = useRouter();
  useEffect(() => {
    if (
      !checkLoginStatus() &&
      router.pathname !== "/login" &&
      router.pathname !== "/register"
    ) {
      router.push("/login", "/login");
    }
  });
  return children;
};

export default AuthProvider;

import router from "next/router";
import { useEffect } from "react";

export default () => {
  useEffect(() => {
    const { invite }: { invite?: string } = router.query;
    if (invite) {
      window.localStorage.setItem("invite", invite);
    }
    router.push("/register", "/register");
  });
  return null;
};

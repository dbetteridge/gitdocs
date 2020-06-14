import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Repos from "@components/Repos";
import { checkLoginStatus } from "@utils/front-helpers";

const Space = () => {
  const router = useRouter();

  useEffect(() => {
    const loggedIn = checkLoginStatus();
    if (!loggedIn) {
      router.push("/login");
    }
  });

  return <Repos />;
};

export default Space;

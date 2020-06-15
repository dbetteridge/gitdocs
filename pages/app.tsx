import React, { useEffect } from "react";

import { useRouter } from "next/router";
import Spaces from "@components/Spaces";
const App = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && router) {
      router.push("/login");
    }
  });

  return <Spaces />;
};

export default App;

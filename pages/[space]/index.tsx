import React, { useEffect } from "react";
import { Flex } from "rebass";
import { useRouter } from "next/router";
import Repos from "@components/Repos";

const Space = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  });

  return (
    <Flex
      flexDirection={"column"}
      justifyContent={"flex-start"}
      alignItems={"center"}
      my={4}
      width={"100%"}
      height={"100%"}
      sx={(props) => ({
        backgroundColor: props.colors.background,
      })}
    >
      <Repos />
    </Flex>
  );
};

export default Space;

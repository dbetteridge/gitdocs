import React, { useEffect } from "react";
import { Flex, Button } from "rebass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import Search from "./Search";

const NavBar = () => {
  const router = useRouter();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const isLogin = router.pathname === "/login";
  const isRegister = router.pathname === "/register";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
  });
  return (
    <Flex
      width={1}
      height={"50px"}
      sx={(props) => ({
        color: props.colors.text,
        backgroundColor: props.colors.gray,
        justifyContent: "space-between",
      })}
      px={1}
      py={1}
    >
      <Button>
        <FontAwesomeIcon icon={faBars} />
      </Button>
      <Search />
      <Flex>
        {!isLoggedIn && !isLogin && (
          <Link href={"/login"}>
            <Button mx={2}>Login</Button>
          </Link>
        )}
        {!isLoggedIn && !isRegister && (
          <Link href={"/register"}>
            <Button mx={2}>Register</Button>
          </Link>
        )}
      </Flex>
    </Flex>
  );
};

export default NavBar;

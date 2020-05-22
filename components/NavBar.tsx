import React from "react";
import { Flex, Button } from "rebass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const NavBar = () => {
  return (
    <Flex
      width={1}
      height={"50px"}
      sx={{
        color: "primary",
        backgroundColor: "lightgrey",
        justifyContent: "space-between",
      }}
      px={1}
      py={1}
    >
      <Button>
        <FontAwesomeIcon icon={faBars} />
      </Button>
      <Flex>
        <Link href={"/login"}>
          <Button mx={2}>Login</Button>
        </Link>
        <Link href={"/register"}>
          <Button mx={2}>Register</Button>
        </Link>
      </Flex>
    </Flex>
  );
};

export default NavBar;

import React, { useEffect } from "react";
import { Flex, Box } from "rebass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import Search from "./Search";
import { Button, Row, Col } from "antd";
import styled from "@emotion/styled";

const StyledRow = styled(Row)`
  background-color: ${(props) => props.theme.colors.primary};
  height: 50px;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
`;

const NavBar = () => {
  const router = useRouter();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const isLogin =
    router.pathname === "/login" || router.pathname === "/register";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
  });
  return (
    <StyledRow>
      <Col xs={8}>
        <Button
          onClick={() => {
            router.push("/", "/");
          }}
        >
          <FontAwesomeIcon icon={faHome} />
        </Button>
        <Button
          onClick={() => {
            router.back();
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>
      </Col>
      <Col xs={8}>
        <Search />
      </Col>
      <Col xs={8}>
        <Flex justifyContent={"flex-end"}>
          {!isLoggedIn && !isLogin && (
            <Link href={"/login"}>
              <Button>Login</Button>
            </Link>
          )}

          {isLoggedIn && (
            <Button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
            >
              Logout
            </Button>
          )}
        </Flex>
      </Col>
    </StyledRow>
  );
};

export default NavBar;

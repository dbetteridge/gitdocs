import styled from "@emotion/styled";
import { faArrowLeft, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Row } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Flex } from "rebass";
import Search from "./Search";
import ThemeI from "types/Theme";
import ProfileMenu from "./ProfileMenu";

const StyledRow: any = styled(Row)<ThemeI>`
  background-color: ${({ theme: { colors } }) => colors.primary};
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
      <Col xs={12}>
        <Button
          onClick={() => {
            router.push("/", "/");
          }}
        >
          <FontAwesomeIcon icon={faHome} />
        </Button>
        {router.pathname !== "/" && (
          <Button
            onClick={() => {
              router.back();
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
        )}
        {router.pathname === "/" && (
          <Button
            onClick={() => {
              router.push("/app", "/app");
            }}
          >
            App
          </Button>
        )}
      </Col>
      {/* <Col xs={8}>
        <Search />
      </Col> */}
      <Col xs={12}>
        <Flex justifyContent={"flex-end"}>
          <ProfileMenu isLoggedIn isLogin />
        </Flex>
      </Col>
    </StyledRow>
  );
};

export default NavBar;

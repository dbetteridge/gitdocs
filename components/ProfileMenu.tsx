import React, { useState } from "react";
import { Popover, Button, Row, Col, Space } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

const ProfileMenu = ({ isLoggedIn, isLogin }) => {
  const [closed, setClosed] = useState(true);
  const router = useRouter();
  return (
    <Popover
      visible={!closed}
      trigger={"click"}
      onVisibleChange={() => {
        setClosed(!closed);
      }}
      content={
        <Row>
          <Col xs={24}>
            <Space direction={"vertical"}>
              {!isLoggedIn && !isLogin && (
                <Link href={"/login"}>
                  <Button>Login</Button>
                </Link>
              )}

              {isLoggedIn && (
                <Button
                  style={{ width: "100%" }}
                  onClick={() => {
                    setClosed(true);
                    router.push("/contact", "/contact");
                  }}
                >
                  Support
                </Button>
              )}

              {isLoggedIn && (
                <Button
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.reload();
                  }}
                  style={{ width: "100%" }}
                >
                  Logout
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      }
    >
      <Button>
        <FontAwesomeIcon icon={faUserCircle} />
      </Button>
    </Popover>
  );
};

export default ProfileMenu;

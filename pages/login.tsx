import LoginForm from "@components/LoginForm";
import RegistrationForm from "@components/RegistrationForm";
import { Tabs, Row, Col } from "antd";

import React from "react";
import { useRouter } from "next/router";

const Tab = Tabs.TabPane;

const Login = () => {
  const router = useRouter();
  return (
    <Row>
      <Col md={8} xs={2}></Col>
      <Col md={8} xs={20}>
        <Tabs
          defaultActiveKey="1"
          onTabClick={() => router.push("/register", "/register")}
        >
          <Tab tab="Login" key="1">
            <LoginForm />
          </Tab>
          <Tab tab="Register" key="2">
            <RegistrationForm />
          </Tab>
        </Tabs>
      </Col>
      <Col md={8} xs={2}></Col>
    </Row>
  );
};

export default Login;

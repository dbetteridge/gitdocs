import React from "react";
import StyledCard from "@components/StyledCard";
import styled from "@emotion/styled";
import { Spin, Row, Col, Card, Button, Typography, Space } from "antd";
import { useRouter } from "next/router";

const { Paragraph } = Typography;

const StyledRow = styled(Row)`
  height: calc(100vh - 50px - 4rem);
  margin-top: 2rem;
`;

const Error = () => {
  const router = useRouter();
  return (
    <StyledRow>
      <Col xs={2}></Col>
      <Col xs={20}>
        <StyledCard>
          <Row style={{ height: "100%" }}>
            <Col
              xs={24}
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <Space direction={"vertical"} style={{ textAlign: "center" }}>
                <Paragraph>Please Sign in or Sign up to access </Paragraph>
                <Button
                  onClick={() => {
                    router.push("/login", "/login");
                  }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    router.push("/register", "/register");
                  }}
                >
                  Register
                </Button>
              </Space>
            </Col>
          </Row>
        </StyledCard>
      </Col>
      <Col xs={2} />
    </StyledRow>
  );
};

export default Error;

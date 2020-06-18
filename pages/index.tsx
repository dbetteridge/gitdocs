import React from "react";
import { Row, Col, Typography, Comment, Button } from "antd";
import StyledCard from "@components/StyledCard";
import Title from "antd/lib/typography/Title";
import Link from "next/link";
const { Paragraph } = Typography;

const index = () => {
  return (
    <StyledCard
      style={{ margin: "2rem", minHeight: "calc(100vh - 50px - 4rem)" }}
    >
      <Row style={{ width: "100%", minHeight: "calc(100vh - 50px - 4rem)" }}>
        <Col xs={2}></Col>
        <Col xs={20}>
          <Title level={2}>A documentation sharing space</Title>
          <Paragraph>
            Share documentation from your git repositories with people more
            easily (Full markdown support)
          </Paragraph>
          <Paragraph>
            Simply add repositories (Github and Azure Devops are currently
            supported)
          </Paragraph>
          <Paragraph>
            Automatically generated table of contents per repository
          </Paragraph>
          <br />
          <div style={{ textAlign: "center" }}>
            <Link href="/register">
              <Button>Try it out for free</Button>
            </Link>
          </div>
          <Paragraph style={{ fontSize: "0.7rem", textAlign: "center" }}>
            While we are in beta
          </Paragraph>
          <img src={"/Repositories.png"} width={"100%"} />
          <img src={"/TOC.png"} width={"100%"} />
          <img src={"/Document.png"} width={"100%"} />
        </Col>
        <Col xs={2}></Col>
      </Row>
    </StyledCard>
  );
};

export default index;

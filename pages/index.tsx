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
      <Row style={{ width: "100%", maxHeight: "calc(100vh - 50px - 4rem)" }}>
        <Col md={6} xs={2}></Col>
        <Col md={12} xs={20}>
          <Title level={2}>A documentation sharing space</Title>
          <Paragraph>
            Share documentation from your git repositories with people more
            easily (Full markdown support)
          </Paragraph>
          <Paragraph>
            Simply add repositories (Github and Azure Devops are currently
            supported)
          </Paragraph>
          <Paragraph>Access is given securely using OAuth</Paragraph>
          <Title level={3}>Features</Title>
          <ul>
            <li>
              You can share your document spaces with anyone regardless of their
              access to your git repositories
            </li>
            <li>
              The markdown files are downloaded, converted to HTML and stored in
              an access controlled database
            </li>
            <li>
              Styling is applied at load to make them readable on mobile, tablet
              and desktop
            </li>
            <li>Automatically generated table of contents per repository</li>
            <li>
              Clicking through from your repository will show the table of
              contents and you can select a file to view
            </li>
          </ul>
          <br />
          <div style={{ textAlign: "center" }}>
            <Link href="/register">
              <Button>Try it out for free</Button>
            </Link>
          </div>
          <Paragraph style={{ fontSize: "0.7rem", textAlign: "center" }}>
            While we are in beta
          </Paragraph>

          <div style={{ textAlign: "center" }}>
            <Link href="/contact">
              <Button>For Support</Button>
            </Link>
          </div>
          <br />
        </Col>
        <Col md={6} xs={2}></Col>
      </Row>

      <Row style={{ width: "100%", justifyContent: "center" }}>
        <Col md={8} xs={20}>
          <img
            src={"/Repositories.png"}
            width={"100%"}
            style={{ maxWidth: "800px" }}
          />
        </Col>

        <Col md={8} xs={20}>
          <img src={"/TOC.png"} width={"100%"} style={{ maxWidth: "800px" }} />
        </Col>
        <Col md={8} xs={20}>
          <img
            src={"/Document.png"}
            width={"100%"}
            style={{ maxWidth: "800px" }}
          />
        </Col>
      </Row>
    </StyledCard>
  );
};

export default index;

import React from "react";
import { Row, Col, Typography } from "antd";
import StyledCard from "@components/StyledCard";
const { Paragraph, Title } = Typography;

const contact = () => {
  return (
    <StyledCard
      style={{ margin: "2rem", minHeight: "calc(100vh - 50px - 4rem)" }}
    >
      <Row style={{ width: "100%", maxHeight: "calc(100vh - 50px - 4rem)" }}>
        <Col xs={24}>
          <Title>Contact</Title>
          <Paragraph>
            For any bugs or issues you run into please send me an email at the
            below address.
          </Paragraph>
          <Paragraph>
            <a href={"mailto:admin@gitdocs.page"}>admin@gitdocs.page</a>
          </Paragraph>
        </Col>
      </Row>
    </StyledCard>
  );
};

export default contact;

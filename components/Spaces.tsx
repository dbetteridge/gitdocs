import { useRouter } from "next/router";
import { Spin, Row, Col, Card } from "antd";
import styled from "@emotion/styled";
import { useEffect } from "react";
import StyledCard from "./StyledCard";

const fetchSpaces = async (router) => {
  const spaces = await fetch("/api/spaces", {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  })
    .then((d) => {
      if (!d.ok) {
        // window.location.replace("/login");
      } else {
        return d;
      }
    })
    .then((d) => d.json());
  if (spaces.length > 0) {
    router.push("/[space]", `/${spaces[0].id}`);
  } else {
    router.push("/createspace", "/createspace");
  }
};

const StyledRow = styled(Row)`
  height: calc(100vh - 50px - 4rem);
  margin-top: 2rem;
`;

const Spaces = () => {
  const router = useRouter();

  useEffect(() => {
    fetchSpaces(router);
  }, []);

  return (
    <StyledRow>
      <Col xs={2}></Col>
      <Col xs={20}>
        <StyledCard>
          <Spin />
        </StyledCard>
      </Col>
      <Col xs={2}></Col>
    </StyledRow>
  );
};

export default Spaces;

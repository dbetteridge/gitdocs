import { useRouter } from "next/router";
import { Spin, Row, Col, Card } from "antd";
import styled from "@emotion/styled";

const fetchSpaces = async (router) => {
  const spaces = await fetch("/api/spaces", {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  })
    .then((d) => {
      if (!d.ok) {
        window.location.replace("/login");
      } else {
        return d;
      }
    })
    .then((d) => d.json());
  router.push("/[space]", `/${spaces[0].id}`);
};

const StyledCard = styled(Card)`
  background-color: ${(props) => props.theme.colors.muted};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const StyledRow = styled(Row)`
  height: 330px;
  margin-top: 2rem;
`;

const Spaces = () => {
  const router = useRouter();

  fetchSpaces(router);
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

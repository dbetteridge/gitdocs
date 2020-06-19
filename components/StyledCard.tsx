import ThemeI from "types/Theme";
import { Card } from "antd";
import styled from "@emotion/styled";

const StyledCard = styled(Card)<ThemeI>`
  background-color: ${(props) => props.theme.colors.muted};
  height: 100%;
  .ant-card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
`;

export default StyledCard;

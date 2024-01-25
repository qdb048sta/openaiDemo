import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  margin: auto;
  padding: 20px;
  box-sizing: border-box;
`;

export const Title = styled.div`
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 1rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Content = styled.div`
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.3);
`;

export const MessageBox = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  color: #dbdee1;
  background-color: ${(props) =>
    props.role === "user" ? "#e6f7ff" : "#2b2d31"};
  font-size: 13px;
  border-radius: 8px;
  border: 1px solid #232428;
`;

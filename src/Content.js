import React from "react";
import styled from "styled-components";
import MarkdownComponent from "./markDown.js";
import CodeBlock from "./CodeBlock";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  padding-left: 20%;
  margin: auto;
`;

const Content = ({ errorData }) => {
  const errorStack = errorData?.key && JSON.parse(errorData.key).stack;
  const message = errorData?.value?.result;
  return (
    <Container>
      {errorStack && (
        <CodeBlock errorExplanation={{ errorComponent: errorStack }} />
      )}
      {message && <MarkdownComponent markdownContent={{ message }} />}
    </Container>
  );
};

export default Content;

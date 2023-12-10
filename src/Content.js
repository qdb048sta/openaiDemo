import React from "react";
import styled from "styled-components";
import MarkdownComponent from "./markDown.js";
import CodeBlock from "./CodeBlock";

const Container = styled.div`
  display: flex;
  width: 100%;
  padding-left: 20%;
  margin: auto;
  flex-direction: column;
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

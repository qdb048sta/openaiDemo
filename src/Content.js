import React from "react";
import styled from "styled-components";
import MarkdownComponent from "./markDown.js";
import CodeBlock from "./CodeBlock";
import * as dayjs from "dayjs";

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
  const timestamp = dayjs(errorData?.value?.timestamp).format(
    "YYYY-MM-DD hh:mm:ss"
  );
  return (
    <Container>
      {errorStack && (
        <CodeBlock
          errorExplanation={{ errorComponent: errorStack, timestamp }}
        />
      )}
      {message && <MarkdownComponent markdownContent={{ message }} />}
    </Container>
  );
};

export default Content;

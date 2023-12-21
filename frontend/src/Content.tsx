import React, { FC} from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import MarkdownComponent from "./markDown";
import CodeBlock from "./CodeBlock";

interface ContentProps {
  errorData: {
    key: string;
    value: {
      result: string;
      timestamp: string;
    };
  } | null;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  padding-left: 20%;
  margin: auto;
`;

const Content: FC<ContentProps> = ({ errorData }) => {
  const errorStack = errorData?.key && JSON.parse(errorData.key).stack;
  const message = errorData?.value?.result;
  const timestamp = dayjs(errorData?.value?.timestamp).format(
    "YYYY-MM-DD hh:mm:ss"
  );
  return (
    <Container>
      {errorStack && (
        <CodeBlock errorExplanation={{ errorComponent: errorStack, timestamp }} />
      )}
      {message && <MarkdownComponent markdownContent={{ message }} />}
    </Container>
  );
};

export default Content;

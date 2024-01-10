import React, { FC } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import MarkdownComponent, { wrapCodeBlock } from "./markDown";
import ChatInput from "./ChatInput";
import { ErrorData } from "./api";

interface ContentProps {
  errorData: ErrorData | undefined;
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
  const timestamp = dayjs(errorData?.timestamp).format("YYYY-MM-DD hh:mm:ss");
  return (
    <Container>
      {errorStack && (
        <MarkdownComponent
          key={errorStack}
          title="Error Stack"
          markdownContent={{ message: wrapCodeBlock(errorStack) }}
          timestamp={timestamp}
        />
      )}
      {errorData?.memory?.map(({ from, content }, index) => {
        if (from === "ai") {
          return (
            <MarkdownComponent
              key={content}
              title="AI Response"
              markdownContent={{ message: content }}
            />
          );
        } else if (from === "user") {
          return (
            <MarkdownComponent
              key={content}
              title="User"
              markdownContent={{ message: content }}
            />
          );
        }
      })}
      {errorData?.status === "pending" && (
        <MarkdownComponent title="" markdownContent={{ message: "loading" }} />
      )}
      {errorStack && <ChatInput errorData={errorData} />}
    </Container>
  );
};

export default Content;

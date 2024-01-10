import React, { FC } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"; // Choose your preferred style
import { Container, Title, Content, Header, MessageBox } from "./styles";

interface MarkdownComponentProps {
  markdownContent: {
    message: string;
  };
  title: string;
  timestamp?: string;
}

export const wrapCodeBlock = (code: string) => `\`\`\`\n${code}\n\`\`\``;

const MarkdownComponent: FC<MarkdownComponentProps> = ({
  markdownContent,
  title,
  timestamp,
}) => {
  const messages = [{ role: "users" }];
  const sections = markdownContent.message.split("```");

  return (
    <Container>
      <Content>
        <Header>
          <Title>{title}</Title>
          {timestamp && <span>{timestamp}</span>}
        </Header>
        {messages.map((message, index) => (
          <MessageBox key={index} role={message.role}>
            <pre
              style={{
                whiteSpace: "pre-wrap", // or "pre-line" depending on your preference
                wordWrap: "break-word",
              }}
            >
              {sections.map((section, index) => {
                if (index % 2 === 0) {
                  // Regular text section
                  return <ReactMarkdown>{section.trim()}</ReactMarkdown>;
                } else {
                  // Code section
                  const filteredCode = section.split("\n").slice(1).join("\n");
                  return (
                    <SyntaxHighlighter
                      language={"javascript"}
                      style={vscDarkPlus}
                    >
                      {filteredCode.trim()}
                    </SyntaxHighlighter>
                  );
                }
              })}
            </pre>
          </MessageBox>
        ))}
      </Content>
    </Container>
  );
};

export default MarkdownComponent;

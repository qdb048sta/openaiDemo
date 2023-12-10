import React from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"; // Choose your preferred style

const Container = styled.div`
  width: -webkit-fill-available;
  width: -moz-fill-available;
  width: -moz-available;
  width: fill-available;
  margin: auto;
  padding: 0 20px 0;
`;

const MessageBox = styled.div`
  padding: 10px;
  marginBottom: 10px;
  borderRadius: 8px;
  color: #dbdee1;
  background-color: ${props => props.role === "user" ? "#e6f7ff" : "#2b2d31"};
  font-size: 13px;
  border-radius: 8px;
  border: 1px solid #232428;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 1rem;
`;

const MarkdownComponent = ({ markdownContent }) => {
  const messages = [{ role: "users" }];
  console.log(markdownContent);
  const sections = markdownContent.message.split("```");

  return (
    <Container>
      {messages.map((message, index) => (
        <MessageBox
          key={index}
          role={message.role}
        >
          <Title>Possible Solution:</Title>
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
    </Container>
  );
};

export default MarkdownComponent;

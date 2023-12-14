import React, { FC } from "react";
import styled from "styled-components";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  errorExplanation: {
    errorComponent: string;
    timestamp: string;
  };
}

const Container = styled.div`
  width: 100%;
  margin: auto;
  padding: 20px;
  box-sizing: border-box;
`;

const HighlightContainer = styled.div`
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.3);
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CodeBlock: FC<CodeBlockProps> = ({ errorExplanation }) => {
  return (
    <Container>
      <HighlightContainer>
        <Header>
          <Title>Problematic Code</Title>
          <span>{errorExplanation.timestamp}</span>
        </Header>
        <pre>
          <SyntaxHighlighter language={"javascript"} style={vscDarkPlus}>
            {errorExplanation.errorComponent}
          </SyntaxHighlighter>
        </pre>
      </HighlightContainer>
    </Container>
  );
};

export default CodeBlock;

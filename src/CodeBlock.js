import React from "react";
import styled from "styled-components";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const Container = styled.div`
  width: fill-available;
  margin: auto;
  padding: 20px;
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

const CodeBlock = ({ errorExplanation }) => {
  return (
    <Container>
      <HighlightContainer>
        <Title>Problematic Code</Title>
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

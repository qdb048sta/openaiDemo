import React from "react";
import styled from "styled-components";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// Styled components for the CodeBlock
const Container = styled.div`
  max-width: 100%;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const HighlightContainer = styled.div`
  background-color: #e6f7ff;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
`;

const CodeBlock = ({ errorExplanation }) => {
  return (
    <Container>
      <HighlightContainer>
        <h2>Problematic Code</h2>
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

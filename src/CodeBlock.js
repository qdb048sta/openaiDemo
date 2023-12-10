import React from "react";
import styled from "styled-components";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const Container = styled.div`
  width: -webkit-fill-available;
  width: -moz-fill-available;
  width: -moz-available;
  width: fill-available;
  margin: auto;
  padding: 20px;
`;

const HighlightContainer = styled.div`
  background-color: #e6f7ff;
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 8px;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 1rem;
`;

// Styled components for the CodeBlock
// const Container = styled.div`
//   max-width: 100%;
//   margin: auto;
//   padding: 20px;
//   border: 1px solid #ccc;
//   border-radius: 8px;
//   box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
// `;

// const HighlightContainer = styled.div`
//   background-color: #e6f7ff;
//   padding: 10px;
//   margin-bottom: 10px;
//   border-radius: 8px;
// `;

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

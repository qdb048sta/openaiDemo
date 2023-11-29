import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"; // Choose your preferred style

const CodeBlock = ({ errorExplanation }) => {
  return (
    <div>
      <div
        style={{
          maxWidth: "800px",
          margin: "auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "auto",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              backgroundColor: "#e6f7ff",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h2>Problematic Code</h2>
            <pre
              style={{
                whiteSpace: "pre-wrap", // or "pre-line" depending on your preference
                wordWrap: "break-word",
                overflow: "auto",
              }}
            >
              <SyntaxHighlighter language={"javascript"} style={vscDarkPlus}>
                {errorExplanation.errorComponent}
              </SyntaxHighlighter>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;

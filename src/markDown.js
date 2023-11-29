import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"; // Choose your preferred style

const MarkdownComponent = ({ markdownContent }) => {
  const messages = [{ role: "users" }];
  console.log(markdownContent);
  const sections = markdownContent.message.split("```");

  return (
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
      {messages.map((message, index) => (
        <div
          key={index}
          style={{
            backgroundColor: message.role === "user" ? "#e6f7ff" : "#f0f0f0",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <h2>Possible Solution:</h2>
          <pre
            style={{
              whiteSpace: "pre-wrap", // or "pre-line" depending on your preference
              wordWrap: "break-word",
              overflow: "auto",
            }}
          >
            {sections.map((section, index) => {
              if (index % 2 === 0) {
                // Regular text section
                return <ReactMarkdown>{section.trim()}</ReactMarkdown>;
              } else {
                // Code section
                return (
                  <SyntaxHighlighter
                    language={"javascript"}
                    style={vscDarkPlus}
                  >
                    {section.trim()}
                  </SyntaxHighlighter>
                );
              }
            })}
          </pre>
        </div>
      ))}
    </div>
  );
};

export default MarkdownComponent;

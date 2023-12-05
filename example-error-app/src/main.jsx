import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

window.addEventListener("error", ({ error }) => {
  const errorJson = JSON.stringify({
    message: error.message,
    stack: error.stack,
  });
  fetch("/api/langChain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: errorJson }),
  });
  navigator.clipboard.writeText(errorJson).then(() => {
    // alert("An error has been copied to the clipboard");
  });
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

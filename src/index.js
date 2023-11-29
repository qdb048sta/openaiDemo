import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import MarkdownComponent from "../src/markDown.js";
import CodeBlock from "../src/errorCode.js";
import { Provider } from "react-redux";
import { reducer as formReducer } from "redux-form";
import { createStore, combineReducers } from "redux";
import axios from "axios";

const rootReducer = combineReducers({
  // Add other reducers here
  form: formReducer,
});

// Create the Redux store
const store = createStore(rootReducer);

const App = () => {
  const [data, setData] = useState(null);

  const errorExplanation = {
    errorComponent: `import React from "react";

    const CodeBlock = ({ errorExplanation }) => {
      console.log(errorExplanation);
    
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
                <code>{errorExplanation.errorCode}</code>
              </pre>
            </div>
          </div>
        </div>
      );
    };
    
    export default CodeBlock;`,
    //errorCode: "Help me to do the code review",
    errorCode: "Cannot read properties of undefined (reading 'price')",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8443/langChain",
          errorExplanation,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Provider store={store}>
      <div>
        <CodeBlock errorExplanation={errorExplanation} />
        {data && <MarkdownComponent markdownContent={data} />}
      </div>
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

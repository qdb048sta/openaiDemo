import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import ReactDOM from "react-dom";
// import { Provider } from "react-redux";
// import { reducer as formReducer } from "redux-form";
// import { createStore, combineReducers } from "redux";
import SideBar from "./SideBar";
import Content from "./Content";
import "./reset.css";

// const rootReducer = combineReducers({
//   // Add other reducers here
//   form: formReducer,
// });

// Create the Redux store
// const store = createStore(rootReducer);

const Container = styled.div`
  display: flex;
  max-width: 100%;
  margin: auto;
  font-family: Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono",
    "Courier New", monospace;
`;

const App = () => {
  const [data, setData] = useState(null);
  const [activeItem, setActiveItem] = useState(0);
  const errorData = data && data[activeItem || 0];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8443/langChain");
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  return (
    <Container>
      <SideBar
        data={data}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      <Content errorData={errorData} />
    </Container>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

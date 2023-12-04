import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
// import { Provider } from "react-redux";
// import { reducer as formReducer } from "redux-form";
// import { createStore, combineReducers } from "redux";
import SideBar from './SideBar';
import Content from './Content';
import './reset.css';

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
`;

const App = () => {
  return (
    <Container>
      <SideBar />
      <Content />
    </Container>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

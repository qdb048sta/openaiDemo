import React, { useState, FC } from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import SideBar from "./SideBar";
import Content from "./Content";
import "./reset.css";
import { QUERY_KEYS, getAi } from "./api";

const queryClient = new QueryClient();

const Container = styled.div`
  display: flex;
  max-width: 100%;
  margin: auto;
  font-family: Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono",
    "Courier New", monospace;
`;

const App: FC = () => {
  const [activeItem, setActiveItem] = useState<number>(0);
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.getAi],
    queryFn: getAi,
    refetchInterval: 10000,
  });
  const errorData = data && data[activeItem || 0];
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

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
  document.getElementById("root")
);

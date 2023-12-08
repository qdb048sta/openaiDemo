import React, { useState } from "react";
import styled from "styled-components";

// Styled components for the layout
// const Container = styled.div`
//   display: flex;
//   max-width: 1200px;
//   margin: auto;
// `;

const Sidebar = styled.div`
  width: 20%;
  height: 100%;
  background-color: #000;
  color: white;
  font-family: serif;
  position: fixed;
`;

const SidebarTitle = styled.h2`
  font-size: 120%;
  font-weight: 700;
  letter-spacing: 0.2rem;
  padding: 1.5rem 1rem 1.5rem;
  text-transform: uppercase;
  user-select: none;
`;

const SidebarItem = styled.div`
  background: transparent;
  padding: 0.8445rem 1rem;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  user-select: none;

  &:hover,
  &.active {
    background-color: rgb(204, 204, 204, 50%);
    color: Black;
  }
`;

const Layout = ({ data, activeItem, setActiveItem }) => {
  return (
    <Sidebar>
      <SidebarTitle>History</SidebarTitle>
      {data?.map((item, index) => {
        {
          const { key } = item;
          const errorMessage = key && JSON.parse(key).message;
          return (
            <SidebarItem
              key={index}
              className={activeItem === index ? "active" : ""}
              onClick={() => setActiveItem(index)}
            >
              {errorMessage}
            </SidebarItem>
          );
        }
      })}
    </Sidebar>
  );
};

export default Layout;

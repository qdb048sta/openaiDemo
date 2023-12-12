import React, { useState } from "react";
import styled from "styled-components";

const Sidebar = styled.div`
  width: 20%;
  height: 100%;
  background-color: rgba(17, 24, 39);
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  position: fixed;
  padding-top: 1rem;
`;

const SidebarItem = styled.div`
  background: transparent;
  padding: 1rem;
  margin: 0.5rem 1rem;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  user-select: none;
  color: #8392a5;
  border-radius: 0.5rem;

  &:hover,
  &.active {
    background-color: #2c3e50;
    color: #f5f6fa;
  }
`;

const Layout = ({ data, activeItem, setActiveItem }) => {
  return (
    <Sidebar>
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

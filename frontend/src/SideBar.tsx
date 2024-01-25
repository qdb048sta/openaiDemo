import React, { FC } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { groupBy } from "lodash";
import { ErrorData } from "./api";

interface LayoutProps {
  data: ErrorData[] | undefined;
  activeItem: number;
  setActiveItem: React.Dispatch<React.SetStateAction<number>>;
}

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
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  user-select: none;
  color: #8392a5;
  border-radius: 0.5rem;
`;

const SidebarDayText = styled(SidebarItem)`
  font-size: small;
  color: #637285;
`;

const SidebarButton = styled(SidebarItem)`
  cursor: pointer;
  &:hover,
  &.active {
    background-color: #2c3e50;
    color: #f5f6fa;
  }
`;

const Layout: React.FC<LayoutProps> = ({ data, activeItem, setActiveItem }) => {
  const timeGroup = Object.entries(
    groupBy(data, (v) => dayjs(v.timestamp).format("YYYY-MM-DD"))
  );
  return (
    <Sidebar>
      {timeGroup?.map(([day, items]) => (
        <div>
          <SidebarDayText>{day}</SidebarDayText>
          {items.map((item, index) => {
            const { key } = item;
            const errorMessage = key && JSON.parse(key).message;
            return (
              <SidebarButton
                key={index}
                className={activeItem === index ? "active" : ""}
                onClick={() => setActiveItem(index)}
              >
                {errorMessage}
              </SidebarButton>
            );
          })}
        </div>
      ))}
    </Sidebar>
  );
};

export default Layout;

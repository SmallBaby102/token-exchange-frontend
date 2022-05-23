import React, { useEffect } from "react";
import { useSelector } from 'react-redux';

const PageContainer = ({ ...props }) => {
  const theme = useSelector(state => state.layout.theme);

  useEffect(() => {
    document.body.className = `nk-body bg-white npc-default has-sidebar no-touch nk-nio-theme ${
      theme === "dark" ? "dark-mode" : ""
    }`;
  }, [ theme ]);

  return (
    <React.Fragment>
      <div className="nk-app-root">
        <div className="nk-wrap nk-wrap-nosidebar">
          <div className="nk-content">{props.children}</div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default PageContainer;

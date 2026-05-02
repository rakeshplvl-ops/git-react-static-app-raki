import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { useToast } from "../../contexts/ToastContext";
import { Outlet } from "react-router-dom";

function AppLayout() {

  return (
    <div className="app-layout" style={{ display: "flex", width: "100%" }}>
      <Sidebar />
      <div 
        className="main-content-wrapper"
        style={{ 
          flex: 1, 
          padding: "2rem", 
          paddingRight: "3rem", 
          display: "flex", 
          flexDirection: "column",
          marginLeft: "280px", 
          maxWidth: "1150px" 
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;

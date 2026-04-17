import Sidebar from "../SideBar";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;

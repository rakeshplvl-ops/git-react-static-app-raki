import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";

function ProtectedRoute({ children }) {
  const { isLoggedIn, isLoading } = useAuth();
  console.log("protected route", isLoggedIn);

  if (isLoading) {
    return <div style={{ color: "white" }}>Loading...</div>; // 👈 or spinner
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

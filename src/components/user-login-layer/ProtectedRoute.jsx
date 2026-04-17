import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();

  console.log("ProtectedRoute - isLoggedIn:", isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

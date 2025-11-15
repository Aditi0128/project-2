/ src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  // Optional: Restrict admin panel
  const adminEmail = "admin@example.com"; // change this
  if (adminOnly && user.email !== adminEmail) {
    return <Navigate to="/" replace />;
  }

  return children;
}

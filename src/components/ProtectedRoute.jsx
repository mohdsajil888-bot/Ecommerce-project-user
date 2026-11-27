import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../features/auth/authSlice";

export default function ProtectedRoute({ children, role = "user" }) {
  const user = useSelector(selectAuthUser);
  const location = useLocation();

  // Redirect unauthenticated visitors to the single login page
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  const currentRole = user.role || "user";

  // Check admin authentication
  if (role === "admin") {
    if (currentRole === "admin") {
      return children || <Outlet />;
    }

    return <Navigate to="/" replace />;
  }

  // Check customer authentication
  if (role === "user") {
    if (currentRole === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return children || <Outlet />;
  }

  return <Navigate to="/" replace />;
}


import { Navigate, Outlet } from "react-router-dom";

interface AdminRouteProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AdminRoute = ({ isAuthenticated, isAdmin }: AdminRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;

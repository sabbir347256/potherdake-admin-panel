import { useContext } from "react";
import { AuthProvider } from "../../AuthProvider/CreateContext";
import { Navigate, Outlet, useLocation } from "react-router";
import { Loader2 } from "lucide-react";

const AgentPrivateRoute = () => {
   const { user, loading } = useContext(AuthProvider);
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (user && user.role === 'AGENT' ||  user?.role === 'ADMIN') {
        return <Outlet></Outlet>;
    }

    return <Navigate to="/admin-login" state={{ from: location }} replace />;
};

export default AgentPrivateRoute;
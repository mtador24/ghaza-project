
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

export function AuthMiddleware({ children }: AuthMiddlewareProps) {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("gaza-admin-token");
    const user = localStorage.getItem("gaza-admin-user");
    
    if (token && user) {
      // In a real app, we would verify the token's validity
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);
  
  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block border-4 border-t-gaza-primary border-r-gaza-primary border-b-muted border-l-muted rounded-full w-12 h-12 animate-spin"></div>
          <p className="mt-4 text-lg">جاري التحقق من صلاحياتك...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  // If authenticated, render children
  return <>{children}</>;
}

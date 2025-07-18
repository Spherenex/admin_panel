



// // components/auth/ProtectedRoute.js
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { currentUser, userRole, loading } = useAuth();

//   // For debugging purposes
//   console.log("ProtectedRoute - Current User:", currentUser);
//   console.log("ProtectedRoute - User Role:", userRole);
//   console.log("ProtectedRoute - Allowed Roles:", allowedRoles);
  
//   // Show loading spinner while checking authentication
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }
  
//   // If not logged in, redirect to login
//   if (!currentUser) {
//     console.log("ProtectedRoute - No current user, redirecting to login");
//     return <Navigate to="/login" replace />;
//   }
  
//   // If no specific roles are required, allow access to any authenticated user
//   if (!allowedRoles || allowedRoles.length === 0) {
//     console.log("ProtectedRoute - No roles required, granting access");
//     return children;
//   }
  
//   // Case insensitive check for role
//   const userRoleLower = userRole?.toLowerCase();
//   const allowedRolesLower = allowedRoles.map(role => role.toLowerCase());
  
//   // Check if user has required role
//   if (!allowedRolesLower.includes(userRoleLower)) {
//     console.log(`ProtectedRoute - User role "${userRole}" not in allowed roles, redirecting`);
    
//     // Redirect to appropriate dashboard based on actual role
//     switch (userRoleLower) {
//       case 'admin':
//         return <Navigate to="/admin/AdminDashboard" replace />;
//       case 'supplier':
//         return <Navigate to="/supplier/supplierDashboard" replace />;
//       case 'veterinary':
//         return <Navigate to="/veterinary/vetDashboard" replace />;
//       case 'user':
//         return <Navigate to="/dashboard" replace />;
//       default:
//         console.log("ProtectedRoute - Unknown role, redirecting to login");
//         return <Navigate to="/login" replace />;
//     }
//   }
  
//   // User is authenticated and has required role, render children
//   console.log("ProtectedRoute - Access granted to:", userRole);
//   return children;
// };

// export default ProtectedRoute;



// components/auth/ProtectedRoute.js
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole, loading } = useAuth();
  const navigate = useNavigate();

  // For debugging purposes
  useEffect(() => {
    console.log("ProtectedRoute - Current User:", currentUser);
    console.log("ProtectedRoute - User Role:", userRole);
    console.log("ProtectedRoute - Allowed Roles:", allowedRoles);
  }, [currentUser, userRole, allowedRoles]);
  
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  // If not logged in, redirect to login
  if (!currentUser) {
    console.log("ProtectedRoute - No current user, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  // If no specific roles are required, allow access to any authenticated user
  if (!allowedRoles || allowedRoles.length === 0) {
    console.log("ProtectedRoute - No roles required, granting access");
    return children;
  }
  
  // Case insensitive check for role
  const userRoleLower = userRole ? userRole.toLowerCase() : '';
  const allowedRolesLower = allowedRoles.map(role => role.toLowerCase());
  
  // Check if user has required role
  if (!allowedRolesLower.includes(userRoleLower)) {
    console.log(`ProtectedRoute - User role "${userRole}" not in allowed roles, redirecting`);
    
    // Redirect to appropriate dashboard based on actual role
    let redirectPath = '/login';
    
    switch (userRoleLower) {
      case 'admin':
        redirectPath = '/admin/AdminDashboard';
        break;
      case 'supplier':
        redirectPath = '/supplier/supplierDashboard';
        break;
      case 'veterinary':
        redirectPath = '/veterinary/vetDashboard';
        break;
      case 'user':
        redirectPath = '/dashboard';
        break;
      default:
        redirectPath = '/login';
    }
    
    console.log(`Redirecting to: ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }
  
  // User is authenticated and has required role, render children
  console.log("ProtectedRoute - Access granted to:", userRole);
  return children;
};

export default ProtectedRoute;
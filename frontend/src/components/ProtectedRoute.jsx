import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth} from '../context/AuthContext';

const ProtectedRoute= ({ children, allowedRoles=[]})=>{
    const { user, isAuthenticated, isLoading}= useAuth();

    if(isLoading){
        return <div>Loading...</div>
    }

    if(!isAuthenticated){
        return <Navigate to ="/login" replace />;
    }

    if(allowedRoles.length> 0 && !allowedRoles.includes(user?.role)){
        if(user?.role === 'user'){
            return <Navigate to = "/my-tickets" replace />;
        } else{
            return <Navigate to= "/dashboard" replace />
        }
    }

    return children;
};

export default ProtectedRoute;
import React, { createContext, useState, useEffect, useContext} from 'react';

import { getCurrentUser,logout as logoutUser, isAuthenticated } from '../services/authApi';

const AuthContext= createContext();

export const useAuth = ()=>{
    const context= useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider= ({ children })=>{
    const [user, setUser]= useState(null);
    const [loading, setLoading]= useState(true);

    useEffect(()=>{
        // check if usser is logged in
        const currentUser= getCurrentUser();
        if(currentUser){
            setUser(currentUser);
        }
        setLoading(false);
    }, []);
    const login= (userData)=>{
        setUser(userData);
    };
    const logout=()=>{
        logoutUser();
        setUser(null);
    };

    const updateUser= (userData)=>{
        setUser(prev=>({...prev, ...userData}));
    };

    const value={
        user,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isLoading: loading
    };

    return(
        <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
    )
}
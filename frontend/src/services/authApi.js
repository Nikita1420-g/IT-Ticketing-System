import axios from 'axios';

const API_URL= 'https://it-service-backend-sons.onrender.com/api/auth';

// Register new user
export const register= async(userData)=>{
    try{
        const response= await axios.post(`${API_URL}/register`, userData);
        if(response.data.token){
            localStorage.setItem('token',response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

        }
        return response.data;
    } catch(error){
        throw error.response?.data || error;
    }
};

// Login user
export const login= async(credentials)=>{
    try{
        const response= await axios.post(`${API_URL}/login`, credentials);
        if(response.data.token){
            localStorage.setItem('token',response.data.token);
            localStorage.setItem('user',JSON.stringify(response.data.user));
        }
        return response.data;
    } catch(error){
        throw error.response?.data || error;
    }
};

// Logout user
export const logout=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// get current user
export const getCurrentUser=()=>{
    const userStr= localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// get token
export const getToken=()=>{
    return localStorage.getItem('token');
}

// check if user is authenticated
export const isAuthenticated=()=>{
    return !!getToken();
};

// get user profile
export const getProfile= async()=>{
    try{
        const token= getToken();
        const response= await axios.get(`${API_URL}/me`, {
            headers: {Authorization: `Bearer ${token}`}
        });
        return response.data;
    } catch(error){
        throw error.response?.data || error;
    }
};

// update profile
export const updateProfile= async(userData)=>{
    try{
        const token= getToken();
    const response= await axios.put(`${API_URL}/profile`, userData,{
        headers:{Authorization:`Bearer ${token}`}
    });

    // update local stirage
    const user= getCurrentUser();
    localStorage.setItem('user', JSON.stringify({...user,...response.data.user}))

    return response.data;

    }
    


catch(error){
    throw error.response?.data || error;
}
};

// change passowrd
export const changePassword= async(passwords)=>{
    try{
        const token= getToken();
        const response= await axios.put(`${API_URL}/change-password`, passwords,{
            headers:{Authorization: `Bearer ${token}`}
        });
        return response.data;
    } catch(error){
        throw error.response?.data || error;
    }
};


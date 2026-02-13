import React, { useState } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import { login as loginApi } from '../services/authApi';
import { useAuth } from '../context/AuthContext';


const Login=()=>{
    const [formData, setFormData]= useState({
        email:'',
        password: ''
    });
    const [error, setError]= useState('');
    const [loading, setLoading]= useState(false);
    const navigate= useNavigate();
    const {login: loginContext}= useAuth();

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit= async(e)=>{
        e.preventDefault();
        setLoading(true);
        setError('');

        try{
            const response= await loginApi(formData);
            loginContext(response.user);

            // redirect based on role
            if(response.user.role === 'user'){
                navigate('/my-tickets');
            } else{
                navigate('/dashboard');
            }
        } catch(error){
            setError(error.message || 'Login failed. Please check your credentials..');
        } finally{
            setLoading(false);
        }
    };

    return(
        <div className="auth-container">
            <div className="auth-card">
                <div className= "auth-header">
                    <h1> IT service Desk</h1>
                    <h2> Welcome Back!</h2>
                    <p> Sign In to your account</p>
                </div>

                {error && (
                    <div className="error-message">{error}
                    </div>
                )}

                <form onSubmit= {handleSubmit} className= "auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your .email@example.com" required autoFocus />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Entr your password" required/>
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Signing in ....':'Sign In'}
                    </button>
                </form>

                <div className= "auth-footer">
                    <p>Don't have an account?{''}
                        <Link to ="/register"> Create One</Link>
                    </p>
                </div>

                <div className="demo-accounts">
                    <p className="demo-title"> Demo Accounts: </p>
                    <div className="demo-list">
                        <div className="demo-item">
                            <strong> User: </strong> user@test.com /password123
                        </div>
                        <div className="demo-item">
                            <strong> Technician: </strong> tech@test.com /password123
                        </div>

                        <div className="demo-item">
                            <strong> Admin: </strong> admin@test.com /password123
                        </div>
                        
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;


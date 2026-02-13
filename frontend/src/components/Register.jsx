import React, { useState } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import {register} from '../services/authApi';
import {useAuth} from '../context/AuthContext';
import './Auth.css';

const Register=()=>{
    const [formData, setFormData]= useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        department: '',
        phone: ''
    });

    const [error, setError]= useState('');
    const[loading, setLoading]= useState(false);
    const navigate= useNavigate();
    const {login}= useAuth();

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });
        setError('');
    };

    const handleSubmit= async(e)=>{
        e.preventDefault();
        setLoading(true);
        setError('');


        // validation
        if(formData.password !== formData.confirmPassword){
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if(formData.password.length < 6){
            setError('Password must be atleast 6 characters');
            setLoading(false);
            return;
        }
        try{
            const {confirmPassword, ...registrationData}= formData;
            const response= await register(registrationData);
            login(response.user);
            navigate('/my-tickets');
        } catch(err){
            setError(err.message || 'Registration failed. Please try again..');
        } finally{
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className= "auth-card">
                <div className="auth-header">
                    <h1> IT Service Desk</h1>
                    <h2> Create Account</h2>
                    <p>Join our support platform</p>
                </div>

                {error && (
                    <div className="error-message">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Full Name * </label>
                        <input type= "text" name="name"value={formData.name} onChange={handleChange} placeholder="John Doe " required autoFocus/>
                    </div>
                    <div className="form-group">
                        <label>
                            Email Address
                        </label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" required />
                    </div>

                    <div className= "form-row">
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder= "Min 6 charcters" required />
                        </div>

                     
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder= "confirm Password" required />
                        </div>
                        
                    </div>

                    <div className= "form-row">
                        <div className="form-group">
                            <label>Department</label>
                            <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder= "IT, HR, Sales etc." required />
                        </div>

                     
                        <div className="form-group">
                            <label>Phone</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder= "(123) 456 7890" required />
                        </div>
                        
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Creating Account...':'Create Account'}</button>


                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to = "/login"> Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
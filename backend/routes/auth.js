const express= require('express');
const router= express.Router();
const jwt= require('jsonwebtoken');
const User= require('../models/User');
const {authenticate, JWT_SECRET}=require('../middleware/auth');

// register new user
router.post('/register', async(req, res)=>{
    try{
        const {name, email, password, role, department, phone}= req.body;

        // check if user already exist
        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message:' User with this email already exists'
            });
        }
        // create new user
        const user= new User({
            name, email,password,
            role: role || 'user',
            department,
            phone
        });
        await user.save();

        // generate token
        const token= jwt.sign(
            {userId: user._id, role: user.role},
            JWT_SECRET,
            {expiresIn:'7d'}
        );
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });
    } catch(error){
        console.error('Registration error: ', error);
        res.status(500).json({
            success: false,
            message:' Error registering user',
            error: error.message
        });
    }
});

// Login User
router.post('/login', async(req, res)=>{
    try{
        const{email, password}= req.body;

        // find user
        const user= await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'

            });
        }

        // checek if user is active
        if(!user.isActive){
            return res.status(401).json({
                success:false,
                message:'Your account has been deactivated. Please contact suport'
            });
        }

        // verify password
        const isPasswordValid= await user.comparePassword(password);
        if(!isPasswordValid){
            return res.status(401).json({
                success: false,
                message:'Invalid email or password'
            });
        }

        // genrtae token
        const token= jwt.sign(
            {userId:user._id,role:user.role},
            JWT_SECRET,
            {expiresIn:'7d'}
        );
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });
    } catch(error){
        console.error("Login error", error);
        res.status(500).json({
            success: false,
            message: 'Error logging in'
        });
    }
});

// get current user prfile
router.get('/me', authenticate, async(req, res)=>{
    try{
        res.json({
            success: true,
            user:{
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                department: req.user.department,
                phone: req.user.phone
            }
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile '
        });
    }
});

// update user profile
router.put('/profile', authenticate, async(req,res)=>{
    try{
        const {name, department, phone}= req.body;

        const user= await User.findByIdAndUpdate(
            req.userId,
            { name, department, phone},
            {new: true, runValidators: true}
        );
        res.json({
            success: true,
            message:'Profile updated successfully ',
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department:user.department,
                phone: user.phone
            }
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        });
    }
});

// change password
router.put('/change-password', authenticate, async(req, res)=>{
    try{
        const { currentPassword, newPassword}= req.body;

        const user= await User. findById(req.userId);

        // veerify curremt passsword
        const isPasswordValid= await user. comparePassword(currentPassword);
        if(!isPasswordValid){
            return res.status(401).json({
                success: false,
                message: 'Current Password is incorrect'
            });
        }

        // update password
        user.password=newPassword;
        await user.save();

        res.json({
            success: true,
            message:' Passwordd changed successfully'

        });
    } catch(error){
        res.status(500).json({
            success: False,
            message: 'Error changing Password'
        });
    }
});

module.exports=router;
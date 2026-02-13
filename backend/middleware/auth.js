const jwt= require('jsonwebtoken');
const User= require('../models/User');

//JWT secret
const JWT_SECRET= process.env.JWT_SECRET || 'mysecretkey1234567890RandomThis';

// verify token middleware
const authenticate= async(req, res, next)=>{
    try{
        const token=req.header('Authorization')?.replace('Bearer ','');

        if(!token){
            return res.status(401).json({
                success:false,
                message: 'No authentication token provided'
            });
        }
        const decoded= jwt.verify(token, JWT_SECRET);
        const user= await User.findById(decoded.userId);

        if(!user || !user.isActive){
            return res.status(401).json({
                success: false,
                message: 'Invalid authentication token.'
            });
        }
        req.user= user;
        req.userId= user._id;
        next();
    } catch(error){
        res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }

};

// check if user has required role
const authorize=(...roles)=>{
    return (req,res,next)=>{
        if(!req.user){
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: 'you do not have permission to access this resource'
            });
        }
        next();
    };
};

module.exports={authenticate, authorize, JWT_SECRET};
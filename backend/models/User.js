const mongoose= require('mongoose');
const bcrypt= require('bcryptjs');

const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true

    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password:{
        type:String,
        required: true,
        minlength:6
    },
    role:{
        type: String,
        enum:['user','technician','admin'],
        default: 'user'
    },
    department:{
        type: String,
        default:'General'
    },
    phone:{
        type: String
    },
    isActive:{
        type: Boolean,
        default: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
     

});

// Hash password before saving
userSchema.pre('save', async function(){
    if(!this.isModified('password')){
        return ;
    }
    try{
        const salt= await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        
    } catch(error){
        throw error;
    }
});

// compare password  method
userSchema.methods.comparePassword=async function(candidatePassword){
    try{
        return await bcrypt.compare(candidatePassword, this.password);
    } catch(error){
        throw error;
    }
};

// remove passowrd form JSON response
userSchema.methods.toJSON= function(){
    const user= this.toObject();
    delete user.password;
    return user;
};

module.exports= mongoose.model('User',userSchema);
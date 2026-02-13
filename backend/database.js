const mongoose= require('mongoose');
require('dotenv').config();

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB atlas connected');
        
    }catch(error){
        console.error('MongoDB Error: ', error.message);
        process.exit(1);
    }
}

module.exports= connectDB;
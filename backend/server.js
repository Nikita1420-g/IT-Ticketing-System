require('dotenv').config()
const express= require('express');
const cors= require('cors');

const connectDB= require('./database');
const app= express();


const allowedOrigins = [
  'http://localhost:3000',
  'https://it-ticketing-system-iota.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

connectDB();




app.get('/test',(req,res)=>{
    console.log('recieved request to /test');
    res.json({
        message: 'Backend is working!',
        timestamp: new Date()
    });
});

// ticket routes
const authRoutes= require('./routes/auth');
const ticketRoutes= require('./routes/tickets');
const chatbotRoutes= require('./routes/chatbot');

app.use('/api/auth', authRoutes)
app.use('/api/tickets', ticketRoutes);
app.use('/api/chatbot',chatbotRoutes);

const PORT= 4000;
app.listen(PORT,()=>{
    console.log(`Server runningg on http://localhost:${PORT}`);
    console.log(`Auth: http://localhost:${PORT}/api/auth/login`)
    console.log(`Test: http://localhost:${PORT}/test`);
    console.log(`API: http://localhost:${PORT}/api/tickets`);
    console.log(`Chatbot: http://localhost:${PORT}/api/chatbot/chat`);
});
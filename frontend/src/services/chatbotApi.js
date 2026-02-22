import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:4000/api'}/chatbot`;

// generate unique session ID
export const generateSessionId=()=>{
    return `session_${Date.now()}-${Math.random().toString(36).substr(2,9)}`;
};

//send chat message
export const sendChatMessage= async(sessionId, message, conversationHistory)=>{
    try{
        const response= await axios.post(`${API_URL}/chat`,{
            sessionId,
            message,
            conversationHistory
        });
        return response.data;
    } catch(error){
        console.error('Chat error: ', error);
        throw error;
    }
};

// Extract ticket information from the conversation
export const extractTicketInfo= async(conversationHistory)=>{
    try{
        const response= await axios.post(`${API_URL}/extract-ticket`,{
            conversationHistory
        });
        return response.data;
    }catch(error){
        console.error('Extract ticket error: ', error);
        throw error;
    }
};

// clear session
export const clearSession= async(sessionId)=>{
    try{
        const response= await axios.delete(`${API_URL}/session/${sessionId}`);
        return response.data;
    } catch(error){
        console.error('Clear session error: ', error);
        throw error;
    }
};


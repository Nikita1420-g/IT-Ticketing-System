const express= require('express');
const router= express.Router();
const{
    chatWithClaude,
    analyzeForTicketCreation,
    extractTicketInfo
}= require('../services/chatbotService');

// store converstaion sessions(in production, use Redis or database)
const sessions= new Map();

// chat endpoint
router.post('/chat', async(req,res)=>{
    try{
        const {sessionId, message, conversationHistory}= req.body;

        if(!message){
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        // Get or create session
        let history= conversationHistory || sessions.get(sessionId) || [];

        // add user messge to history
        history.push({
            role:'user',
            content: message
        });
        // get response from claude
        const response= await chatWithClaude(history);

        if(response.success){
            history.push({
                role: 'assistant',
                content: response.message
            });

            // save session
            if(sessionId){
                sessions.set(sessionId, history);
            }

            // checek if user needs a tciket
            const needsTicket= analyzeForTicketCreation(history);

            res.json({
                success: true,
                message: response.message,
                conversationHistory:history,
                needsTicket,
                usage: response.usage
            });

    } else{
        res.status(500).json({
            success:false,
            message:response.message
        });
    }
 } catch(error){
    console.error('Chat error: ', error);
    res.status(500).json({
        success:false,
        message: 'An error occured while processiing your message'
    });
 }
});

// Extract ticket info from the conversation
router.post('/extract-ticket', async(req, res)=>{
    try{
        const {conversationHistory}= req.body;
        if(!conversationHistory || conversationHistory.length===0){
            return res.status(400).json({
                success: false,
                message: 'Conversation history is required'
            });
        }
        const ticketInfo = await extractTicketInfo(conversationHistory);

        if(ticketInfo){
            res.json({
                success: true,
                ticketInfo
            });
        } else{
            res.status(400).json({
                success:false,
                message:'Could not extract ticket information'
            });
        }
    } catch(error){
        console.error('Ticket extractione rror: ', error);
        res.status(500).json({
            success: false,
            message: 'An error occured while extracting ticket information'
        });
    }
});

// clear sesssion
router.delete('/session/:sessionId', (req, res)=>{
    const{sessionId}=req.params;
    sessions.delete(sessionId);
    res.json({success:true, message:'Session Cleared'})
});

module.exports= router;

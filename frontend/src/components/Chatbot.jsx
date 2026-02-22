import React, {useState, useEffect, useRef} from 'react';

import { sendChatMessage,extractTicketInfo,generateSessionId } from '../services/chatbotApi';
import { createTicket } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Chatbot.css';

import{
    FiSend,
    FiX,
    FiMinus,
    FiMessageCircle,
    FiUser,
    FiMail
} from 'react-icons/fi';
import{
    BsRobot,
    BsCheckCircle,
    BsPersonCircle
} from 'react-icons/bs';

import{
    HiOutlineTicket
} from 'react-icons/hi2';



const Chatbot=()=>{
    const { user }= useAuth();
    const [isOpen, setIsOpen]= useState(false);
    const[messages, setMessages]= useState([]);
    const[inputMessage, setInputMessage]= useState('');
    const [isTyping, setIsTyping]= useState(false);
    const[sessionId]= useState(generateSessionId());
    const[conversationHistory, setConversationHistory]= useState([]);
    const[showTicketForm, setShowTicketForm]=useState(false);
    const[ticketData, setTicketData]= useState({
        requesterName:'',
        requesterEmail:''
    });
    const messagesEndRef= useRef(null);
    const inputRef= useRef(null);

    // Scroll to bottom when new messages arrive
    const scrollToBottom=()=>{
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    useEffect(()=>{
        scrollToBottom();
    },[messages])

    // focus input when chat opens
    useEffect(()=>{
        if(isOpen){
            inputRef.current?.focus();
        }
    }, [isOpen]);

    // initialize chat with welcome message
    useEffect(()=>{
        if(isOpen && messages.length === 0){
            setMessages([{
                type:'bot',
                content: "Hi, I am your IT support assistant. How Can I help You!",
                timestamp: new Date()

            }]);
        }
    }, [isOpen, messages.length]);

    const handleSendMessage= async()=>{
        if(!inputMessage.trim()) return;

        const userMessage={
            type: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev =>[...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        try{
            const response= await sendChatMessage(sessionId, inputMessage, conversationHistory);
            if(response.success){
                const botMessage={
                    type:'bot',
                    content: response.message,
                    timestamp: new Date()
                };
                setMessages(prev =>[...prev, botMessage]);
                setConversationHistory(response.conversationHistory);

                // If chatbot detects user needs a ticket
                if(response.needsTicket){
                    setTimeout(()=>{
                        const ticketPrompt={
                            type:'bot',
                            content: "Would you like me to create a support ticket for you? This will help our assistant to know it better!",
                            timestamp: new Date(),
                            actions:[
                                { label: 'Yes, create ticket', action: 'create_ticket'},
                                {label: 'No, continue chatting', action: 'continue'}
                            ]
                        };
                        setMessages(prev=>[...prev, ticketPrompt]);
                    },1000);
                }
            }
        } catch(error){
            const errorMessage= {
                type: 'bot',
                content:' I am having a trouble connecting right now. Please try again or create a ticket directly..',
                timestamp: new Date()
            };
            setMessages(prev=>[...prev, errorMessage]);
        } finally{
            setIsTyping(false);
        }
    };

    const handleAction= async(action)=>{
        if(action==='create_ticket'){
            setIsTyping(true);
            try{
                const extractedInfo= await extractTicketInfo(conversationHistory);
                if(extractedInfo.success){
                    setTicketData(prev=>({
                        ...prev,
                        ...extractedInfo.ticketInfo,
                        requesterName: user ?.name || '',
                        requesterEmail: user?.email || ''
                    }));
                    setShowTicketForm(true);

                    const formMessage={
                        type:'bot',
                        content: "Great! I've gathered the details from our conversation. Please fill in your name and email Address.",
                        timestamp: new Date()
                    };
                    setMessages(prev=>[...prev, formMessage]);
                }

            }catch(error){
                const errorMessage={
                    type:'bot',
                    content: "I had trouble extracting the ticket information. please create the ticket manually.",
                    timestamp: new Date()
                };
                setMessages(prev=>[...prev, errorMessage]);

            } finally{
                setIsTyping(false);
            }
        } else{
            const continueMessage={
                type:'bot',
                content: "No Problem! Feel free to ask me anything else, or let me know ",
                timestamp: new Date()
            }; 
            setMessages(prev=>[...prev, continueMessage]);
        }
    };

    const handleCreateTicket= async(e)=>{
        e.preventDefault();

        if(!ticketData.requesterName || !ticketData.requesterEmail){
            alert('Please fill in your name and email');
            return;
        }
        setIsTyping(true);
        try{
            await createTicket(ticketData);

            const successMessage={
                type:'bot',
                content: `Ticket Created Successfully!\n\n Ticket Details:\n  Title: ${ticketData.title}\n Category: ${ticketData.category}\n Priority: ${ticketData.priority}\n\n You'll receive an email confirmation shortly. Our team will review your ticket and get back to you soon!`,
                timestamp: new Date()
            };
            setMessages(prev=>[...prev, successMessage]);
            setShowTicketForm(false);

            // Reset for new Conversation
            setTimeout(()=>{
                const newChatMessage={
                    type:'bot',
                    content: "Is tehre anything else I can help you with?",
                    timestamp: new Date()
                };
                setMessages(prev=>[...prev, newChatMessage]);
            },2000);
        } catch(error){
            const errorMessage={
                type:'bot',
                content:"Sorry, there was an error creating the ticket. Please create it from  the main page",
                timestamp: new Date()
            };
            setMessages(prev=>[...prev, errorMessage]);
        } finally{
            setIsTyping(false);
        }
    };

    const handleKeyPress=(e)=>{
        if(e.key==='Enter' && !e.shiftKey){
            e.preventDefault();
            handleSendMessage();
        }
    };
    const toggleChat=()=>{
        setIsOpen(!isOpen);
    };

    return (
        <div className="chatbot-container">
          {/* Chat Button*/}
          <button 
             className="chatbot-button"
             onClick={toggleChat}
             aria-label="Toggle chat"
             >
                {isOpen ? <FiX size={28}/>: <FiMessageCircle size={28}/>}
             </button>

             {/* Chat Window */}
             {isOpen && (
                <div className= "chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-header-left">
                            <div className="chatbot-avatar"><BsRobot size={24}/>
                        </div>
                        <div className="chatbot-info">
                        <h3>IT Support Assistant </h3>
                        <div className="chatbot-status"> online</div>
                        <span className="status-dot">Online</span>
                    </div>
                </div>
                <button className="chatbot-close" onClick={toggleChat}><FiX size={20}/></button>
                </div>

                
                <div className="chatbot-messages">
                    {messages.map((message,index)=>(
                        <div key= {index} className={`message ${message.type}`}>
                            {message.type==='bot' && (
                                <div className="message-avatar"><BsRobot size={20}/></div>
                            )}
                            <div className="message-content">
                                <div className="message-bubble">
                                    {message.content}
                                </div>
                                {message.actions && (
                                    <div className="ticket-options">
                                        {message.actions.map((action,idx)=>(
                                            <button
                                              key= {idx}
                                              className={`ticket-option-btn ${action.action === 'continue'? 'secondary':''}`}
                                              onClick={()=>handleAction(action.action)}>
   {action.action=== 'create_ticket'?(
    <>
     <HiOutlineTicket size={18}/>{action.label}
    </>

   ):(
    <>
     <FiMessageCircle size={18} />{action.label}
    </>
   )}                                                                                     </button>
                                        ))}
                                        </div>
                                )}
                                <span className="message-time">
                                    {message.timestamp.toLocaleTimeString([],{hour: '2-digit', minute: '2-digit'})}
                                </span>
                        </div>
                        {message.type==='user' && (
                            <div className= "message-avatar "><BsPersonCircle size={20}/></div>
                        )}
                        </div>
                    ))}
                    {isTyping &&(
                        <div className="message-bot">
                            <div className="message-avatar"><BsRobot size={20}/></div>
                            
                                <div className="typing-indicator">
                                    <span className="typing-dot"></span>
                                    <span classNam="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                </div>
                           
                            </div>
                    )}
                    {/* Ticket form */}
                    {showTicketForm && (
                        <div className="ticket-form-inline">
                            <form onSubmit={handleCreateTicket}>
                                <div className="form-input-group">
                                    <FiUser className="input-icon"/>
                                
                                <input type="text"
                                placeholder="Your Name: "
                                Value={ticketData.requesterName}
                                onChange={(e)=> setTicketData({...ticketData,requesterName:e.target.value})}
                                required/>
                                </div>
                                <div className="form-input-group">
                                    <FiMail classsName="input-icon"/>
                                
                                <input 
                                type="email"
                                placeholder="Your email"
                                value={ticketData.requesterEmail}
                                onChange={(e)=>setTicketData({...ticketData,requesterEmail:e.target.value})}
                                required/>
                                </div>
                                <button type= "submit" className="submit-ticket-btn"><BsCheckCircle size={18}/>Create Ticket</button>
                            </form>
                        </div>
                    )}

                    <div ref={messagesEndRef}/>
                      
                    </div>

                    <div className= "chatbot-input">
                        <input ref={inputRef}
                        type="text"
                        
                        placeholder="Type your message.."
                        value={inputMessage}
                        onChange={(e)=>setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isTyping}/>
                        <button  onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}><FiSend size={18}/></button>
                    </div>
                    </div>
                
                )}
                </div>
    );
};

export default Chatbot;
const Groq= require('groq-sdk');
require('dotenv').config();

const groq= new Groq({
    apiKey:process.env.GROQ_API_KEY,
});

// knowledge based common IT issues
const knowledgeBase={
    password_reset: {
        category:'Access',
        solution: `To reset your password:
    1. Go to your organization's passowrd reset portal
    2. Enter your user ID or email
    3. Verify you ridentity with your recovery email or phone
    4. Create a new strong password(min 8 characters, mix of letters, numbers, sysmbols)
    5. Log out and log back in with your new password. 

    If you don't have access to your recovery options, please create a ticket and we'll help you.
        `

    },
    wifi_issues:{
        category: 'Netwrok',
        solution: `WiFi troubleshooitng steps: 
        1. Forget the newtowk and reconnect
        2. Make sure you're using the correct network credentials
        3. Restart you rdevice
        4. Check if WiFi is working on otehr devices
        5. Try moving closer to the rputer/access devices
        6. Update your WiFi drivers
        
        If teh issue persists, create a ticket with details about your location and device type.`

    },
    printing_issues:{
        category: 'Hardware',
        solution:`Printing troublsehooting: 
        1. Check printer status(paper, toner, errors)
        2. Make sure the printer is connected to the network
        3. Try printing a test page
        4. Restart the print spooler service
        5. Remove and re-add the printer
        6. Check printer queue fro stuck jobs
        
        If the problem continues, create a support ticket.`

    },
    software_installation:{
        category: 'Software',
        solution: `Software installation help: 
        1. Make sure you have administrator irghts
        2. Download from official/approved sources only
        3. Check system requirements(OS version, RAM, disk space)
        4. Temporarily disable antivirus if installation fails
        5. Run installer as administrator
        6. Check for conflicting software
        
        For licensed software or access issues, please create a ticket.`
    },
    email_issues:{
        category: 'Access',
        solution: `Email troubleshooting:
        1. Check your internet connection
        2. Verify you're using correct username and passowrd
        3. Clear browser cache and cookies
        4. Try accessing from webmail vs desktop client
        5. Check if your mailbox is full
        6. Try resetting your password
        
        If you're still locked out, create a ticket fro assistance.`
    },
    vpn_connection:{
        category:'Network',
        solution:`VPN connection troubleshooting:
        1. Make sure VPN client is installled and up-to-date
        2. USe your correct credentials
        3. Checke your internet connection
        4. Try different VPN server if multiple are avaialbale
        5. Temporarily disabel fireall.antivirus
        6. Retsart your computer and try again
        
        If connection still fails, create a ticket with error details`
    },
    slow_computer:{
        category:'Hardware',
        solution: `Computer running slow? Try these: 
        1. Restart your computer
        2. Close unnecessary programs and browser tabs
        3. Check Task Manager for resource-heavy processes
        4. Clear temporary files and cache
        5. Run disk cleanup
        6. Check for malware/ viruses
        7. Update your operating system

        If issue persist, hardware upgrade may be needed- create a ticket.
        `
    },
    software_error:{
        category: 'Software',
        solution:`Application errors troubleshooting:
        1. Note the exact erro messgae
        2. Restart your application
        3. Restart your computer
        4. Check for software updates
        5. Run applicationa s administrator
        6. Reinstall the application
        7. Check system logs for details
        
        Include error messgaes and screenshots when creating a ticket.`
    }
};

//s ystem prompt for teh chatbot
const systemPrompt= `You are a helpful IT support assistant for an IT Servvice Desk.
Your role:
1. Help users troubleshoot common IT issues
2. Provide clear, step-by-step solutions
3. Determine if an issue requires a support ticket
4. Be friendly, professional and patient
5. Ask clarifying questiosn to understand the problem better
6. Suggest solutions from teh knowledge base when relevant

When helping users:
- Start by asking about their issue
- Ask 2-3 clarifying questions to understand their problem
- Suggest relevant solutions from the knowledge base
- If the issue is complex or solutions don't work, recommend creatinga ticket
- Keep response concise(2-4 sentences unless providing step-by-step instructions)

Available Knowledge base topics:
- Password resets
- WiFi connectivity
- Printing issues
- Software installation
- Email problems
- VPN connection
- Slow computer performance
- Software errors

Categories for tickets:
- Hardware
- Software
- Network
- Access
- Other

Prioirty levels:
-Low: Minor issues, no urgency
- Medium: affects work but has workarounds
- High: Significantly impacts work
- Critical: System down, urgent business impact

Important: Be generic and don't referenc any specific organization name.
`;

// chat with claude
const chatWithClaude= async(conversationHistory)=>{
    try{
        const response=await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages:[
                {role: 'system', content: systemPrompt},...conversationHistory
            ],
            temperature: 0.7,
            max_tokens: 1024,
            top_p:1
             

        });
        return{
            success: true,
            message: response.choices[0].message.content,
            usage: response.usage
        };
    } catch(error){
        console.error('Groq API error: ', error);
        console.error('Full error details: ', JSON.stringify(error, null,2 ))
        return{
            sucess:false,
            error: error.message,
            message: "I'm having trouble connecting right now. Please try again or create a ticket directly."
        };
    }
};

// Analyze if user needs a ticket created
const analyzeForTicketCreation= (conversationHistory)=>{
    const lastMessages=conversationHistory.slice(-4).map(m=>m.content).join(' ').toLowerCase();

    const ticketKeywords=[
        'create ticket',
        'need help',
        'not working',
        'urgent',
        'broken',
        'error',
        'problem persists',
        'still not working',
        'tried everything',
        'doesn\'t work',
        'can\'t fix'
    ];

    const needTicket= ticketKeywords.some(keyword=>lastMessages.includes(keyword));
    return needTicket;
};

// Extract ticket information from conversation
const extractTicketInfo=async(conversationHistory)=>{
    try{
        const extractionPrompt=`Based on this IT support conversation, extract ticket information in JSON format:
        {
          "title":" brief issue description (max 10 words)",
          "description":"detailed description with troubleshooting steps already tried",
          "category": "Hardware/ Software/ Network/ Acces/ Other",
          "Priority":"Low/Medium/High/Critical"
        }
          conversation:
          ${conversationHistory.map(m=>`${m.role}:${m.content}`).join('\n')}
          Respond ONLY with valid JSON, no other text.`;
          const response= await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            temperature:0.1,
            max_tokens: 800,
            messages: [{role: 'user', content: extractionPrompt}]
          });
         const content= response.choices[0].message.content;
         const cleanContent= content.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();

         const ticketInfo= JSON.parse(cleanContent);

         // validate
         const ValidCategories=['Hardware','Software','Network','Access','Other'];
         const ValidPriorities=['Low','Medium','High','Critical'];
         if(!ValidCategories.includes(ticketInfo.category)){
            ticketInfo.category='Other';
         }
         if(!ValidPriorities.includes(ticketInfo.priority)){
            ticketInfo.priority='Medium';
         }
         return ticketInfo;
    } catch(error){
        console.error('Tiket extraction error: ', error);
        return null;
    }
};

module.exports={
    chatWithClaude,
    analyzeForTicketCreation,
    extractTicketInfo,
    knowledgeBase
};
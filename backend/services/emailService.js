const nodemailer= require('nodemailer');
require('dotenv').config();

// create transporter
const transporter= nodemailer.createTransport({
    service:process.env.EMAIL_SERVICE || 'gmail',
    auth:{
        user: process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD
    }
});

// verify transporter configuration
transporter. verify((error, success)=>{
    if(error) {
        console.error('Email transporter error: ', error);
    } else{
        console.log('Email service is ready');
    }
});

// send ticket creation email
const sendTicketCreatedEmail= async(ticket)=>{
    const mailOptions={
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: ticket.requesterEmail,
        subject: `Ticket Created: ${ticket.ticketNumber}`,
        html:`
        <!DOCTYPE html>
        <html>
        <head>
        <style>
        body {font-family: Arial, sans-serif; line-height: 1.6, color: #333; }
        .container{max-width: 600px; margin:0 auto;padding: 20px;}
        .header{background: #2563eb; color: white;padding: 20px; text-align: center, border-radius: 5px 5px 0 0;}
        .content{background: #f9fafb;padding: 30px; border: 1px solid #e5e7eb;  }
        .ticket-info{background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #2563eb;}
        .info-row{margin: 10px 0;}
        .label{font-weight: bold;color: #4b5563;}
        .value{color: #1f2937;}
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 5px 5px;}
        .badge{display: inline-block; padding: 5px 10px; broder-radius: 3px; font-size: 12px; font-weight: bold;}
        .priority-low{background: #dbeafe; color: #1e40af;}
        .priority-medium{background: #fef3c7; color: #92400e;}
        .priority-high{background: #fee2e2; color: #991b1b}
        .priority-critical{baclground: #fecaca; color: #7f1d1d;}
        </style>
        </head>
        <body>
        <div class="container">
          <div class="header">
             <h1> Ticket Created Successfully</h1>
             </div>
        <div class= "content">
        <p> Hello ${ticket.requesterName},</p>
        <p>Your IT support ticekt has been created and our team will review it shortly.</p>
        <div class ="ticket-info">
          <h2> Ticket Details</h2>
          <div class= "info-row">
          <span class= "label"> Ticket Number: </span>
          <span class="value">${ticket.ticketNumber}</span>
          </div>
          <div class= "info-row">
            <span class="label">Title: </span>
            <span class="value">${ticket.title}</span>
            </div>
            <div class= "info-row">
            <span class="label">Category: </span>
            <span class="value">${ticket.category}</span>
            </div>
            <div class= "info-row">
            <span class="label">Priority: </span>
            <span class="badge priority-${ticket.priority.toLowerCase()}">${ticket.priority}</span>
            </div>
            <div class= "info-row">
            <span class="label">Status: </span>
            <span class="value">${ticket.status}</span>
            </div>
            <div class= "info-row">
            <span class="label">Description: </span>
            <span class="value">${ticket.description}</span>
            </div>
            </div>
            
            <p><strong> What happnes next?</strong></p>
            <ul>
              <li> Our IT team will review your ticket</li>
              <li> You will recieve updates via email</li>
              <li> Expected response time: 24-48 hours</li>
              </ul>
              
              <p> Please save your ticket number <strong> ${ticket.ticketNumber}</strong> for future references..</p>
              <div>
              <div class= "footer">
              <p>  IT service Desk </p>
              <p>This is an automated email. Please do not reply to this.</p>
              </div>
              </div>
              </body>
              </html>
              `
         
    };
    try{
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${ticket.requesterEmail}`);
        return {success: true};
    } catch(error){
        console.error('Email sending failed: ', error)
        return {success: false, error: error.message};
    }
};

// send ticket status update email
const sendTicketStatusUpdateEmail= async(ticket, oldStatus)=>{
    const mailOptions={
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: ticket.requesterEmail,
        subject: `Ticket Created: ${ticket.ticketNumber}`,
        html:`
        <!DOCTYPE html>
        <html>
        <head>
        <style>
        body {font-family: Arial, sans-serif; line-height: 1.6, color: #333; };
        .container{max-width: 600px; margin:0 auto;padding: 20px;}
        .header{background: #2563eb; color: white;padding: 20px; text-align: center, border-radius: 5px 5px 0 0;}
        .content{background: #f9fafb;padding: 30px; border: 1px solid #e5e7eb;  }
        .status-change{background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #2563eb;}
        
        
        .status-badge{display: inline-block; padding: 8px 15px; broder-radius: 5px;  font-weight: bold; margin: 0 5px}
        .status-open{background: #dbeafe; color: #1e40af;}
        .status-in-progress{background: #fef3c7; color: #92400e;}
        .status-resolved{background: #d1fae5; color: #065f46;}
        .status-closed{background: #f3f4f6; color: #374151;}
        .arrow{color: #6b7280; margin: 0 10px;}
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 5px 5px;}
        </style>
        </head>
        <body>
         <div class= "container">
          <div calss="header">
             <h1> Ticket Status Updated </h1>
             </div>
             <div class= "content">
             <p>hello ${ticket.requesterName}, </p>
             <p> Your ticket <strong. ${ticket.ticketNumber}</strong> has been updated </p>
             
             <div class="status-change">
               <h2> Status change</h2>
               <div style="text-align: center; margin: 20px 0;">
                 <span class = "status-badge status-${oldStatus.toLowerCase().replace(' ','-')}">{oldStatus}</span>
                 <span class= "arrow">-></span>
                 <span class= "status-badge status-{ticket.status.toLowerCase().replace(' ','-')}">${ticket.status}</span>
                 </div>
                 
                 <h3> Ticket Details: </h3>
                 <p> <strong> Title: </strong>${ticket.title}</p>
                 <p><strong>Category: ${ticket.category}</p>
                 <p><strong>Priority: ${ticket.priority}</p>
                 <p><strong> Assigned To: </strong> ${ticket.assignedTo}</p>
                 </div>
                 
                 ${ticket.status=='Resolved'?`
                    <p><strong> Your issue has been resolved</strong></p>
                    <p> If you're satisfied with the resolutionn, the ticket will automatically closed. If you're still experiencing, please reply to this email.</p>`: ''}
                   ${ticket.status=='Resolved' ?`
                    <p> <strong> Your issue has been resolved! </strong></p>
                    <p> If you're satisfied with the resolution, the ticket will be automatically closed. If you're still experiencing issue, please reply to this email.</p>`: ''}
                    <p> You can track your ticket status anytiime using ticket number: <strong>${ticket.ticketNumber}</strong></p>
                    </div>
                    <div class= "footer">
                    <p>  IT Service Desk</p>
                    <p>This is an automated email. Please do not reply directly to this message. </p>
                    </div>
                    </div>
                    </body>
                    </html>


                    `
    };

    try{
        await transporter.sendMail(mailOptions);
        console.log(`Status update eamil sent to  ${ticket.requesterEmail}`);
        return {success: true};
    } catch(error){
        console.error('Email sending failed: ', error)
        return {success: false, error: error.message};
    }
};

// send note added email
const sendNoteAddedEmail= async(ticket, note)=>{
    const mailOptions={
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: ticket.requesterEmail,
        subject: `New Update: ${ticket.ticketNumber}`,
        html:`
        <!DOCTYPE html>
        <html>
        <head>
        <style>
        body {font-family: Arial, sans-serif; line-height: 1.6, color: #333; }
        .container{max-width: 600px; margin:0 auto;padding: 20px;}
        .header{background: #2563eb; color: white;padding: 20px; text-align: center, border-radius: 5px 5px 0 0;}
        .content{background: #f9fafb;padding: 30px; border: 1px solid #e5e7eb;  }
        .note-box{background: white, padding: 20px; margin: 20px 0; border-left: 4px solid #8b5cf6; border-radius: 5px;}
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 5px 5px;}
        </style>
        </head>
        <body>
         <div class= "container">
          <div calss="header">
             <h1> New Note Added to your ticket </h1>
             </div>
             <div class= "content">
             <p>hello ${ticket.requesterName}, </p>
             <p> A neew note has been addded to your ticket <strong. ${ticket.ticketNumber}</strong> </p>
             <div class="note-box">
             <p><strong>Form: </strong>${note.addedBy}</p>
             <p><strong>Date: </strong> ${new Date(note.addedAt).toLocaleString()}</p>
             <hr>
             <p>${note.text}</p>
             </div>
             <p><strong> ticket: </strong> ${ticket.title}</p>
             <p><strong> Status: </strong>${ticket.status}</p>
             </div>
             <div class= "footer">
                    <p>  IT Service Desk</p>
                    <p>This is an automated email. Please do not reply directly to this message. </p>
                    </div>
                    </div>
                    </body>
                    </html>


             `};
             try{
                await transporter.sendMail(mailOptions);
        console.log(`Note notification eamil sent to  ${ticket.requesterEmail}`);
        return {success: true};
    } catch(error){
        console.error('Email sending failed: ', error)
        return {success: false, error: error.message};
    }
             };

             module.exports={
                sendTicketCreatedEmail,
                sendTicketStatusUpdateEmail,
                sendNoteAddedEmail
             };
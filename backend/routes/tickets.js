const express= require('express');
const router= express.Router();
const Ticket= require('../models/Ticket');
const { authenticate, authorize}= require('../middleware/auth');
const{
    sendTicketCreatedEmail,
    sendTicketStatusUpdateEmail,
    sendNoteAddedEmail
}= require('../services/emailService');

router.get('/', authenticate, authorize('technician', 'admin'),async(req,res)=>{
    try{
        const tickets= await Ticket.find().sort({ createdAt: -1});
        res.json({
            success: true,
            count: tickets.length,
            data: tickets
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: 'Error fetching tickets',
            error: error.message
        });
    }
});

// get user's own tickets 
router.get('/my-tickets', authenticate, async(req, res)=>{
    try{
        const tickets= await Ticket.find({
            requesterEmail:req.user.email
        }). sort({createdAt: -1});

        res.json({
            success: true,
            count: tickets.length,
            data: tickets
        });
    } catch (error){
        res.status(500).json({
            success: false,
            message:'Error fetching your tickets',
            error: error.message
        });
    }
});

// create new ticket 
router.post('/',authenticate, async(req,res)=>{
    try{
        const ticketData={
            ...req.body,
            requesterName: req.user.name,
            requesterEmail: req.user.email
        };

        const ticket= new Ticket(ticketData);
        await ticket.save();

        // send email notification
        await sendTicketCreatedEmail(ticket);
        res.status(201).json({
            success: true,
            message: 'Ticket created successfully',
            data: ticket
        });
    } catch(error){
        res.status(400).json({
            success:false,
            message: 'Error creating ticket',
            error: error.message
        });
    }
});


// get single ticket by id
router.get('/:id', authenticate, async(req, res)=>{
    try{
        const ticket = await Ticket.findById(req.params.id);
        if(!ticket){
            return res.status(404).json({
                success: false,
                message: 'ticekt Not found'
            });
        }

        //Users can only view their own tickets
if(req.user.role==='user' && ticket.requesterEmail !== req.user.email){
    return res.status(403).json({
        success: false,
        message:' You do not have permission to view this ticket'
    });


}

        res.json({
            success:true,
            data: ticket
        }); 
    } catch(error){
        res.status(500).json({
            success:false,
            message: 'Error fetching ticket',
            error: error.message
        });
    }
});
       




// update ticket
router.put('/:id', authenticate,async(req,res)=>{
    try{
        const oldTicket= await Ticket.findById(req.params.id);
        if(!oldTicket){
            return res.status(404).json({
                success: false,
                message: 'Ticket Not found'
            });
        }

        const oldStatus= oldTicket.status;

        const ticket= await Ticket.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body, updatedAt: Date.now()
            },
            {
                new: true, runValidators:true
            }
        );
        if(oldStatus !== ticket.status){
            await sendTicketStatusUpdateEmail(ticket, oldStatus);
        }
        res.json({
            success: true,
            message: 'Ticket updated successfully',
            data: ticket
        });
    }catch(error){
        res.status(400).json({
            success:false,
            message: 'Error updating ticket',
            error: error.message
        });
    }
});

// delete ticket
router.delete('/:id', authenticate, async(req,res)=>{
    try{
        const ticket=await Ticket.findByIdAndDelete(req.params.id);
        if(!ticket){
            return res.status(404).json({
                success:false,
                message:'Ticket not found'
            });
        }
        res.json({
            success: true,
            messgae:'Ticket deleted successfully'
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message:'Error deleting ticket',
            error: error.message
        });
    }
});

// add note to ticket
router.post('/:id/notes', authenticate, authorize('technician','admin'), async(req,res)=>{
    try{
        const ticket= await Ticket.findById(req.params.id);
        if(!ticket){
            return res.status(404).json({
                success: false,
                message:'Ticket not found'
            });
        }

        const note={
            text: req.body.text,
            addedBy: req.body.addedBy || 'IT Support',
            addedAt: new Date()
        };

        ticket.notes.push(note);
        await ticket.save();

        // send email notification
        await sendNoteAddedEmail(ticket, note);
        
        res.json({
            success: true,
            message:'Note addedd succeessfully',
            data: ticket
        });
    } catch(error){
        res.status(400).json({
            success: false,
            message:'Error adding note',
            error: error.message
        });
    }
});

module.exports= router;
const mongoose= require('mongoose');

const ticketSchema= new mongoose.Schema({
    ticketNumber: {
        type: String,
       // required: true,
        unique: true,
        sparse:true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true
    },
    category:{
        type: String,
        enum: ['Hardware', 'Software','Network','Access', 'Other'],
        required: true
    },
    priority: {
        type: String,
        enum: ['Low','Medium','High','Critical'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'],
        default: 'Open'
    },
    requesterName: {
        type: String,
        required: true
    },
    requesterEmail: {
        type: String,
        required: true
    },
    assignedTo:{
        type: String,
        default: 'Unassigned'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: {
        type: Date
    },
    notes: [{
        text: String,
        addedBy: String,
        addedAt:{
            type: Date,
            default: Date.now
        }
    }]
    
});

// auto-generated ticket number
ticketSchema.pre('save', async function(){
    if(this.isNew){
        const count= await mongoose.model('Ticket').countDocuments();
        this.ticketNumber= `TICKET-${String(count + 1).padStart(5,'0')}`;

    }
    this.updatedAt= Date.now();
   
})

module.exports= mongoose.model('Ticket', ticketSchema);
import React, {useState} from 'react'
import {updateTicket, addNoteToTicket} from '../services/api';
import { useAuth } from '../context/AuthContext';
import './TicketDetails.css'


const TicketDetails=({ticket, onClose, onUpdate, isUserView= false})=>{

    const [isEditing,setIsEditing]= useState(false);
    const [formData, setFormData]= useState({
        status: ticket.status,
        priority: ticket.priority,
        assignedTo: ticket.assignedTo || ''
    });
    const [noteText, setNoteText]= useState('');
    const {user}= useAuth();

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });
    }
    

    const handleUpdate= async()=>{
        try{
            await updateTicket(ticket._id, formData);
            alert('Status updated succeesssfuly!');
            setIsEditing(false);
            onUpdate();
        } catch(error){
            alert('Error updating status');
            alert('Failed to updaet ticket')
        }
    };

    const handleAddNote= async(e)=>{
       if(!noteText.trim()){
        alert('Please enter a note');
        return;
       }
        try{
            await addNoteToTicket(ticket._id,{
                text: noteText,
               
            });
            alert('Note added successfully!');
            setNoteText('');
            
            onUpdate();
        } catch(error){
            alert('Error adding note');
        }
    };

    const getStatusColor=(status)=>{
        const colors={
            'Open': '#3b82f6',
            'In Progress': '#f59e0b',
            'Pending': '#8b5cf6',
            'Resolved': '#10b981',
            'Closed': '#6b7280'
        };
        return colors[status] || '#6b7280';
    };

    const getPriorityColor=(priority)=>{
        const colors={
            'Low': '#10b981',
            'Medium': '#f59e0b',
            'High': '#ef4444',
            'Critical': '#dc2626'
        }
        return colors[priority] || '#6b7280';
    }

    const formatDate=(date)=>{
        return new Date(date).toLocaleString();
    }

   
    return(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-large" onClick={(e)=>e.stopPropagation()}>
                <div className="modal-header">
                    
                        <h2>Ticket Details</h2>
                       
                    
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="ticket-details-content">
                    <div className="ticket-header-section">
                        <div className="ticket-id">{ticket.ticketNumber}</div>
                        <div className="ticket-badges">
                            <span className="badge status-badge" style={{backgroundColor: getStatusColor(ticket.status)}}>{ticket.status}</span>
                            <span className="badge priority-badge" style={{backgroundColor: getPriorityColor(ticket.priority)}}>{ticket.priority}</span>
                            <span className="badge category-badge" >{ticket.category}</span>
                        </div>
                    </div>
                    <div className="ticket-info-grid">

                    <div className="info-item">
                        <label>Description</label>
                        <p>{ticket.description}</p>
                    </div>
                    <div className="info-item">
                        <label>Requester</label>
                        <p>{ticket.requesterName}({ticket.requesterEmail})</p>
                    </div>
                    <div className="info-item">
                        <label>Created</label>
                        <p>{formatDate(ticket.createdAt)}</p>
                    </div>
                    {ticket.assignedTo && (
                        <div className="info-item">
                        <label>Assigned To</label>
                        <p>{ticket.assignedTo}</p>
                    </div>
                    )}
                </div>

                {!isUserView && (
                    <>
                    {isEditing ? (
                        <div className="edit-section">
                            <h3>Update Ticket</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Status</label>
                                    <select name="status" value={formData.status} onChange={handleChange}>
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Closed">Cloesd</option>

                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Priority</label>
                                    <select name="priority" value={formData.priority} onChange={handleChange}>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                    
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Assign To</label>
                                <input type="text" name="assignedTo" value={formData.assignedTo} onChange={handleChange} placeholder="Technician name"/>
                            </div>

                            <div className="form-actions">
                                <button className="btn-cancel" onClick={()=>setIsEditing(false)}>Cancel</button>
                                <button className="btn-primary" onClick={handleUpdate}>Save Changes</button>
                            </div>
                        </div>
                    ):(
                        <button className="btn-edit" onClick={()=> setIsEditing(true)}>Edit ticket</button>

                    )}

                    <div className="notes-section">
                        <h3> Internal Notes</h3>

                        {ticket.notes && ticket.notes.length >0 ?(
                            <div className="notes-list">
                                {ticket.notes.map((note,index)=>(
                                    <div key={index} className="note-item">
                                        <div className="note-header">
                                            <strong>{note.addedBy}</strong>
                                            <span className="note-date">{formatDate(note.addedAt)}</span>
                                        </div>
                                        <p className="note-text">{note.text}</p>
                                        </div>

                                

                                ))}
                                </div>
                        ):(
                            <p className="no-notes">No notes yet</p>
                        )}

                        <div className="add-note">
                            <textarea value={noteText} onChange={(e)=>setNoteText(e.target.value)} placeholder="Add internal note.e... " rows="3"/>
                                <button className="btn-primary" onClick={handleAddNote}>Add Note</button>
                         </div>
                    </div>
                    
                    </>
                )}

                {isUserView && ticket.notes && ticket.notes.length > 0 && (
                    <div className="notes-section">
                        <h3>Updates</h3>
                        <div className="notes-list">{ticket.notes.map((note,index)=>(
                            <div key= {index} className="note-item">
                                <div className="note-header">
                                    <strong>{note.addedBy}</strong>
                                    <span className="note-date">{formatDate(note.addedAt)}</span>
                            </div>
                            <p className="note-text">{note.text}</p>
                    </div>
                ))}
                </div>
                </div>
                )}
                </div>
                </div>
                </div>
            );
        };

        


                
                    
                
export default TicketDetails;


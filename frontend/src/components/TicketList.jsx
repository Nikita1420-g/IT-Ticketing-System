import React from 'react'
import './TicketList.css'

const TicketList=({ tickets, onTicketClick})=>{
    const getPriorityClass=(priority)=>{
        return `priority priority-${priority}`;
    };

    const getStatusClass=(status)=>{
        return `status status-${status.replace(' ','-')}`;
    };

    const formatDate=(dateString)=>{
        const date= new Date(dateString);
        return date.toLocaleDateString() + ' '+ date.toLocaleTimeString();
    };

    if(tickets.length===0){
        return(
            <div className="empty-state">
                <h3> No Ticket found</h3>
                <p> Create you first ticket</p>
            </div>
        );
    }

    return(
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Ticket #</th>
                        <th> Title</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                       <th>Requester</th>
                        <th>Created</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket)=>(
                        <tr key={ticket._id} onClick={()=>onTicketClick(ticket)}>
                            <td><strong>{ticket.ticketNumber}</strong></td>
                            <td>{ticket.title}</td>
                            <td>{ticket.category}</td>
                            <td>
                                <span className={getPriorityClass(ticket.priority)}>{ticket.priority}</span>
                            </td>
                            <td><span className={getStatusClass(ticket.status)}>{ticket.status}</span></td>
                            <td>{ticket.requesterName}</td>
                            <td>{formatDate(ticket.createdAt)}</td>
                        </tr>

                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TicketList;
import React, { useState, useEffect } from 'react';
import { getMyTickets, createTicket }   from '../services/api';
import { useAuth } from '../context/AuthContext';
import TicketList from './TicketList';
import TicketForm from './TicketForm';
import TicketDetails from './TicketDetails';
import Chatbot from './Chatbot';
import './UserDashboard.css';

const UserDashboard=() =>{
    const [tickets, setTickets]=useState([]);
    const [filteredTickets, setFilteredTickets]= useState([]);
    const [loading, setLoading]= useState(true);
    const [showForm, setShowForm]= useState(false);
    const [selectedTicket, setSelectedTicket]= useState(null);
    const [statusFilter, setStatusFilter]= useState('all');
    const { user, logout}= useAuth();

    useEffect(()=>{
        fetchMyTickets();
    },[]);

    useEffect(()=>{
        applyFilters();

    }, [tickets, statusFilter]);

    const fetchMyTickets = async ()=>{
        try{
            setLoading(true);
            const response= await getMyTickets();
            setTickets(response.data || []);
        } catch(error){
            console.error('Error  fetching my tickets..', error);
            if(error.message?.status===401){
                logout();
            }
        } finally{
            setLoading(false);
        }
    };

    const applyFilters=()=>{
        let filtered= [...tickets];

        if(statusFilter !== 'all'){
            filtered= filtered.filter(ticket=> ticket.status=== statusFilter);
        }
        setFilteredTickets(filtered);
    };

    const handleCreateTicket= async(ticketData)=>{
        try{
            await createTicket(ticketData);
            alert('Ticket created successfully');
            setShowForm(false);
            fetchMyTickets();
        } catch(error){
            console.error('Error creating ticket: ', error);
            alert('Failed to create ticket');
        }
    };

    const handleTicketClick=(ticket)=>{
        setSelectedTicket(ticket);
    };

    const closeTicketDetails=()=>{
        setSelectedTicket(null);
        fetchMyTickets();
    };

    const getStatusCounts=()=>{
        return {
            total: tickets.length,
            open: tickets.filter(t=>t.status==='Open').length,
            inProgress: tickets.filter(t=>t.status==='In Progress').length,
            resolved: tickets.filter(t=>t.status==='Resolved').length
        };
    };

    const counts= getStatusCounts();

    return (
        <div className="user-dashboard">
            <header className="user-header">
                <div className="header-left">
                    <h1> My Support tickets</h1>
                    <p>Wekcome Back, {user?.name}</p>
                </div>

                <div className="header-right">
                    <span className="user-info">{user?.email}({user?.role}</span>
                    <button className= "btn-logout" onClick= {logout}>Logout</button>
                </div>
            </header>

            <div className= "stats-grid">
                <div className="stat-card">
                    <div className="stat-number">{counts.total}</div>
                    <div className="stat-label">Total tickets</div>
                </div>
                <div className="stat-card status-open">
                    <div className="stat-number">{counts.open}</div>
                    <div className="stat-label">Open</div>
                </div>
                <div className="stat-card status-progress">
                    <div className="stat-number">{counts.inProgress}</div>
                    <div className="stat-label">In Progress</div>
                    </div>

                    <div className="stat-card status-resolved">
                    <div className="stat-number">{counts.resolved}</div>
                    <div className="stat-label">Resolved</div>
                </div>
                </div>

                <div className="actions-bar">
                    <button className="btn-create-ticket" onClick={()=>setShowForm(true)}>
                        + Create new ticket
                    </button>
                </div>

                <div className="tickets-section">
                    <div className="section-header">
                        <h2>My Tickets</h2>
                        <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="filter-select">
                            <option value="all"> ALL status</option>
                            <option value="Open"> Open</option>
                            <option value="In Progress"> In Progress</option>
                            <option value="Resolved"> Resolved</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                    {loading?(
                        <div className="loading">Loading your tickets...</div>
                    ): filteredTickets.length===0?(
                        <div className="no-tickets">
                            <p>No tickets found</p>
                            <button className="btn-primary" onClick={()=>setShowForm(true)}>Create your first ticket</button>
                            </div>
                    ):(
                        <TicketList tickets= {filteredTickets} onTicketClick={handleTicketClick}/>
                    )}
                </div>

                {showForm && (
                    <TicketForm onSubmit= {handleCreateTicket} onClose={()=>setShowForm(false)}
                    hideUserFields={true}/>
                )}
                {selectedTicket && (
                    <TicketDetails ticket ={selectedTicket}
                    onClose={closeTicketDetails}
                    onUpdate={closeTicketDetails}
                    isUserView={true}/>
                )}

                <Chatbot />
            </div>
       
    );
};

export default UserDashboard;
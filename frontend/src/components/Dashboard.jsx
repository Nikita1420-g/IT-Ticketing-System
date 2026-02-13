import React, {useState, useEffect} from 'react';
import {getAllTickets, createTicket} from '../services/api';
import {useAuth} from '../context/AuthContext';
import StatsCards from './statsCards';
import TicketList from './TicketList';
import TicketForm from './TicketForm';
import TicketDetails from './TicketDetails';
import Chatbot from './Chatbot';

const Dashboard=()=>{
    const [tickets, setTickets]= useState([]);
    const [filteredTickets, setFilteredTickets]= useState([]);
    const[loading, setLoading]= useState(true);
    const [showForm, setShowForm]= useState(false);
    const [selectedTicket, setSelectedTicket]= useState(null);
    const[statusFilter, setStatusFilter]= useState('all');
    const [priorityFilter, setPriorityFilter]= useState('all');
    const {user, logout}= useAuth();

    useEffect(()=>{
        fetchTickets();
    },[]);

    useEffect(()=>{
        applyFilters();
    }, [tickets, statusFilter, priorityFilter]);

    const fetchTickets= async()=>{
        try{
            setLoading(true);
            const response= await getAllTickets();
            setTickets(response.data || []);
        }catch(error){
            console.error('Error fetching tickets: ', error);
            alert('Failed to load tickets');
        } finally{
            setLoading(false);
        }
    };

    const applyFilters=()=>{
        let filtered = [...tickets];

        if(statusFilter !== 'all'){
            filtered= filtered.filter(ticket=> ticket.status === statusFilter);
        }

        if(priorityFilter !== 'all'){
            filtered = filtered.filter(ticket=> ticket.priority===priorityFilter)
        }
        setFilteredTickets(filtered);
    };

    const handleCreateTicket = async(ticketData)=>{
        try{
          await createTicket(ticketData);
            alert('Ticket created succcessfully');
            setShowForm(false);
            fetchTickets();
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
        fetchTickets();
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                <h1> IT Service Desk</h1>
                <p>Welcome, {user?.name}({user?.role})</p>
                </div>
                <div style={{display: 'flex', gap:'12px'}}>
                <button className="btn-primary" onClick={()=> setShowForm(true)}> + Create New Ticket</button>
                <button className="btn-secondary" onClick={logout}>Logout</button>
                </div>
            </header>

            <StatsCards tickets={tickets} />

            <div className="tickets-section">
                <h2> All Tickets</h2>

                <div className= "filters">
                    <select value={statusFilter}
                    onChange={(e)=> setStatusFilter(e.target.value)}>
                        <option value="all"> All Status</option>
                        <option value="Open"> Open</option>
                        <option value="In Progress"> In Progress</option>
                        <option value="Pending"> Pending </option>
                        <option value="Resolved"> Resolved</option>
                        <option value="Closed"> Closed</option>
                    </select>
                    <select value={priorityFilter} onChange={(e)=>setPriorityFilter(e.target.value)}>
                    <option value="all"> All Priorities</option>
                    <option value="Low"> Low</option>
                    
                    <option value="Medium"> Medium</option>
                    <option value="High">High</option>
                    <option value="Critical"> Critical</option>
                    </select>
                </div>

                {loading ? (
                    <div className="loading"> Loading tickets...</div>
                ) : (
                    <TicketList
                    tickets={filteredTickets}
                    onTicketClick={handleTicketClick}
                    />
                )}
            
            </div>
            {showForm && (
                <TicketForm 
                onSubmit = {handleCreateTicket}
                onClose={()=> setShowForm(false)}
                />
            )}

            {selectedTicket && (
                <TicketDetails
                ticket= {selectedTicket}
                onClose={closeTicketDetails}
                onUpdate={closeTicketDetails}
                />
            )}
            <Chatbot/>
        </div>
    );
};
export default Dashboard;

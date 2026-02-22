import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTickets } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TicketList from './TicketList';
import TicketForm from './TicketForm';
import TicketDetails from './TicketDetails';
import './UserDashboard.css';
import Chatbot from './Chatbot';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getAllTickets();
      if (response.success) {
        setTickets(response.data);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusCount = (status) => {
    return tickets.filter(ticket => ticket.status === status).length;
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-dashboard-simple">
      {/* Header */}
      <div className="simple-header">
        <h1>IT Service Desk</h1>
        <p>Welcome, {user?.name} ({user?.role})</p>
      </div>

      {/* User Info */}
      <div className="simple-user-info">
        {user?.email}
      </div>

      {/* Logout Button */}
      <button onClick={handleLogout} className="simple-logout">
        Logout
      </button>

      {/* Stats Cards - Large Stacked */}
      <div className="simple-stats">
        <div className="simple-stat-card blue">
          <div className="stat-number">{tickets.length}</div>
          <div className="stat-label">TOTAL TICKETS</div>
        </div>

        <div className="simple-stat-card blue">
          <div className="stat-number">{getStatusCount('Open')}</div>
          <div className="stat-label">OPEN</div>
        </div>

        <div className="simple-stat-card orange">
          <div className="stat-number">{getStatusCount('In Progress')}</div>
          <div className="stat-label">IN PROGRESS</div>
        </div>

        <div className="simple-stat-card green">
          <div className="stat-number">{getStatusCount('Resolved')}</div>
          <div className="stat-label">RESOLVED</div>
        </div>
      </div>

      {/* Create Button */}
      <button onClick={() => setShowForm(true)} className="simple-create-btn">
        + Create new ticket
      </button>

      {/* All Tickets Section */}
      <div className="simple-tickets-section">
        <div className="simple-section-header">
          <h2>All Tickets</h2>
          <div className="simple-filters">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="simple-filter"
            >
              <option value="All">ALL status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="simple-filter"
            >
              <option value="All">ALL priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        {filteredTickets.length > 0 ? (
          <TicketList
            tickets={filteredTickets}
            onTicketClick={setSelectedTicket}
          />
        ) : (
          <div className="no-tickets">
            <p>No tickets found matching the selected filters</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <TicketForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchTickets();
          }}
        />
      )}

      {selectedTicket && (
        <TicketDetails
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={fetchTickets}
        />
      )}
      <Chatbot/>
    </div>

  );
};

export default Dashboard;
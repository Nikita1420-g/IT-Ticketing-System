import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyTickets } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TicketList from './TicketList';
import TicketForm from './TicketForm';
import TicketDetails from './TicketDetails';
import Chatbot from './Chatbot';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getMyTickets();
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
    return statusFilter === 'All' || ticket.status === statusFilter;
  });

  if (loading) {
    return <div className="loading">Loading your tickets...</div>;
  }

  return (
    <div className="user-dashboard-simple">
      {/* Header */}
      <div className="simple-header">
        <h1>My Support tickets</h1>
        <p>Welcome Back, {user?.name}</p>
      </div>

      {/* User Info */}
      <div className="simple-user-info">
        {user?.email} ({user?.role})
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

      {/* My Tickets Section */}
      <div className="simple-tickets-section">
        <div className="simple-section-header">
          <h2>My Tickets</h2>
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
        </div>

        {filteredTickets.length > 0 ? (
          <TicketList
            tickets={filteredTickets}
            onTicketClick={setSelectedTicket}
          />
        ) : (
          <div className="no-tickets">
            <p>No tickets found</p>
            <button onClick={() => setShowForm(true)} className="simple-create-btn" style={{ marginTop: '20px' }}>
              + Create Your First Ticket
            </button>
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

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default UserDashboard;
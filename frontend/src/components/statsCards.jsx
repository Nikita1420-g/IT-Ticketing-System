import React from 'react';

const statsCards= ({tickets})=>{
    const totalCount= tickets.length;
    const openCount=tickets.filter(t=> t.status==='Open').length;
    const inProgressCount= tickets.filter(t=> t.status==='In Progress').length;
    const resolvedCount= tickets.filter(t=>t.status=== 'Resolved').length;

    return (
        <div className= "stats-container">
            <div className="stat-card">
                <h3>{totalCount}</h3>
                <p>Total Tickets</p>
            </div>
            <div className="stat-card">
                <h3>{openCount}</h3>
                <p>Open</p>
            </div>
           
            <div className="stat-card">
                <h3>{inProgressCount}</h3>
                <p>In Progress</p>
            </div>

            <div className="stat-card">
                <h3>{resolvedCount}</h3>
                <p>Resolved</p>
            </div>
        </div>
    );
};

export default statsCards;
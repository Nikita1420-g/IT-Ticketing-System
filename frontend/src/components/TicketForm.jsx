import React, {useState} from 'react';


const TicketForm= ({ onSubmit, onClose, hideUserFields= false})=>{
    const [formData, setFormData]= useState({
        title: '',
        description: '',
        category: '',
        priority: 'Medium',
        requesterName: '',
        requesterEmail: ''
    });

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });
    };

    const handleSubmit=(e)=>{
        e.preventDefault();
        const submitData= hideUserFields?{title:formData.title,description:formData.description, category:formData.category,priority:formData.priority}:formData;
        
        onSubmit(submitData);
    };

    return(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e)=> e.stopPropagation()}>
                <div className="modal-header">
                    <h2> Create New Ticket</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title *</label>
                        <input 
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required placeholder="brief Description of the issue"/>
                    </div>
                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                        name ="description"
                        
                        value={formData.description}
                        onChange={handleChange}
                        required rows="4" placeholder="Detailed Description of the problem"/>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category *</label>
                            <select 
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            >
                                <option value=""> Select Category...</option>
                                <option value="Hardware"> Hardware</option>
                                <option value="Software"> Software</option>
                                <option value="Network"> Network</option>
                                <option value="Access"> Access</option>
                                <option value="Other"> Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Priority *</label>
                            <select 
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            required
                            >
                                 <option value="Low"> Low</option>
                                <option value="Medium"> Medium</option>
                                <option value="High"> High</option>
                                <option value="Critical"> Critical</option>
                                

                            </select>
                        </div>
                    </div>
                    {!hideUserFields && (
                        <>
                          <div className="form-row">
                    <div className="form-group">
                        <label> Your Name *</label>
                        <input 
                        type="text"
                        name="requesterName"
                        value={formData.requesterName}
                        onChange={handleChange}
                        required
                        placeholder="Alex"
                        />
                    </div>
                    <div className="form-group">
                        <label> Your Email *</label>
                        <input 
                          type="email"
                        name="requesterEmail"
                        value={formData.requesterEmail}
                        onChange={handleChange}
                        required
                        placeholder="Alex@example.com"
                        />
                    </div>

                    </div>

                        </>
                    )}
                   

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}> Cancel</button>
                        <button type="submit" className="btn-primary">
                            Create Ticket
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default TicketForm;
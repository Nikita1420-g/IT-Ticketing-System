import axios from 'axios';

const API_URL= `${process.env.REACT_APP_API_URL || 'http://localhost:4000/api'}/auth`;

// get auth token
const getAuthHeader=()=>{
    const token=localStorage.getItem('token');
    return token ? {Authorization: `Bearer ${token}`}:{};
}

// create new ticket 
export const createTicket= async(ticketData)=>{
    try{
        const response= await axios.post(`${API_URL}/tickets`,ticketData, {headers:getAuthHeader()});
        return response.data;
    } catch(error){
        console.error('Error creating ticket: ', error);
        throw error;
    }
};
// get all tickets
export const getAllTickets= async()=>{
    try{
        const response= await axios.get(`${API_URL}/tickets`,{
            headers: getAuthHeader()
        });
        return response.data;
    }catch(error){
        console.log('Error fetching tickets: ',error);
        throw error;
    }
};

// get user's own ticket
export const getMyTickets= async()=>{
    try{
        const response= await axios.get(`${API_URL}/tickets/my-tickets`,{
            headers: getAuthHeader()
        });
        return response.data;

    } catch(error){
        console.log('Error fetching my tickets: ', error);
        throw error;
    }

};

// get single ticket
export const getTicketById= async (id)=>{
    try{
        const response=await axios.get(`${API_URL}/tickets/${id}`);
        return response.data;
    } catch(error){
        console.error('Error fetching ticket: ', error);
        throw error;
    }
};


export const updateTicket= async(id, updateData)=>{
    try{
        const response= await axios.put(`${API_URL}/tickets/${id}`,updateData,{
            headers: getAuthHeader()
        });
        return response.data;
    } catch(error){
        console.error('Error updating ticket: ', error);
        throw error;
    }
};



// delete ticket
export const deleteTicket= async(id)=>{
    try{
        const response= await axios.delete(`${API_URL}/tickets/${id}`,{
            headers: getAuthHeader()
        });
        return response.data;
    } catch(error){
        console.error('Error deleting tickets',error);
        throw error;
    }
};

// add note to ticket
export const addNoteToTicket= async(id, noteData)=>{
    try{
        const response= await axios.post(`${API_URL}/tickets/${id}/notes`, noteData,{
            headers: getAuthHeader()
        });
        return response.data;
    } catch(error){
        console.error('Error adding note: ',error);
        throw error;
    }
};
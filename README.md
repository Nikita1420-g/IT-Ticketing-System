# IT Service Management Platform

A comprehensive full-stack IT ticketing system built with the MERN stack, featuring role-based access control, AI-powered chatbot support, and automated email notifications.


<img width="1387" height="838" alt="Screenshot 2026-02-13 at 12 47 23 PM" src="https://github.com/user-attachments/assets/abe1ee77-cde7-4578-b9c4-5aca93d0faf7" />

---

## Features

###  Authentication & Authorization
- Secure user registration and login with JWT authentication
- Role-based access control (User, Technician, Admin)
- Password hashing with bcrypt
- Protected routes and API endpoints
- Session persistence with localStorage

### Comprehensive Ticket Management
- **Users**: Create support tickets and track their status
- **Technicians**: View all tickets, update status, assign tickets, add internal notes
- **Admins**: Full system access including ticket deletion
- Real-time ticket status tracking (Open, In Progress, Resolved, Closed)
- Priority levels (Low, Medium, High, Critical)
- Category classification (Hardware, Software, Network, Access, Other)
- Automatic ticket numbering system (TICKET-XXXXX)

###  AI-Powered Chatbot
- Intelligent IT support assistant powered by Groq AI (Llama 3.3 70B)
- Natural language conversation for troubleshooting
- Automatic ticket creation from chat conversations
- Context-aware responses based on conversation history
- Smart extraction of ticket details (title, description, category, priority)
- Seamless integration with ticket system

###  Automated Email Notifications
- Ticket creation confirmation emails
- Status update notifications to users
- New internal note alerts
- Powered by Nodemailer with Gmail SMTP

###  Dashboard & Analytics
- **User Dashboard**: Personal ticket overview with statistics
- **Technician Dashboard**: System-wide ticket view with advanced filtering
- **Admin Dashboard**: Complete system analytics and management
- Real-time statistics (Total, Open, In Progress, Resolved)
- Advanced filtering by status and priority

###  Modern, Responsive UI/UX
- Clean, intuitive interface design
- Fully responsive (Mobile, Tablet, Desktop)
- Smooth animations and transitions
- Gradient color themes
- Interactive modal components
- Professional stat cards and badges

---

##  Tech Stack

### Frontend
- **React.js** - UI library for building interactive interfaces
- **React Router DOM** - Client-side routing and navigation
- **Axios** - HTTP client for API requests
- **React Icons** - Comprehensive icon library
- **CSS3** - Modern styling with animations and gradients

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework
- **MongoDB** - NoSQL database with MongoDB Atlas
- **Mongoose** - Elegant MongoDB object modeling
- **JWT (jsonwebtoken)** - Secure authentication tokens
- **bcryptjs** - Password hashing and security

### AI & Automation
- **Groq AI** - Fast AI inference for chatbot (Llama 3.3 70B model)
- **Nodemailer** - Email sending automation

---


## Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB Atlas Account** - [Sign up](https://cloud.mongodb.com)
- **Gmail Account** - For email notifications
- **Groq API Key** - [Get free key](https://console.groq.com)

---

### Clone the Repository
```bash
git clone https://github.com/Nikita1420-g/IT-Ticketing-System.git
cd IT-Ticketing-System
```

---

### Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend/` folder:
```env
# Server Configuration
PORT=4000

# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# Authentication
JWT_SECRET=your_secret_key_at_least_32_characters_long

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_specific_password

# Groq AI (for Chatbot)
GROQ_API_KEY=your_groq_api_key_here
```

#### Get MongoDB Connection String:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Click **"Connect"** → **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<dbname>` with your database name (e.g., `it-service-platform`)

#### Get Groq API Key:
1. Go to [Groq Console](https://console.groq.com)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **"Create API Key"**
5. Copy the key (starts with `gsk_`)

#### Setup Gmail App Password:
1. Enable **2-factor authentication** on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Select **"Mail"** and your device
4. Click **"Generate"**
5. Copy the 16-character password
6. Use this as `EMAIL_PASS` in your `.env` file

#### Start Backend Server
```bash
npm start
```

 You should see:
```
Server running on http://localhost:4000
MongoDB atlas connected
Email service is ready
```

---

###  Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Start Frontend Development Server
```bash
npm start
```

 Browser opens automatically at `http://localhost:3000`

---

###  Create Test Accounts

After both servers are running, create test accounts:

#### Option A: Using Browser Console
Open browser console (F12) and run:
```javascript
fetch('http://localhost:4000/api/seed/create-test-users', {
  method: 'POST'
}).then(r => r.json()).then(console.log);
```

#### Option B: Register Manually
1. Go to `http://localhost:3000/register`
2. Create an account
3. To make it a technician/admin, update the role in MongoDB:
   - Open MongoDB Atlas
   - Go to your database → `users` collection
   - Find the user and change `role` field to `"technician"` or `"admin"`

---

##  Test Accounts

After running the seed script, you can login with:

| Email | Password | Role | Access |
|-------|----------|------|--------|
| `user@test.com` | `password123` | User | Create and view own tickets |
| `tech@test.com` | `password123` | Technician | View/update all tickets, add notes |
| `admin@test.com` | `password123` | Admin | Full system access + delete tickets |

---

## Testing Guide

### Test as Regular User
1. Login with `user@test.com` / `password123`
2. Click **"+ Create new ticket"**
3. Fill in ticket details and submit
4. Check your email for confirmation
5. View ticket in "My Tickets" section
6. Try the AI chatbot in bottom right

### Test as Technician
1. Login with `tech@test.com` / `password123`
2. View all tickets from all users
3. Click on a ticket to view details
4. Assign ticket to yourself
5. Change status to "In Progress"
6. Add an internal note
7. Mark as "Resolved"
8. User receives email notification

### Test as Admin
1. Login with `admin@test.com` / `password123`
2. Access all technician features
3. Additionally, you can delete tickets
4. View system-wide statistics

---

##  Project Structure
```
it-service-platform/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema with roles
│   │   └── Ticket.js            # Ticket schema
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── tickets.js           # Ticket CRUD operations
│   │   ├── chatbot.js           # AI chatbot endpoints
│   │   └── seed.js              # Test user creation
│   ├── middleware/
│   │   └── auth.js              # JWT verification & role checks
│   ├── services/
│   │   ├── emailService.js      # Email notifications
│   │   └── chatbotService.js    # Groq AI integration
│   ├── database.js              # MongoDB connection
│   ├── server.js                # Express server setup
│   ├── .env.example             # Environment template
│   └── package.json             # Backend dependencies
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx           # Login page
    │   │   ├── Register.jsx        # Registration page
    │   │   ├── Dashboard.jsx       # Technician/Admin dashboard
    │   │   ├── UserDashboard.jsx   # User dashboard
    │   │   ├── TicketList.jsx      # Ticket table component
    │   │   ├── TicketForm.jsx      # Create ticket modal
    │   │   ├── TicketDetails.jsx   # Ticket details modal
    │   │   ├── Chatbot.jsx         # AI chatbot component
    │   │   └── ProtectedRoute.jsx  # Route protection
    │   ├── context/
    │   │   └── AuthContext.js      # Global auth state
    │   ├── services/
    │   │   ├── api.js              # Ticket API calls
    │   │   ├── authApi.js          # Auth API calls
    │   │   └── chatbotApi.js       # Chatbot API calls
    │   ├── App.js                  # Main app component
    │   └── index.js                # React entry point
    └── package.json                # Frontend dependencies
```

---

##  Key Features Explained

### Role-Based Access Control (RBAC)

####  User Role (Green Badge)
- Create new support tickets
- View only their own tickets
-  Track ticket status updates
-  Use AI chatbot for assistance
-  Cannot edit tickets
-  Cannot view other users' tickets

####  Technician Role (Orange Badge)
-  View all tickets system-wide
- Assign tickets to themselves
- Update ticket status and priority
- Add internal notes (visible to tech/admin only)
- Mark tickets as resolved
-  Cannot delete tickets

####  Admin Role (Red Badge)
- All technician permissions
- Delete any ticket
- Full system access
- User management capabilities
-  System-wide analytics

---

### AI Chatbot Capabilities

**Natural Language Processing:**
- Understands IT support questions in plain English
- Provides troubleshooting guidance
- Remembers conversation context

**Smart Ticket Creation:**
- Automatically extracts issue details from conversation
- Suggests appropriate category and priority
- Pre-fills ticket form with extracted information
- Creates ticket with one click

**Integration:**
- Seamlessly integrated with ticket system
- Auto-fills user information from logged-in session
- Sends confirmation emails after ticket creation

---

##  Troubleshooting

### Backend won't start
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm start
```

### MongoDB connection fails
-  Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for development)
-  Verify connection string in `.env` is correct
-  Ensure database user has read/write permissions
-  Check database password doesn't contain special characters (URL encode if needed)

### Emails not sending
-  Verify Gmail app password is correct (not your regular Gmail password)
-  Confirm 2-factor authentication is enabled on Google account
-  Check `EMAIL_USER` and `EMAIL_PASS` in `.env`
-  Try regenerating app password

### Chatbot not responding
-  Verify Groq API key is valid
-  Check you haven't exceeded free tier limits
-  Ensure backend server is running
-  Check browser console for errors

### Frontend build errors
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### "React Icons not showing"
```bash
cd frontend
npm install react-icons
npm start
```

---


##  Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

##  Author

**Nikita Gupta**

-  Email: nikitagupta1403ng@gmail.com
- LinkedIn: [Nikita Gupta](www.linkedin.com/in/nikita-gupta-95821b261)
-  GitHub: [@Nikita1420-g](https://github.com/Nikita1420-g)
-  Student: Information Technology, Kwantlen Polytechnic University

---

##  Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Node.js](https://nodejs.org/) - Backend runtime
- [MongoDB](https://www.mongodb.com/) - Database
- [Groq AI](https://groq.com/) - AI chatbot intelligence
- [Nodemailer](https://nodemailer.com/) - Email automation
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library
- [JWT](https://jwt.io/) - Authentication tokens

---


- Email: nikitagupta1403ng@gmail.com
- Issues: [GitHub Issues](https://github.com/Nikita1420-g/IT-Ticketing-System/issues)

---



**Built by Nikita Gupta |  2026**

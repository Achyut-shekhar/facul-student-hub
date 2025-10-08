# EduAttend - Faculty Student Attendance Management System

A modern web application for managing student attendance with real-time updates and multiple attendance marking methods.

## Features

- **User Authentication**

  - Role-based access (Faculty/Student)
  - Secure JWT-based authentication
  - Protected routes and API endpoints

- **Faculty Features**

  - Create and manage classes
  - Generate unique join codes for classes
  - Start/end attendance sessions
  - View attendance records and statistics
  - Manage student enrollments

- **Student Features**
  - Join classes using unique codes
  - Mark attendance using verification codes
  - View attendance history and statistics
  - Real-time session notifications

## Tech Stack

### Frontend

- React with Vite
- TailwindCSS
- Shadcn UI components
- React Query for data fetching
- React Router for navigation

### Backend

- Node.js with Express
- JWT for authentication
- In-memory data store
- RESTful API architecture

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Achyut-shekhar/facul-student-hub.git
cd facul-student-hub
```

2. Install dependencies:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Running the Application

There are multiple ways to run the application. Choose the method that works best for your workflow:

#### Option 1: Using the PowerShell Script (Recommended for Windows)

This method automatically handles process cleanup and starts both servers:

```powershell
.\start-dev.ps1
```

#### Option 2: Using npm Concurrent Script

Run both servers using the concurrent script:

```bash
npm run start:dev
```

#### Option 3: Running Servers Separately

If you need to run the servers independently:

1. Start the Backend Server:

```bash
cd backend
npm run dev    # Runs with nodemon for development
# or
npm start      # Runs without auto-reload
```

2. Start the Frontend Server (in a new terminal):

```bash
npm run frontend    # Starts Vite dev server
```

#### Development Ports

The application will be available at:

- Frontend: http://localhost:8080 (Vite)
- Backend API: http://localhost:3001 (Express)

#### Stopping the Servers

- If using PowerShell script: The script handles cleanup automatically
- If running manually: Use Ctrl+C in each terminal window
- If processes are stuck: Run `taskkill /F /IM node.exe` (Windows) or `pkill node` (Unix)

### Test Credentials

#### Faculty Account

- Email: faculty@school.edu
- Password: password

#### Student Account

- Email: student@school.edu
- Password: password

## Project Structure

```
facul-student-hub/
├── backend/                # Backend server code
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/       # API route definitions
│   │   ├── store/        # In-memory data store
│   │   └── index.js      # Server entry point
│   └── package.json
│
├── src/                   # Frontend source code
│   ├── components/        # React components
│   │   ├── ui/           # Shadcn UI components
│   │   ├── layout/       # Layout components
│   │   └── attendance/   # Attendance related components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── main.jsx         # Frontend entry point
│
├── public/               # Static assets
├── start-dev.ps1        # Development startup script
└── package.json
```

## API Endpoints

### Authentication

- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user

### Faculty Routes

- GET `/api/faculty/classes` - Get faculty's classes
- POST `/api/faculty/classes` - Create a new class
- POST `/api/faculty/classes/:classId/sessions` - Start attendance session
- PUT `/api/faculty/classes/:classId/sessions/:sessionId/end` - End attendance session

### Student Routes

- GET `/api/student/classes` - Get enrolled classes
- POST `/api/student/classes/join` - Join a class using code
- POST `/api/student/attendance` - Mark attendance

## Development

### Directory Structure Details

- `backend/src/controllers/` - Business logic
- `backend/src/middleware/` - Custom middleware (auth, error handling)
- `backend/src/routes/` - API route definitions
- `backend/src/store/` - In-memory data store and helper functions
- `src/components/` - Reusable React components
- `src/contexts/` - React context providers
- `src/services/` - API integration services

### Available Scripts

- `npm run frontend` - Run frontend only
- `npm run backend` - Run backend only
- `npm run start:dev` - Run both frontend and backend
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Deploy to Static Hosting

The built files in the `dist` folder can be deployed to any static hosting service such as:

- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Firebase Hosting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.

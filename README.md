# MalScanX - File Security Scanner

A full-stack application for scanning files for malicious content with real-time status updates.

## Features

- **File Upload**: Drag and drop interface for PDF, DOCX, JPG, and PNG files
- **Real-time Scanning**: Background processing with status updates
- **Dashboard**: Live monitoring of scan results with auto-refresh
- **Security**: Checks for malicious keywords and patterns
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Project Structure

```
MalScanX/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # Express routes
│   │   └── workers/        # Background workers
│   └── package.json
└── README.md
```

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications
- **React Dropzone** for file uploads

### Backend
- **Node.js** with TypeScript
- **Express.js** for API server
- **MongoDB** with Mongoose
- **Multer** for file uploads
- **CORS** for cross-origin requests

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MalScanX
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `malscanx`

4. **Configure environment variables**
   ```bash
   # In server directory, create .env file
   cd server
   echo "PORT=3001
   MONGODB_URI=mongodb://localhost:27017/malscanx
   NODE_ENV=development" > .env
   ```

### Running the Application

1. **Start the server**
   ```bash
   cd server
   npm run dev
   ```
   Server will start on http://localhost:3001

2. **Start the client**
   ```bash
   cd client
   npm run dev
   ```
   Client will start on http://localhost:5173

3. **Access the application**
   - Open http://localhost:5173 in your browser
   - Upload files and monitor scan results

## API Endpoints

### POST /upload
Upload a file for scanning
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (PDF, DOCX, JPG, PNG, max 5MB)
- **Response**: File metadata with scan job ID

### GET /files
Get all scanned files with their status
- **Response**: Array of file objects with metadata

### GET /health
Health check endpoint
- **Response**: Server status

## File Scanning

The application scans files for:
- **Malicious keywords**: `rm -rf`, `eval`, `bitcoin`, etc.
- **File type validation**: Only allows PDF, DOCX, JPG, PNG
- **Size limits**: Maximum 5MB per file
- **Background processing**: Non-blocking scan operations

## Development

### Client Development
```bash
cd client
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Server Development
```bash
cd server
npm run dev          # Start with nodemon
npm run build        # Build TypeScript
npm start           # Start production server
```

## Production Deployment

1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Build the server**
   ```bash
   cd server
   npm run build
   ```

3. **Deploy to your preferred platform**
   - Heroku, Vercel, AWS, etc.
   - Configure environment variables
   - Set up MongoDB connection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import uploadRoutes from './routes/upload';
import filesRoutes from './routes/files';
import logsRoutes from './routes/logs';
import { broadcastLog } from './routes/logs';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MalScanX API',
      version: '1.0.0',
      description: 'API for file security scanning application',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve uploaded files (for development)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Welcome page
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to MalScanX API',
    version: '1.0.0',
    endpoints: {
      health: `http://localhost:${PORT}/health`,
      upload: `http://localhost:${PORT}/upload`,
      files: `http://localhost:${PORT}/files`,
      docs: `http://localhost:${PORT}/api-docs`,
    },
    description: 'File security scanning application with real-time status updates',
  });
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/upload', uploadRoutes);
app.use('/files', filesRoutes);
app.use('/logs', logsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/malscanx';
    await mongoose.connect(mongoURI);
    const message = 'MongoDB connected successfully';
    console.log(message);
    broadcastLog(message, 'success');
  } catch (error) {
    const errorMessage = `MongoDB connection error: ${error}`;
    console.error(errorMessage);
    broadcastLog(errorMessage, 'error');
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      const startupMessages = [
        `🚀 Server running on port ${PORT}`,
        `📖 API Documentation: http://localhost:${PORT}/api-docs`,
        `🏠 Welcome page: http://localhost:${PORT}/`,
        `💚 Health check: http://localhost:${PORT}/health`,
        `📤 Upload endpoint: http://localhost:${PORT}/upload`,
        `📁 Files endpoint: http://localhost:${PORT}/files`,
        `📊 Log stream: http://localhost:${PORT}/logs/stream`
      ];
      
      startupMessages.forEach(msg => {
        console.log(msg);
        broadcastLog(msg, 'info');
      });
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down server...');
  await mongoose.connection.close();
  process.exit(0);
});

startServer(); 
import express from 'express';

const router = express.Router();

// Store connected clients
const clients = new Set<express.Response>();

// Middleware to handle SSE
const sseMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
  });

  // Send initial connection message
  res.write(`data: ${JSON.stringify({
    message: 'Connected to log stream',
    type: 'success',
    timestamp: new Date().toISOString()
  })}\n\n`);

  // Add client to set
  clients.add(res);

  // Remove client when connection closes
  req.on('close', () => {
    clients.delete(res);
  });

  next();
};

// GET /logs/stream - Server-Sent Events endpoint
router.get('/stream', sseMiddleware, (req, res) => {
  // Keep connection alive
  const keepAlive = setInterval(() => {
    res.write(`data: ${JSON.stringify({
      message: 'ping',
      type: 'info',
      timestamp: new Date().toISOString()
    })}\n\n`);
  }, 30000); // Send ping every 30 seconds

  req.on('close', () => {
    clearInterval(keepAlive);
  });
});

// Function to broadcast logs to all connected clients
export const broadcastLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
  const logData = {
    message,
    type,
    timestamp: new Date().toISOString()
  };

  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(logData)}\n\n`);
  });
};

export default router; 
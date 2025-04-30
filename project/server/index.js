import express from 'express';
import http from 'node:http';
import cors from 'cors';
import { Server } from 'socket.io';
import { initWhatsApp } from './whatsapp.js';
import { handleMessage, getConversationStats, getActiveConversations } from './ai-handler.js';
import { getSessionList, saveSession, deleteSession } from './session-manager.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Track active WhatsApp connections
const connections = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send list of available sessions on connection
  getSessionList().then(sessions => {
    socket.emit('sessions', sessions);
  });

  // Initialize a new WhatsApp session
  socket.on('init-session', async (sessionId) => {
    try {
      if (connections.has(sessionId)) {
        socket.emit('session-status', { 
          id: sessionId, 
          status: 'connected',
          message: 'Session already active'
        });
        return;
      }

      const { client, state } = await initWhatsApp(sessionId, {
        onQR: (qr) => {
          socket.emit('qr-code', { sessionId, qr });
        },
        onConnectionUpdate: (update) => {
          socket.emit('connection-update', { sessionId, ...update });
        },
        onMessage: async (message) => {
          socket.emit('new-message', message);
          
          // Process with AI if not from the CS agent
          if (!message.fromMe) {
            const aiResponse = await handleMessage(message.body, message.from);
            if (aiResponse.processed) {
              await client.sendMessage(message.from, { text: aiResponse.text });
            }
            socket.emit('ai-processing', { 
              sessionId,
              from: message.from,
              aiResponse
            });
          }
        }
      });

      connections.set(sessionId, { client, state });
      
      // Save session information
      await saveSession(sessionId, { createdAt: new Date() });
      
      socket.emit('session-status', { 
        id: sessionId, 
        status: 'initializing',
        message: 'Session initialized, waiting for QR scan'
      });
    } catch (error) {
      console.error('Failed to initialize session:', error);
      socket.emit('session-status', { 
        id: sessionId, 
        status: 'error',
        message: `Error initializing session: ${error.message}`
      });
    }
  });

  // Send message through WhatsApp
  socket.on('send-message', async ({ sessionId, to, message }) => {
    try {
      const session = connections.get(sessionId);
      if (!session) {
        socket.emit('send-result', { 
          success: false, 
          error: 'Session not found' 
        });
        return;
      }

      await session.client.sendMessage(to, { text: message });
      socket.emit('send-result', { success: true });
    } catch (error) {
      console.error('Failed to send message:', error);
      socket.emit('send-result', { 
        success: false, 
        error: error.message 
      });
    }
  });

  // Close session
  socket.on('close-session', async (sessionId) => {
    try {
      const session = connections.get(sessionId);
      if (session) {
        await session.client.logout();
        connections.delete(sessionId);
        socket.emit('session-closed', { 
          id: sessionId, 
          status: 'closed' 
        });
      }
    } catch (error) {
      console.error('Failed to close session:', error);
    }
  });

  // Delete session
  socket.on('delete-session', async (sessionId) => {
    try {
      const session = connections.get(sessionId);
      if (session) {
        await session.client.logout();
        connections.delete(sessionId);
      }
      await deleteSession(sessionId);
      socket.emit('session-deleted', { id: sessionId });
      
      // Update sessions list
      getSessionList().then(sessions => {
        socket.emit('sessions', sessions);
      });
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  });

  // Get statistics
  socket.on('get-stats', async () => {
    try {
      const stats = await getConversationStats();
      socket.emit('stats', stats);
    } catch (error) {
      console.error('Failed to get stats:', error);
    }
  });

  // Get active conversations
  socket.on('get-conversations', async () => {
    try {
      const conversations = await getActiveConversations();
      socket.emit('conversations', conversations);
    } catch (error) {
      console.error('Failed to get conversations:', error);
    }
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API routes
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await getSessionList();
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const stats = await getConversationStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/conversations', async (req, res) => {
  try {
    const conversations = await getActiveConversations();
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// backend/server.js
const express = require('express');
const { Server } = require('ws');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;

// HTTP server for serving WebSocket on the same port
const server = app.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});

// WebSocket server
const wss = new Server({ server });

wss.on('connection', (ws, req) => {
  // Log details when a client connects
  const clientIp = req.socket.remoteAddress;
  console.log(`New client connected from ${clientIp}`);
  console.log(`Total connected clients: ${wss.clients.size}`);

  // Log when a message is received from a client
  ws.on('message', (message) => {
    console.log(`Received message from ${clientIp}: ${message}`);

    // Broadcasting the message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        console.log(`Broadcasting message to client: ${message}`);
        client.send(message);
      }
    });
  });

  // Log when the client connection is closed
  ws.on('close', () => {
    console.log(`Client disconnected from ${clientIp}`);
    console.log(`Total connected clients: ${wss.clients.size}`);
  });

  // Log if any error occurs
  ws.on('error', (error) => {
    console.error(`WebSocket error from ${clientIp}:`, error);
  });
});

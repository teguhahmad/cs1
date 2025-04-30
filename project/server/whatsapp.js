import { default as makeWASocket, DisconnectReason, useMultiFileAuthState } from '@baileys/baileys';
import { Boom } from '@hapi/boom';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSION_DIR = path.join(__dirname, '../sessions');

// Ensure sessions directory exists
if (!fs.existsSync(SESSION_DIR)) {
  fs.mkdirSync(SESSION_DIR, { recursive: true });
}

export async function initWhatsApp(sessionId, callbacks = {}) {
  const sessionPath = path.join(SESSION_DIR, sessionId);
  
  // Create session directory if it doesn't exist
  if (!fs.existsSync(sessionPath)) {
    fs.mkdirSync(sessionPath, { recursive: true });
  }
  
  // Get authentication state
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
  
  const client = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    defaultQueryTimeoutMs: 60000
  });
  
  // Handle connection updates
  client.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr && callbacks.onQR) {
      callbacks.onQR(qr);
    }
    
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error instanceof Boom && 
        lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut);
      
      console.log('Connection closed due to ', lastDisconnect?.error?.message);
      
      if (shouldReconnect) {
        console.log('Reconnecting...');
        initWhatsApp(sessionId, callbacks);
      } else {
        console.log('Disconnected permanently');
      }
    }
    
    if (callbacks.onConnectionUpdate) {
      callbacks.onConnectionUpdate(update);
    }
  });
  
  // Save credentials on update
  client.ev.on('creds.update', saveCreds);
  
  // Handle incoming messages
  client.ev.on('messages.upsert', async (messageInfo) => {
    if (messageInfo.type === 'notify') {
      for (const msg of messageInfo.messages) {
        if (msg.key.remoteJid && !msg.key.fromMe && msg.message) {
          // Process and format incoming message
          const formattedMessage = {
            id: msg.key.id,
            from: msg.key.remoteJid,
            fromMe: false,
            timestamp: msg.messageTimestamp,
            body: msg.message.conversation || 
                  (msg.message.extendedTextMessage && msg.message.extendedTextMessage.text) ||
                  (msg.message.imageMessage && msg.message.imageMessage.caption) ||
                  'Media message',
            hasMedia: !!msg.message.imageMessage || !!msg.message.audioMessage || !!msg.message.videoMessage,
            mediaType: msg.message.imageMessage ? 'image' : 
                      msg.message.audioMessage ? 'audio' : 
                      msg.message.videoMessage ? 'video' : null
          };
          
          if (callbacks.onMessage) {
            callbacks.onMessage(formattedMessage);
          }
        }
      }
    }
  });
  
  return { client, state };
}
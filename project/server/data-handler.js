import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');
const CONVERSATIONS_FILE = path.join(DATA_DIR, 'conversations.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const STATS_FILE = path.join(DATA_DIR, 'stats.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

// Initialize files if they don't exist
async function initializeFiles() {
  await ensureDataDir();
  
  const files = {
    [CONVERSATIONS_FILE]: [],
    [MESSAGES_FILE]: [],
    [STATS_FILE]: {
      totalConversations: 0,
      totalMessages: 0,
      activeConversations: 0,
      lastUpdated: new Date().toISOString()
    }
  };

  for (const [file, defaultContent] of Object.entries(files)) {
    try {
      await fs.access(file);
    } catch {
      await fs.writeFile(file, JSON.stringify(defaultContent, null, 2));
    }
  }
}

// Read JSON file
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

// Write JSON file
async function writeJsonFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Conversations
export async function getConversations() {
  const conversations = await readJsonFile(CONVERSATIONS_FILE);
  return conversations || [];
}

export async function saveConversation(conversation) {
  const conversations = await getConversations();
  const index = conversations.findIndex(c => c.id === conversation.id);
  
  if (index >= 0) {
    conversations[index] = { ...conversations[index], ...conversation };
  } else {
    conversations.push({
      ...conversation,
      createdAt: new Date().toISOString()
    });
  }
  
  await writeJsonFile(CONVERSATIONS_FILE, conversations);
  await updateStats();
  return conversation;
}

// Messages
export async function getMessages(conversationId) {
  const messages = await readJsonFile(MESSAGES_FILE);
  return (messages || []).filter(m => m.conversationId === conversationId);
}

export async function saveMessage(message) {
  const messages = await readJsonFile(MESSAGES_FILE) || [];
  messages.push({
    ...message,
    timestamp: new Date().toISOString()
  });
  
  await writeJsonFile(MESSAGES_FILE, messages);
  await updateStats();
  return message;
}

// Stats
async function updateStats() {
  const conversations = await getConversations();
  const messages = await readJsonFile(MESSAGES_FILE) || [];
  const hourAgo = new Date(Date.now() - 3600000).toISOString();
  
  const stats = {
    totalConversations: conversations.length,
    totalMessages: messages.length,
    activeConversations: conversations.filter(c => 
      messages.some(m => 
        m.conversationId === c.id && 
        m.timestamp > hourAgo
      )
    ).length,
    lastUpdated: new Date().toISOString()
  };
  
  await writeJsonFile(STATS_FILE, stats);
  return stats;
}

export async function getStats() {
  const stats = await readJsonFile(STATS_FILE);
  return stats || await updateStats();
}

// Initialize on module load
initializeFiles().catch(console.error);
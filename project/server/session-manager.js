import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSIONS_DB_PATH = path.join(__dirname, '../data/sessions.json');
const SESSIONS_DIR = path.join(__dirname, '../sessions');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(SESSIONS_DB_PATH);
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

// Get all sessions
export async function getSessionList() {
  await ensureDataDir();
  
  try {
    const data = await fs.readFile(SESSIONS_DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist yet, return empty array
      return [];
    }
    throw error;
  }
}

// Save session info
export async function saveSession(id, data) {
  await ensureDataDir();
  
  let sessions = [];
  try {
    const existingData = await fs.readFile(SESSIONS_DB_PATH, 'utf8');
    sessions = JSON.parse(existingData);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
    // File doesn't exist yet, continue with empty array
  }
  
  // Update or add session
  const existingIndex = sessions.findIndex(s => s.id === id);
  if (existingIndex >= 0) {
    sessions[existingIndex] = { ...sessions[existingIndex], ...data, id };
  } else {
    sessions.push({ id, ...data });
  }
  
  await fs.writeFile(SESSIONS_DB_PATH, JSON.stringify(sessions, null, 2));
  return { id, ...data };
}

// Delete session
export async function deleteSession(id) {
  await ensureDataDir();
  
  try {
    // Remove from sessions list
    const data = await fs.readFile(SESSIONS_DB_PATH, 'utf8');
    let sessions = JSON.parse(data);
    sessions = sessions.filter(s => s.id !== id);
    await fs.writeFile(SESSIONS_DB_PATH, JSON.stringify(sessions, null, 2));
    
    // Remove session files
    const sessionDir = path.join(SESSIONS_DIR, id);
    try {
      await fs.rm(sessionDir, { recursive: true, force: true });
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(`Failed to remove session directory: ${error.message}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to delete session: ${error.message}`);
    return false;
  }
}
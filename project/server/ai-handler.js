import axios from 'axios';
import { saveMessage, getMessages, saveConversation, getStats } from './data-handler.js';

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'REPLACE_WITH_YOUR_API_KEY';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Process a message with AI through OpenRouter
 */
export async function handleMessage(message, sender) {
  try {
    // Get conversation history
    const history = await getMessages(sender);
    
    // Save user message
    await saveMessage({
      conversationId: sender,
      role: 'user',
      content: message
    });
    
    // Update conversation
    await saveConversation({
      id: sender,
      lastActivity: new Date().toISOString()
    });
    
    // Prepare messages array for API request
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful customer service assistant. Be polite, concise, and helpful. If you don\'t know something, acknowledge it and offer to connect the customer with a human agent.'
      },
      ...history.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];
    
    // Call OpenRouter API
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'openai/gpt-4-turbo',
        messages: messages
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://your-app-domain.com',
          'X-Title': 'CS AI Assistant'
        }
      }
    );
    
    const aiResponse = response.data.choices[0].message.content;
    
    // Save AI response
    await saveMessage({
      conversationId: sender,
      role: 'assistant',
      content: aiResponse
    });
    
    return {
      text: aiResponse,
      model: response.data.model,
      processed: true
    };
  } catch (error) {
    console.error('Error processing message with AI:', error);
    
    return {
      text: "I'm having trouble processing your request right now. A human agent will assist you shortly.",
      processed: false,
      error: error.message
    };
  }
}

/**
 * Get conversation statistics
 */
export async function getConversationStats() {
  return await getStats();
}

/**
 * Get all active conversations
 */
export async function getActiveConversations() {
  const conversations = await getMessages();
  return conversations.sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
}

/**
 * Get conversation history for a specific sender
 */
export async function getConversationHistory(sender) {
  return await getMessages(sender);
}
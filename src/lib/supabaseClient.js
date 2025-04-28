import { createClient } from '@supabase/supabase-js';


const supabaseUrl="https://gewbkfuafhqyxpkydayb.supabase.co"
const supabaseAnonKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdld2JrZnVhZmhxeXhwa3lkYXliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3ODUyNjAsImV4cCI6MjA2MTM2MTI2MH0.jBTU40c5Qff4erxW6ixev8KyZvAjIgNMJ1DM0DIZoNE"
        
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Chat room functions
export const getChatRooms = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('messaging.chat_rooms')
      .select('*')
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    return { data: null, error };
  }
};

// Chat message functions
export const sendMessage = async ({ roomId, senderId, content, attachmentUrl = null, attachmentType = null }) => {
  try {
    const { data, error } = await supabase
      .from('messaging.chat_messages')
      .insert([
        {
          room_id: roomId,
          sender_id: senderId,
          content,
          attachment_url: attachmentUrl,
          attachment_type: attachmentType,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error sending message:', error);
    return { data: null, error };
  }
};

export const getChatHistory = async (roomId, page = 0, pageSize = 20) => {
  try {
    const { data, error } = await supabase
      .from('messaging.chat_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return { data: null, error };
  }
};

// Real-time subscription setup
export const subscribeToMessages = (roomId, callback) => {
  const subscription = supabase
    .channel(`room-${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'messaging',
        table: 'chat_messages',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => callback(payload.new)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

// Mark message as delivered
export const markMessageDelivered = async (messageId) => {
  try {
    await fetch(`/api/chat/messages/${messageId}/delivered`, { method: 'POST' });
  } catch (error) {
    console.error('Error marking message delivered:', error);
  }
};

// Mark message as read
export const markMessageRead = async (messageId) => {
  try {
    await fetch(`/api/chat/messages/${messageId}/read`, { method: 'POST' });
  } catch (error) {
    console.error('Error marking message read:', error);
  }
};

// Send typing status
export const sendTypingStatus = async (roomId, userId, typing) => {
  try {
    await fetch(`/api/chat/rooms/${roomId}/typing?userId=${userId}&typing=${typing}`, { method: 'POST' });
  } catch (error) {
    console.error('Error sending typing status:', error);
  }
};

// Get user presence
export const getUserPresence = async (userId) => {
  try {
    const res = await fetch(`/api/chat/presence/${userId}`);
    if (!res.ok) return { online: false };
    return await res.json();
  } catch (error) {
    return { online: false };
  }
};

// Types (for TypeScript projects)
/**
 * @typedef {Object} ChatRoom
 * @property {number} id
 * @property {string} type
 * @property {string} participant1_id
 * @property {string} participant2_id
 * @property {boolean} active
 * @property {string} created_at
 * @property {string} [closed_at]
 */

/**
 * @typedef {Object} ChatMessage
 * @property {number} id
 * @property {number} room_id
 * @property {string} sender_id
 * @property {string} content
 * @property {string} [attachment_url]
 * @property {string} [attachment_type]
 * @property {string} created_at
 * @property {boolean} read
 */

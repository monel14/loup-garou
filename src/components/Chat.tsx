import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, push } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle, Send } from 'lucide-react';

interface ChatProps {
  gameId: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
}

const Chat: React.FC<ChatProps> = ({ gameId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const chatRef = ref(database, `chats/${gameId}`);
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([id, message]) => ({
          id,
          ...(message as Omit<Message, 'id'>),
        }));
        setMessages(messageList.sort((a, b) => a.timestamp - b.timestamp));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [gameId]);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;
    const chatRef = ref(database, `chats/${gameId}`);
    push(chatRef, {
      sender: currentUser?.uid,
      content: newMessage,
      timestamp: Date.now(),
    });
    setNewMessage('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <MessageCircle className="mr-2" /> Chat
      </h2>
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div key={message.id} className="mb-2">
            <span className="font-semibold">{message.sender}: </span>
            <span>{message.content}</span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 py-2 rounded-r hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
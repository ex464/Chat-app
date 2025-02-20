import { useState, useEffect } from 'react';
import axios from 'axios';

function ChatRoom({ socket, username }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load previous messages
    axios.get('http://localhost:5000/api/messages')
      .then(res => setMessages(res.data));

    // Socket event listeners
    socket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('user_joined', (msg) => {
      setMessages(prev => [...prev, { content: msg, system: true }]);
    });

    socket.on('user_left', (msg) => {
      setMessages(prev => [...prev, { content: msg, system: true }]);
    });

    return () => {
      socket.off('receive_message');
      socket.off('user_joined');
      socket.off('user_left');
    };
  }, [socket]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('send_message', message);
      await axios.post('http://localhost:5000/api/messages', {
        sender: username,
        content: message
      });
      setMessage('');
    }
  };

  return (
    <div className="chat-room">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.system ? 'system' : ''} ${
              msg.sender === username ? 'own' : ''
            }`}
          >
            {!msg.system && <span className="sender">{msg.sender}: </span>}
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatRoom;



import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ChatRoom from './components/ChatRoom';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('join', username);
      setIsConnected(true);
    }
  };

  return (
    <div className="app">
      {!isConnected ? (
        <div className="join-container">
          <h1>Chat App</h1>
          <form onSubmit={handleJoin}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
            <button type="submit">Join Chat</button>
          </form>
        </div>
      ) : (
        <ChatRoom socket={socket} username={username} />
      )}
    </div>
  );
}

export default App;
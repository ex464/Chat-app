module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log('New user connected');
  
      socket.on('join', (username) => {
        socket.username = username;
        io.emit('user_joined', `${username} joined the chat`);
      });
  
      socket.on('send_message', (message) => {
        io.emit('receive_message', {
          sender: socket.username,
          content: message,
          timestamp: new Date()
        });
      });
  
      socket.on('disconnect', () => {
        if (socket.username) {
          io.emit('user_left', `${socket.username} left the chat`);
        }
      });
    });
  };
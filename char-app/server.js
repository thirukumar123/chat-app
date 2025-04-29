const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

mongoose.connect('mongodb://localhost:27017/chatDB', { useNewUrlParser: true, useUnifiedTopology: true });
const Message = mongoose.model('Message', new mongoose.Schema({ user: String, text: String, time: String }));

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  Message.find().limit(100).then(messages => {
    messages.forEach(msg => socket.emit('chat message', msg));
  });

  socket.on('chat message', (msg) => {
    const message = new Message(msg);
    message.save();
    io.emit('chat message', msg);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

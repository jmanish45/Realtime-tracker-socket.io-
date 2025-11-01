const express = require('express');
const app = express();
const path = require('path');
const http = require('http');

const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  socket.on('sendLocation', (data) => {
    io.emit("Location-recived", {id: socket.id, ...data});
  });
      
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    io.emit("user-disconnected", socket.id);
  });
});


app.get('/', function(req, res) {
  console.log('Rendering index.ejs');
  res.render('index');
});



server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

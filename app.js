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
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/', function(req, res) {
  console.log('Rendering index.ejs');
  res.render('index');
});



server.listen(3000);

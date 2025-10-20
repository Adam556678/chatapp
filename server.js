const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const io = socketio(server);

// Run when cline connect (Listen on connection event)
io.on('connection', (socket) => {
    console.log("New WebSocket connection...");

    socket.emit('message', formatMessage("ChatApp Bot", "Welcome to ChatApp"));

    // Broadcast when a user connects
    socket.broadcast.emit('message', formatMessage("ChatApp Bot", "A user has joined the chat"));

    // Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage("ChatApp Bot", "A user has left the chat"));
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        io.emit('message', formatMessage("User", msg));
    });
});

app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
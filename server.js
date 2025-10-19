const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);

// Run when cline connect (Listen on connection event)
io.on('connection', (socket) => {
    console.log("New WebSocket connection...");
});

app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
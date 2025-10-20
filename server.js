const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const io = socketio(server);

const {
    userJoin, 
    getCurrentUser,
    userLeave,
    getRoomUsers} = require("./utils/users.js");

// Run when cline connect (Listen on connection event)
io.on('connection', (socket) => {
    console.log("New WebSocket connection...");

    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(room);

        socket.emit('message', formatMessage("ChatApp Bot", "Welcome to ChatApp"));
    
        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage("ChatApp Bot", `${username} has joined the chat`));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });
    
    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
    
    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        
        if (user){
            io.to(user.room).emit('message', formatMessage("ChatApp Bot", `${user.username} has left the chat`));

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });

});

app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
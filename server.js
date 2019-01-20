const express = require('express');
const socket = require('socket.io');

var connections = [];
var users = [];

const app = express();
const server = app.listen(3000, function(){
    console.log("Server running...");
});

app.use(express.static('public'));

const io = socket(server);

io.on('connection', function(socket){
    connections.push(socket);
    
    socket.on('disconnect', function(data){
        if(socket.username){
            io.sockets.emit('log', socket.username+" has left the chat!");
        }
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        
    });
    
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        io.sockets.emit('log', socket.username+" has joined the chat!");
        updateUsernames();
    });
    
    socket.on('chat', function(data){
        io.sockets.emit('chat', data);
    });
    
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });
    
    function updateUsernames(){
        io.sockets.emit('get users', users);
    }
    
});

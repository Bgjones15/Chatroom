const express = require('express');
const socket = require('socket.io');
const helmet = require('helmet');

var sanitizeHtml = require('sanitize-html');

var connections = [];
var users = [];

const app = express();
app.use(helmet());
app.use(express.static("public"));

const server = app.listen(3000, function(){
    console.log("Server running...");
});

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
        let username = sanitizeHtml(data);
        if(username){
            callback(true);
            socket.username = username;
            users.push(socket.username);
            io.sockets.emit('log', socket.username+" has joined the chat!");
            updateUsernames();
        }
    });
    
    socket.on('chat', function(data){
        data.name = sanitizeHtml(data.name);
        data.message = sanitizeHtml(data.message);
        io.sockets.emit('chat', data);
    });
    
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', sanitizeHtml(data));
    });
    
    function updateUsernames(){
        io.sockets.emit('get users', users);
    }
    
});

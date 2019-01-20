const socket = io.connect("http://localhost:3000");
$(document).ready(function(){
    var message = $('#message'),
    btn = $('#send'),
    output = $('#output'),
    feedback = $('#feedback');
    
    $('#message').keypress(function(){
        socket.emit('typing', socket.username);
    });
    
    $('#sendMessage').submit(function(e){
        e.preventDefault();
        socket.emit('chat', {
            message: message.val(),
            name: socket.username
        });
        $('#message').val('');
    });
    
    $('#userForm').submit(function(e){
        e.preventDefault();
        socket.emit('new user', $('#username').val(), function(data){
            if(data){
                $('#userForm').hide();
                $('#chat').show();
                $('#output').empty();
            }
        });
        socket.username = $('#username').val();
        $('#username').val('');
    });
    
    socket.on('chat', function(data){
        $('#feedback').empty();
        //<img src='/w3images/bandmember.jpg' alt='Avatar'>
        //<img src="/w3images/avatar_g2.jpg" alt="Avatar" class="right">
        if(data.name == socket.username){
            $('#output').append("<div class='container darker'><strong>"+data.name+"</strong><p>"+data.message+"</p> <span class='time-left'>11:00</span </div>");
        }
        else{
            $('#output').append("<div class='container'><strong>"+data.name+"</strong><p>"+data.message+"</p> <span class='time-right'>11:00</span </div>");
        }
        $('#chat-window').scrollTop($('#chat-window')[0].scrollHeight);
    });
    
    socket.on('log', function(data){
        $('#output').append("<p>"+data+"</p>");
    })
    
    var timer = null;
    var duration = 2000;
    
    socket.on('typing', function(data){
        $('#feedback').html("<p><em>"+data+" is typing a message...</em></p>");
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(clearTyper, duration);
    });
    
    socket.on('get users', function(data){
        var html = '';
        for(i = 0; i< data.length; i++){
            html += "<li>"+data[i]+"</li>";
        }
        $('#userList').html(html);
    });
    
});

function clearTyper(){
    $('#feedback').empty()
}
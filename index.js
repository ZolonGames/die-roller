var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;
const MAXMESSAGES = 25;
var recentMessages = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket){
    console.log('New Connection Detected');
    io.emit('post rolls', recentMessages);
    socket.on('disconnect', function(){
        console.log('User Disconnected');
    });
    socket.on('new roll', function(rolldata){
        roll = dieroll(rolldata.die);
        message = {
            die     : rolldata.die,
            roll    : roll,
            bonus   : rolldata.bonus,
            result  : roll + parseInt(rolldata.bonus),
            name    : rolldata.name,
            color   : rolldata.color
        }
        recentMessages.unshift(message);
        if (recentMessages.length > MAXMESSAGES)
        {
            recentMessages.pop();
        }
        socket.emit('post rolls', recentMessages);
    });
});

function dieroll(die)
{
    return Math.floor((Math.random() * die) + 1);
}

http.listen(PORT, function(){
    console.log("Dieroller Running on Port: " + PORT);
});
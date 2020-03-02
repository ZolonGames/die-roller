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
        total = dieroll(rolldata.die, rolldata.numDice);
        message = {
            die     : rolldata.die,
            numDice : rolldata.numDice,
            total   : total,
            bonus   : rolldata.bonus,
            result  : total + rolldata.bonus,
            name    : rolldata.name,
            color   : rolldata.color
        }
        recentMessages.unshift(message);
        if (recentMessages.length > MAXMESSAGES)
        {
            recentMessages.pop();
        }
        io.emit('post rolls', recentMessages);
    });
});

dieroll = (die, numDice) =>
{
    let total = 0;
    for (let i = 0; i < numDice; i++)
    {
        total += Math.floor((Math.random() * die) + 1);
    }
    return total;
}

http.listen(PORT, function(){
    console.log("Dieroller Running on Port: " + PORT);
});
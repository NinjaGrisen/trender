var express = require("express");
var socket = require("socket.io");

var app = express();
var server = app.listen(3000);

var io = socket(server);

io.sockets.on("connection", startConnection);

function startConnection(socket) {
    console.log(socket.id);
 
    socket.on('mouse', function(data) {
        socket.broadcast.emit('mouse', data);
        console.log(data);
    });
}

app.use(express.static('public'));

app
.get("/", (req, res) => {
    res.send("hello world");
});
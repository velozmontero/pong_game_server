var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 9000;

// ALLOW CROSS ORIGIN COMUNICATION WITH THE SERVER =============================
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

app.get('/', function(req, res){
  res.send('<h1>Server For Pong Game</h1>');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('connected','conection established');

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});

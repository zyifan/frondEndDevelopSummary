var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var opn = require('opn');

app.use(express.static(__dirname))

// app.get('/', function(req, res){
//   res.sendFile(path.join(__dirname, 'index.html'));
// });
// 
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/',function(req,res){
   // res.send('chat');
  res.sendFile(path.join(__dirname, 'chat.html'))
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
    
  socket.on('chat message', function(msg){
    console.log('message: ' + msg.msg);

    io.emit('chat message', msg);
  });

});

app.set('port', process.env.PORT || 3738);

var server = http.listen(app.get('port'), function() {
  console.log('start at port:' + server.address().port);
  opn('http://localhost:'+server.address().port);
});
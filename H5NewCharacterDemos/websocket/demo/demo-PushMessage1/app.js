var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var opn = require('opn');

app.use(express.static(__dirname))

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'getMessage.html'));
});

var users = {};
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('new user',function(data){
    if(data in users){
        
    }else{
       var nickname = data;
       users[nickname]= socket;
    }
    console.log('users...');
    console.info(nickname);
 });

  socket.on('disconnect', function(){
    console.log('user disconnected');    
  });
  
  var i=0;   
  socket.on('poling',function(from,msg){
    i++;
    users[from].emit('msg','消息：'+i);
  })


});

var port = process.env.PORT || 3737 + Math.floor(Math.random()*20);
app.set('port', port++);

var server = http.listen(app.get('port'), function() {
  console.log('start at port:' + server.address().port);
  opn('http://localhost:'+port);
});
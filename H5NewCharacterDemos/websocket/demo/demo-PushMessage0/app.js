var express = require('express');  
var app = express();  
var expressWs = require('express-ws')(app);  

var timer = null;
app.ws('/ws', function(ws, req) {    
  
  ws.on('message', function(msg) {  
    console.log('_message');  
    console.log(msg);  
    i=0;
    timer = setInterval(function(){
      
      if(ws){
        i++;
        ws.send('echo:' + msg+i); 
      }else{
        i=0;
        clearInterval(timer);
        console.log('connect close');
      }
      
    },1000)
    // ws.send('echo:' + msg);  

  });  


})  

app.listen(3222,function(){
  console.log('app listeing at 3222...');
});  
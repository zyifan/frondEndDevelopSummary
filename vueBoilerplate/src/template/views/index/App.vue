<template>
  <div id="app">
    <img src="/assets/images/logo1.png">
    <img :src="img">
    <router-view/>
    <div class="box">
    </div>
    <h1>1111</h1>
    <div>
      <h1 v-if="data.name">{{data.name}}</h1>
      <h1 v-if="data.age">{{data.age}}</h1>
    </div>
  </div>
  
  
</template>

<script>
import Util from '@assets/js/util.js'
export default {
  name: 'app',
  data (){
    return {
      img: '/assets/images/logo1.png',
      data: {},
      socket: null
    }
  },
  created () {
    this.getData();
    Util.session('name', false);
  },
  methods: {
    websocket () {
      if ("WebSocket" in window)
            {
               alert("您的浏览器支持 WebSocket!");
               
               // 打开一个 web socket
               this.socket = new WebSocket("ws:http://192.168.4.130:8088");
                
               this.socket.onopen = function()
               {
                 alert('打开链接')
                  // Web Socket 已连接上，使用 send() 方法发送数据
                  this.socket.send("发送数据");
                  alert("数据发送中...");
               };
                
               this.socket.onmessage = function (evt) 
               { 
                  var received_msg = evt.data;
                  alert("数据已接收...");
               };
              this.socket.onerror = function(error) {
                console.log(error);
              }
               this.socket.onclose = function()
               { 
                  // 关闭 websocket
                  alert("连接已关闭..."); 
               };
            }
            
            else
            {
               // 浏览器不支持 WebSocket
               alert("您的浏览器不支持 WebSocket!");
            }
    },
    getData () {
      let obj = {
        name: '12212',
        age: 30
      }
      // Util.post({
      //   url:'',
      //   data:{},
      //   method:'post',
      //   success:(res)=>{
      //     console.log(res)
      //   },
      //   error:(res)=>{
      //     console.log(res)
      //   }, 
      // })
      this.data = Object.assign(this.data, obj);
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.box {
  background: url(/assets/images/logo1.png) no-repeat;
  width: 500px;
  height: 200px;
}
</style>

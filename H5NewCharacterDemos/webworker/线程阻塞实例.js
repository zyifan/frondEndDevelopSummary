
//示例一
console.log('start');

var t = true;

//把此处换成 ajax 请求同样会被阻塞，不会执行
setTimeout(function(){ 
	t = false;
}, 1000);
// 解析：JavaScript引擎是单线程的，事件触发排队等候。所有任务按照触发时间先后排队处理。 

while(t){ }//死循环，进程被堵塞

console.log('end');

//| var t=true ; | while(t){}; | alert(‘end’); |


//实例二
/*
setTimeout(function () {
	 while (true) {
	 	//死循环，被阻塞
	 } 
}, 1000);

setTimeout(function () { alert('end 2'); }, 2000);
setTimeout(function () { alert('end 1'); }, 100);
alert('end');

//运行这段代码。运行结果是alert(‘end’) alert(‘end 1’)。*/

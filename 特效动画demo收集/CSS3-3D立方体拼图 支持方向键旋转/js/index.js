var log = console.log.bind(console);

var imgPath = 'selfie-monkey.jpg';

var cubetwo = new window.CubeTwo({
  cubeComponent: document.getElementById('cubetwo-component-1'),
  backgroundImages: { /* optional */
    u: imgPath, // up
    d: imgPath, // down
    f: imgPath, // front
    b: imgPath, // back
    r: imgPath, // right
    l: imgPath, // left
  },
  backgroundColors: { /* optional */
    u: 'rgba(255, 255, 255, .7)', // 上 白
    f: 'rgba(0, 158, 96, .7)', // 前 绿
    r: 'rgba(196, 30, 58, .7)', // 右 红 
    l: 'rgba(255, 88, 0, .7)', // 左 橘黄
    b: 'rgba(0, 81, 186, .7)', // 后 蓝
    d: 'rgba(255, 213, 0, .7)', // 下 黄
    _: 'transparent',
  },
});

cubetwo.init();

window.addEventListener('keydown', cubetwo.handleGlobalKeyEvent, false);

window.cubetwo = cubetwo;

log('cubetwo is available in console');

// Custom
setTimeout(function() {

  cubetwo._setState(JSON.parse('{"codes":[{"cube":6,"code":"ru"},{"cube":5,"code":"lu"},{"cube":1,"code":"bu"},{"cube":2,"code":"bu"},{"cube":4,"code":"dl"},{"cube":3,"code":"dr"},{"cube":7,"code":"fr"},{"cube":8,"code":"fl"}],"isRotateEnabled":true}'));
  cubetwo._updateUiFaces();

}, 0);
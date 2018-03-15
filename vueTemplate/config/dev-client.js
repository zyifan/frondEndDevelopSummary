/* eslint-disable */
'use strict'
require('eventsource-polyfill') //支持w3c规范, 一个浏览器w3c eventsource的ployfill, 在不支持事件源的浏览器里添加填充策略支持,先检查浏览器是否支持某个api, 如果不支持就加载对应的polyfill
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')
//可以通过添加params，为client添加配置信息
/*
    path - The path which the middleware is serving the event stream on
    name - Bundle name, specifically for multi-compiler mode
    timeout - The time to wait after a disconnection before attempting to reconnect
    overlay - Set to false to disable the DOM-based client-side overlay.
    reload - Set to true to auto-reload the page when webpack gets stuck. 设置true则在webpack获取到模块时自动重加载
    noInfo - Set to true to disable informational console logging. 设置true则不打印日志
    quiet - Set to true to disable all console logging.
    dynamicPublicPath - Set to true to use webpack publicPath as prefix of path. (We can set __webpack_public_path__ dynamically at runtime in the entry point, see note of output.publicPath)
    autoConnect - Set to false to use to prevent a connection being automatically opened from the client to the webpack back-end - ideal if you need to modify the options using the setOptionsAndConnect function
*/

// 客户端收到更新动作，执行页面刷新
hotClient.subscribe(function(event) {
    if (event.action === 'reload') {
        window.location.reload()
    }
})
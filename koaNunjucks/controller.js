const fs = require('fs');

// 处理exprots对象中的 url请求
function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {//如果是get请求
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {//如果是post请求
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

// 读取目录中所有路由js文件
function addControllers(router,dir) {
    var files = fs.readdirSync(__dirname + '/'+dir);
    var js_files = files.filter((f) => {
        return f.endsWith('.js');
    });

    for (var f of js_files) {
        console.log(`process controller: ${f}...`);
        let mapping = require(__dirname + '/'+dir+'/' + f);
        addMapping(router, mapping);
    }
}

/** 
 * 输出获取到的routers对象
 * 
 * dir: 路由文件夹名称
 */
module.exports = function (dir) {
    let controllers_dir = dir || 'controllers', // 如果不传参数，扫描目录默认为'controllers'
        router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();
};
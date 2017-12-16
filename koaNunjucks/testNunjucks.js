// nunjucks测试 start……  可加入到app.js中测试
// nunjucks模板，语法参考：http://mozilla.github.io/nunjucks/cn/api.html
function createEnv(path, opts) {
    var autoescape = opts.autoescape === undefined ? true : opts.autoescape,//控制输出是否被转义
        noCache = opts.noCache || false,//false不使用缓存，每次都重新编译
        watch = opts.watch || false,//当模板变化时重新加载
        throwOnUndefined = opts.throwOnUndefined || false,//当输出为 null 或 undefined 会抛出异常

        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader('views', {//文件系统加载器，从views目录读取模板
                noCache: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            });

    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);//创建过滤器
        }
    }
    return env;
}

// 创建Nunjucks模板引擎对象
var env = createEnv('views', {
    watch: true,
    filters: {//16进制转换过滤器
        hex: function (n) {
            return '0x' + n.toString(16);
        }
    }
});

var s = env.render('hello.html', { name: '<script>alert("小明")</script>' });
console.log('hello.html*********************************************nunjucks');
console.log(s);

var frut = env.render('for.html', { fruits: ['apple','banana','grape']});
console.log('for.html*********************************************nunjucks');
console.log(frut);

var bas = env.render('base.html',{
    header:'<u>123</u>'
});
console.log('base.html*********************************************nunjucks');
console.log(bas);

var tem = env.render('extend.html',{
    header: 'Hello',
    body: 'bla bla bla...'
})
console.log('extend.html*********************************************nunjucks');
console.log(tem);

// nunjucks测试 end……
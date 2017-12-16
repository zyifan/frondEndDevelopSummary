// 给ctx对象绑定一个render(view, model)的方法，这样，后面的Controller就可以调用这个方法来渲染模板了
const nunjucks = require('nunjucks');

// nunjucks模板，语法参考：http://mozilla.github.io/nunjucks/cn/api.html
function createEnv(path, opts) {
    var autoescape = opts.autoescape === undefined ? true : opts.autoescape,//控制输出是否被转义
        noCache = opts.noCache || false,//false不使用缓存，每次都重新编译
        watch = opts.watch || false,//当模板变化时重新加载
        throwOnUndefined = opts.throwOnUndefined || false,//当输出为 null 或 undefined 会抛出异常
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path || 'views', {//文件系统加载器，从views目录读取模板
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

function templating(path, opts) {
    // 创建Nunjucks的env对象:
    var env = createEnv(path, opts);
    return async (ctx, next) => {
        // 给ctx绑定render函数:
        ctx.render = function (view, model) {
            // 把render后的内容赋值给response.body:
            //ctx.state || {}，这个目的是为了能把一些公共的变量放入ctx.state并传给View
            ctx.response.body = env.render(view, Object.assign({}, ctx.state || {}, model || {}));
            // 设置Content-Type:
            ctx.response.type = 'text/html';
        };
        // 继续处理请求:
        await next();
    };
}


/*
// 例如，某个middleware负责检查用户权限，它可以把当前用户放入ctx.state中：
app.use(async (ctx, next) => {
    var user = tryGetUserFromCookie(ctx.request);
    if (user) {
        ctx.state.user = user;
        await next();
    } else {
        ctx.response.status = 403;
    }
});
// 这样就没有必要在每个Controller的async函数中都把user变量放入model中。
*/

module.exports = templating;
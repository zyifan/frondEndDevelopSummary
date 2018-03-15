'use strict'
const HtmlWebpackPlugin = require('html-webpack-plugin')  // 自动生成 html 并且注入到 .html 文件中的插件 // https://github.com/ampedandwired/html-webpack-plugin
const webpack = require('webpack')
const merge = require('webpack-merge') // webpack 配置合并插件
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')// webpack错误信息提示插件 // https://github.com/geowarin/friendly-errors-webpack-plugin
const path = require('path')
const net = require('net')
const os = require('os')

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse('"development"')
}

const opn = require('opn') //强制打开浏览器
const express = require('express')
const proxyMiddleware = require('http-proxy-middleware') //使用代理的中间件


module.exports = function(root) {

    // 获取传过了的目录名字
    if (!root[1]) {
        root[1] = '*';
    }

    // 获取基础配置
    const baseWebpackConfig = require('./base')(root)

    // 将'C:\\xampp\\htdocs\\webpackModule\\config\\dev-client'添加到每一个entry数组中
    // 给每个入口页面(应用)加上dev-client，用于跟dev-server的热重载插件通信，实现热更新
    Object.keys(baseWebpackConfig.entry).forEach(function(name) {
        baseWebpackConfig.entry[name] = [path.join(__dirname, 'dev-client')].concat(baseWebpackConfig.entry[name])
    })


    const webpackConfig = merge(baseWebpackConfig, {
        module: {
            //通过传入一些配置来获取rules配置，此处传入了sourceMap: false,表示不生成sourceMap
            rules: [{
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    "options": {
                        "loaders": {
                            "postcss": [
                                "vue-style-loader",
                                {
                                    "loader": "css-loader",
                                    "options": {
                                        "minimize": false,
                                        "sourceMap": false
                                    }
                                }
                            ],
                            "css": [
                                "vue-style-loader",
                                {
                                    "loader": "css-loader",
                                    "options": {
                                        "minimize": false,
                                        "sourceMap": false
                                    }
                                }
                            ],
                            "less": [
                                "vue-style-loader",
                                {
                                    "loader": "css-loader",
                                    "options": {
                                        "minimize": false,
                                        "sourceMap": false
                                    }
                                },
                                {
                                    "loader": "less-loader",
                                    "options": {
                                        "sourceMap": false
                                    }
                                }
                            ],
                            "scss": [
                                "vue-style-loader",
                                {
                                    "loader": "css-loader",
                                    "options": {
                                        "minimize": false,
                                        "sourceMap": false
                                    }
                                },
                                {
                                    "loader": "sass-loader",
                                    "options": {
                                        "sourceMap": false
                                    }
                                }
                            ],
                            "sass": [
                                "vue-style-loader",
                                {
                                    "loader": "css-loader",
                                    "options": {
                                        "mindentedSyntax": true,
                                        "sourceMap": false
                                    }
                                },
                                {
                                    "loader": "sass-loader",
                                    "options": {
                                        "sourceMap": false
                                    }
                                }
                            ],
                            "stylus": [
                                "vue-style-loader",
                                {
                                    "loader": "css-loader",
                                    "options": {
                                        "minimize": false,
                                        "sourceMap": false
                                    }
                                },
                                {
                                    "loader": "stylus-loader",
                                    "options": {
                                        "sourceMap": false
                                    }
                                }
                            ],
                            "styl": [
                                "vue-style-loader",
                                {
                                    "loader": "css-loader",
                                    "options": {
                                        "minimize": false,
                                        "sourceMap": false
                                    }
                                },
                                {
                                    "loader": "stylus-loader",
                                    "options": {
                                        "sourceMap": false
                                    }
                                }
                            ]
                        },
                        "transformToRequire": {//把图片提前 require 传给一个变量再传给组件
                            "video": "src",//video标签名：src标签属性
                            "source": "src",
                            "img": "src",
                            "image": "xlink:href"
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: ['vue-style-loader',
                        {
                            loader: 'css-loader',
                            options: { minimize: false, sourceMap: false }
                        }
                    ]
                },
                {
                    test: /\.postcss$/,
                    use: ['vue-style-loader',
                        {
                            loader: 'css-loader',
                            options: { minimize: false, sourceMap: false }
                        }
                    ],

                },
                {
                    test: /\.less$/,
                    use: ['vue-style-loader',
                        {
                            loader: 'css-loader',
                            options: { minimize: false, sourceMap: false }
                        },
                        { loader: 'less-loader', options: { sourceMap: false } }
                    ],
                },
                {
                    test: /\.sass$/,
                    use: ['vue-style-loader',
                        {
                            loader: 'css-loader',
                            options: { minimize: false, sourceMap: false }
                        },
                        {
                            loader: 'sass-loader',
                            options: { indentedSyntax: true, sourceMap: false }
                        }
                    ],
                },
                {
                    test: /\.scss$/,
                    use: ['vue-style-loader',
                        {
                            loader: 'css-loader',
                            options: { minimize: false, sourceMap: false }
                        },
                        { loader: 'sass-loader', options: { sourceMap: false } }
                    ],
                },
                {
                    test: /\.stylus$/,
                    use: ['vue-style-loader',
                        {
                            loader: 'css-loader',
                            options: { minimize: false, sourceMap: false }
                        },
                        { loader: 'stylus-loader', options: { sourceMap: false } }
                    ],

                },
                {
                    test: /\.styl$/,
                    use: ['vue-style-loader',
                        {
                            loader: 'css-loader',
                            options: { minimize: false, sourceMap: false }
                        },
                        { loader: 'stylus-loader', options: { sourceMap: false } }
                    ],
                }
            ]
        },

        devtool: '#cheap-module-eval-source-map',//包含loader中的sourcemap，生成map和eval

        plugins: [
            //  声明全局变量
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"development"'
                }
            }),

            // 热更新模块
            new webpack.HotModuleReplacementPlugin(),

            // webpack 进程遇到错误代码将不会退出
            new webpack.NoEmitOnErrorsPlugin(),

            // }),
            // 识别某些类别的webpack错误并进行清理，聚合和优先排序，以提供更好的开发者体验。
            new FriendlyErrorsPlugin(),
        ]
    })

    /* webpack-dev-middleware和webpack-hot-middleware分别是干什么的？
　　  首先这两个插件组合起来是可以实现页面的热刷新工作， 而做到这一点，首先要对更改的文件进行监控，编译，而这个webpack-dev-middleware就是干这个的，专业点叫做伺服器，
     而webpack-hot-middleware 是用来进行页面的热重载的。而且这些文件资源并不会出现在真实的路径里，而是保存在内存中，如果文件改变，这个伺服器就不在去请求旧的文件，而是延迟请求直到新的文件编译完成。 */

    let port = 8080 //端口号
    const autoOpenBrowser = true //是否自动打开浏览器
    const proxyTable = {} //http的代理url
    const app = express() //启动express


    /*complier = webpack(webpackConfig)会创建一个用来传给webpack-middle-ware的对象，
    同时我们还可以给他webpack-middle-ware传一些option,比较重要的是这个publicPath, 这个是必传的参数，通常是和你的webpack.config.js里的publicPath是一致的 */
    const compiler = webpack(webpackConfig) //webpack编


        //1.将编译后的生成的静态文件放在内存中,所以在npm run dev后磁盘上不会生成文件
        //2.当文件改变时,会自动编译。
        //3.当在编译过程中请求某个资源时，webpack-dev-server不会让这个请求失败，而是会一直阻塞它，直到webpack编译完毕
    const devMiddleware = require('webpack-dev-middleware')(compiler, {
            publicPath: webpackConfig.output.publicPath,
            quiet: true, // 设置为true，使其不要在控制台输出日志
            stats: {
                colors: true
            },// options for formating the statistics
            reporter: null,
            serverSideRender: false, // Turn off the server-side rendering mode. See Server-Side Rendering part for more info.
        })
        //webpack-hot-middleware的作用就是实现浏览器的无刷新更新
    const hotMiddleware = require('webpack-hot-middleware')(compiler, { //hotMiddleware配置也可以通过options传递
            log: false,// 关闭控制台的日志输出
            heartbeat: 2000// 发送心跳包的频率How often to send heartbeat updates to the client to keep the connection alive.
            // path:'', // The path which the middleware will serve the event stream on, must match the client setting(client配置见 dev-client.js 文件)
        })
        //声明hotMiddleware无刷新更新的时机:html-webpack-plugin 的template更改之后
        // compiler.plugin('compilation', function(compilation) {
        //     compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
        //         hotMiddleware.publish({ action: 'reload' }) // 关闭可实现vue文件热重载.
        //         cb()
        //     })
        // })

    // 应用hotMiddleware中间件
    app.use(hotMiddleware)

    //将代理请求的配置应用到express服务上
    Object.keys(proxyTable).forEach(function(context) {
        console.log('proxyTable');
        let options = proxyTable[context]
        if (typeof options === 'string') {
            options = { target: options }
        }
        app.use(proxyMiddleware(options.filter || context, options))
    })

    /*                      context                 options
                               |                       |
        var apiProxy = proxy('/api', {target: 'http://www.example.org'});
        context：确定应将哪些请求代理到目标主机。 （更多关于上下文匹配）
        options.target：目标主机到代理。 （协议+主机）*/

        // (1)路径匹配 
        // proxy({...}) - 匹配任意路径，所有的请求都会被代理。
        // proxy('/', {...})-匹配任意路径，所有的请求都会被代理。
        // proxy('/api', {...})-匹配所有以/api开始的路径。

        // (2)多重路径匹配 
        // proxy(['/api', '/ajax', '/someotherpath'], {...})

        // (3)通配符路径匹配 
        // 对于细粒度控制，您可以使用通配符匹配。通过micromatch进行全局模式匹配。访问micromatch或glob更多globbing示例。
        // proxy('**', {...}) 匹配任意路径，所有的请求都会被代理。
        // proxy('**/*.html', {...}) 匹配所有以.html结尾的任意路径。
        // proxy('/*.html', {...}) 直接匹配绝对路径下的路径。
        // proxy('/api/**/*.html', {...})匹配在/api路径下以.html结尾的请求。
        // proxy(['/api/**', '/ajax/**'], {...})组合多重路由模式。
        // proxy(['/api/**', '!**/bad.json'], {...})排除匹配。

        // (4)自定义匹配 
        // 为了完全控制，您可以提供一个自定义函数来确定哪些请求应该被代理。
        // var filter = function (pathname, req) {
        //     return (pathname.match('^/api') && req.method === 'GET');
        // };
        
        // var apiProxy = proxy(filter, {target: 'http://www.example.org'})
    

    //使用connect-history-api-fallback匹配资源
    //如果不匹配就可以重定向到指定地址
    app.use(require('connect-history-api-fallback')())

    // 应用devMiddleware中间件
    app.use(devMiddleware)

    // 配置express静态资源目录
    const staticPath = path.posix.join('/', 'assets') //两个奇葩属性，path.posix 和 path.win32 他们都包含path的方法属性，前者跨平台，后者只是win上
    app.use(staticPath, express.static('./assets'))

    const uri = 'http://localhost:' + port

    var _resolve
    var _reject
    var readyPromise = new Promise((resolve, reject) => {
        _resolve = resolve
        _reject = reject
    })

    var server
    var portfinder = require('portfinder')
    portfinder.basePort = port

        // console.log(compiler);
    console.log('> Starting dev server...')

        //编译成功后打印uri
    devMiddleware.waitUntilValid(() => {
        portfinder.getPort((err, port) => {
            if (err) {
                _reject(err)
            }
            process.env.PORT = port
                //启动express服务
            portIsOccupied(port, portIsOccupied)
        })
    })
    /*
        devMiddleware.close() 停止监听文件变化
        devMiddleware.invalidate() 重新编译bundle文件，例如，更改配置文件之后
        devMiddleware.waitUntilValid(function(){
            console.log('Package is in a valid state');
        }) //编译成功bundle合法之后执行这个方法的回调
    */

    var appServer;
    // 监听端口是否被占用
    function portIsOccupied(port, cb) {
        // 创建服务并监听该端口
        var server1 = net.createServer().listen(port)

        server1.on('listening', function() { // 执行这块代码说明端口未被占用
            server1.close() // 关闭服务
            server = app.listen(port, function(err) {
                    if (err) {
                        // console.log(err)
                        return;
                    }
                    let IP = getIP()
                    let moduleName;
                    if (root[1] === '*') {
                        moduleName = 'index';
                    } else {
                        moduleName = root[1];
                    }
                    var uri = IP + port + '/' + moduleName + '/' + moduleName + '.html';
                    console.log('Project running at ' + IP + port + '\n')
                        // opn(uri)
                        // 满足条件则自动打开浏览器
                    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
                        opn(uri)
                    }
                    console.log('server-------------------end')
                        // server = app.listen(port)
                    _resolve()
                })
                // console.log('The port【' + port + '】 is available.') // 控制台输出信息
        })

        server1.on('error', function(err) {
            cb(++port, cb);
        })
    }
    //  获取IP地址函数
    function getIP() {
        var ifaces = os.networkInterfaces();
        for (var i in ifaces) {
            if (!ifaces[i].length) {
                continue;
            }
            let ips = ifaces[i];
            for (var i = 0; i < ips.length; i++) {
                if (ips[i].family != 'IPv4') continue;
                if (ips[i].address === '127.0.0.1') continue;
                return 'http:\/\/' + ips[i].address + ':';
            }
        }
    }
    return {
        ready: readyPromise,
        close: () => {
            server.close()
        }
    }

}
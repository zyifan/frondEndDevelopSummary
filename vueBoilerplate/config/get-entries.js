const glob = require('glob')//node的glob模块允许你使用 *等符号, 来写一个glob规则,像在shell里一样,获取匹配对应规则的文件
const path = require('path')


//  获取入口文件js或者 模板html文件
module.exports = function(root, name) {
    let entries = {},
        basename;
    name = name || 'js';

    root.forEach((item, index) => {
        if (!index) return;
        let path1 = path.join(__dirname, '..', 'src/' + root[0] + '/views/' + item + '/*.' + name); //获取src/template/views目录下所有的html和js文件

        glob.sync(path1).forEach(entry => {
            //path.basename(path,[ext]), path:要处理的path,ext: 要过滤的字符,path.basename('/foo/bar/baz/asdf/quux.html', '.html') == 'quux'
            //path.extname()返回path路径文件扩展名,path.extname('index.html') == '.html'
            basename = path.basename(entry, path.extname(entry)); //获取查找的的文件名
            entries[basename] = entry; //设置config的entry
        })
    })

    return entries;
}
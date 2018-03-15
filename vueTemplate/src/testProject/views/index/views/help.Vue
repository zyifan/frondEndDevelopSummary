<template>
  <div class="helpManager">
    <div class="card" v-for="item,index in helpData" :key="index">
        <h1 v-text="item.h1"></h1>
        <div class="subHelp" v-if="item.subList.length>0" v-for="sub,key in item.subList" :key="key">
            <h2 v-text="sub.h2"></h2>
            <ul v-if="sub.list.length>0">
              <li v-for="sitem,ind in sub.list" :key="ind" v-text="sitem"></li>
            </ul>
        </div>
      
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      helpData:[
        {
          h1:'http基本知识',
          subList:[
            {
              h2:'常用标准请求方式',
              list:[
                'get 用于获取数据,一般路由器或运营商会做优化，请求不一定会到达服务器',
                'post 用于提交数据',
                'put 用于更改数据',
                'delete 用于删除数据'
              ]
            },
            {
              h2:'常用响应代码',
              list:[
                '200:成功',
                '404:未找到页面',
                '4xx:客户端错误',
                '5xx:服务端错误'
              ]
            },
            {
              h2:'http请求',
              list:[
                'url:服务地址',
                'request.headers:http请求头',
                'request.body:http请求内容(post,put,delete)'
              ]
            },
            {
              h2:'http相应',
              list:[
                'response.statusCode:响应代码',
                'response.headers:响应头',
                'response.body:服务端返回的内容'
              ]
            },
          ],         
        },
        {
          h1:'json基本知识',
          subList:[
            {
              h2:'json数据类型',
              list:[
                'object:对象，可以包含子节点(:{})',
                'array:数组(:[])',
                'string:字符串(:"xxx")',
                'number:数字类型(:0)',
                'boolean:布尔类型(:true)',
                'null:空值(:null)',
                'http://www.ietf.org/rfc/rfc4627.txt'
              ]
            },          
          ],         
        },
        {
          h1:'用例管理',
          subList:[
            {
              h2:'名称:应用名称',
              list:[
                '描述:应用描述信息',
                'headers:应用的公共http请求头,比如应用id可以放在这里',
                'params:应用的公共参数'
              ]
            },    
            {
              h2:'版本信息',
              list:[
                '名称:版本名称',
                '描述:版本描述信息',
                '加密方案:对请求数据的加密方案',
                '解密方案:对响应数据的解密方案',
                'headers:版本的公共http请求头，比如版本号可以放在这里',
                'params:版本的公共参数',
                '复制版本:客户端每增加一个版本就可以在上个版本的基础上复制一份，然后再做增删改'
              ]
            },   
            {
              h2:'接口信息',
              list:[
                '名称:接口名称,建议用英文，可以通过此参数找到其他接口返回的数据，ctx.cache.[interface_name].[case_name]',
                '描述:接口描述信息',
                'url:接口的地址，可以填写相对地址，在环境信息里可以通过脚本和hosts动态修改',
                '方法:请求方法(get or post)，现在跑腿的服务基本都是post请求',
                '平台:默认支持此应用的所有平台，如果某些接口只支持部分平台，可以在这里设置',
                'headers:接口的http请求头',
                'params:接口的请求数据,现在跑腿数据格式为:Data=xxxx,xxx,xxx,xxx，可以设置为{"Data":["","","",""]}',
                '接口排序：可以通过拖拽实现对接口顺序的调整，调整过后记得保存(自动化测试时按照此顺序测试)'
              ]
            },    
            {
              h2:'用例信息',
              list:[
                '名称:用例名称,建议用英文，可以通过此参数找到其他接口返回的数据，ctx.cache.[interface_name].[case_name]',
                '描述:用例描述信息',
                'headers:用例的http请求头',
                'params:用例的请求数据,现在跑腿数据格式为:Data=xxxx,xxx,xxx,xxx，可以设置为{"Data":["","","",""]}',
                '验证脚本:function(ctx,data),ctx:上下文环境；data：服务端响应的数据；返回true标识验证通过，否则验证失败,可以通过throw Error抛出验证失败信息;不设置标识不使用脚本验证'
              ]
            },      
            {
              h2:'字段列表',
              list:[
                '名称:字段名称',
                '类型:json数据类型(object,array,string,number,boolean)',
                '描述:字段描述信息',
                '添加:添加根节点',
                '添加子节点',
                '保存:编辑过后一定记得保存'
              ]
            },   
            {
              h2:'验证规则',
              list:[
                'Not Null:非空验证',
                'Equals:等于验证',
                '脚本验证:function(ctx,data),ctx:上下文环境；data：服务端响应的数据；返回true标识验证通过，否则验证失败,可以通过throw Error抛出验证失败信息;不设置标识不使用脚本验证',
                '后续根据需求添加通用的验证类型'
              ]
            },    
            {
              h2:'平台管理',
              list:[
                '类型：平台类型(android或iphone)',
                '描述：平台描述',
                'headers:平台的公共http消息头，可以放置平台的标识',
                '参数:平台的公共参数'
              ]
            },     
            {
              h2:'环境管理',
              list:[
                '名称：环境名称',
                '描述：环境描述',
                'headers:环境的公共http请求头',
                '配置：当前环境的配置信息',
                '请求处理脚本：发送请求之前，通过此脚本改变原请求的信息，比如修改url',
                'function(ctx,options)',
                'options.url nodejs.url:请求的url地址',
                'options.headers jsonobject:请求的消息头',
                'options.params jsonobject:请求的参数',
                'Hosts：通过hosts方式修改请求指向的地址'
              ]
            },      
            {
              h2:'Hosts管理',
              list:[
                'From:原url的host',
                'To:目标url的host',
                '描述'
              ]
            },           
          ],         
        },
        {
          h1:'任务管理',
          subList:[
            {
              h2:'任务列表',
              list:[
                '名称：任务名称',
                '平台：任务执行的平台（android、ios...）',
                '设备：任务执行的设备（在【工具】【设备管理】里面）',
                '环境：任务执行的环境，比如正式环境或测试环境',
                '版本：任务执行的应用版本',
                '进度：在这里可以点击执行任务，如果任务正在执行，则显示进度条',
                '报告：点击进入测试报告列表'
              ]
            },   
            {
              h2:'测试报告列表',
              list:[
                '时间：执行时间',
                '成功用例数',
                '失败用例数',
                '日志：查看详细日志信息(debug：调试、info：信息、warning：警告、error：错误)'              
              ]
            },          
          ],         
        },
        {
          h1:'工具',
          subList:[
            {
              h2:'设备管理',
              list:[
                '平台：android or iphone',
                '名称：设备名称',
                '描述：设备描述信息',
                '设备信息:JSON格式,可以设置设备的厂商、型号、版本、imei、imsi等信息'
              ]
            },   
            {
              h2:'数据安全方案管理',
              list:[
                '类型：现在支持加密、解密类型',
                '名称：方案名称',
                '脚本： ',
                '//function(ctx,options,callback) ',
                '//options: ',
                '// headers:请求头 ',
                '// params:请求参数 ',
                '//callbaclk ',
                '// err:错误 ',
                '// options'
              ]
            },          
          ],         
        },
        {
          h1:'其他',
          subList:[
            {
              h2:'headers和params加载以及合并顺序',
              list:[
                '环境',
                '平台',
                '设备',
                '应用',
                '版本',
                '接口',
                '用例'
              ]
            },   
            {
              h2:'ctx上下文环境',
              list:[
                '{',
                ' headers:{},//合并后消息头',
                ' params:{},//合并后的参数',
                ' configs:{},//配置 ',
                'cache:{}//每个case执行成功后返回数据的缓存，用于接口依赖 } '
              ]
            },     
            {
              h2:'动态参数',
              list:[
                '以#{}标记动态参数',
                '例子：',
                '{',
                ' "phone":"#{ctx.configs.account.phone}",',
                '  "token":"#{ctx.cache.login.success.Body.token}"',
                '}'
              ]
            },           
          ],         
        },
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .helpManager{
   text-align:left;
   height:100%;
   overflow-y:scroll;
 }
 .helpManager .subHelp ul{
   padding:10px;
 }
 .helpManager .subHelp ul li{
   line-height:30px;
 }
</style>

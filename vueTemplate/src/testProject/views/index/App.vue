<template>
  <div id="testApp">
      <el-container style="height: 100%; border: 1px solid #eee">
          <el-header style="text-align: center; font-size: 12px">
             <h2>UU测试管理平台</h2>
          </el-header>
          <el-container>
            <el-aside width="200px" style="background-color: rgb(255, 255, 255)">
              <el-menu @select="changeMenu" :default-active="activeItem" :unique-opened="false">
                <el-submenu :unique-opened="false" v-for="item,index in menu" :key="item.index" :index="item.index">
                  <template slot="title"><i :class="item.icon"></i>{{item.title}}</template>

                    <el-menu-item  v-for="sitem,key in item.items" :key="sitem.index" :index="sitem.index">{{sitem.title}}</el-menu-item>
                    
                  <el-submenu  v-if="item.submenu.length>0" v-for="subitem in item.submenu" :key="subitem.index" index="subitem.index">
                    <template slot="title">{{subitem.title}}</template>
                    <el-menu-item v-for="subitemitem in subitem.items" :key="subitemitem.index" :index="subitemitem.index">{{subitemitem.title}}</el-menu-item>
                  </el-submenu>

                </el-submenu>
              </el-menu>
            </el-aside>

            <el-main>
                <router-view></router-view>
            </el-main>
          </el-container>
          <!-- <el-footer  style="text-align: left; text-indent:30px;font-size: 12px">测试管理平台：2017.11.11</el-footer> -->
        </el-container>
        
  </div>
</template>

<script>
import Util from '@assets/js/util.js'
export default {
  name: 'testApp',
  data() {
    const item = {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    };
    return {
      tableData: Array(20).fill(item),
      activeItem:'proManager',
      menu:[
        {
          index:'test',
          title:'接口测试',
          icon:'el-icon-edit-outline',
          items:[
            {index:'proManager',title:'项目管理'},           
            {index:'editionManager',title:"版本管理"},
            {index:'interfaceManager',title:"接口管理"},
            {index:'taskManager',title:"任务管理"},
            {index:'reportManager',title:"测试报告"},
          ],
          submenu:[]
        },
        {
          index:'toolManager',
          title:'工具管理',
          icon:'el-icon-setting',
          items:[
            {index:'platManager',title:'平台管理'},
            {index:'deviceManager',title:'设备管理'},
            {index:'dataSafe',title:"数据安全方案"},
            {index:'configManager',title:"配置管理"},
            {index:'enviroumentManager',title:"环境管理"},
            {index:'help',title:"帮助"}
          ],
          submenu:[]
        },
      ]
    }
  },
  created () {
   let name = sessionStorage.getItem('activeItem');
   if(name){this.activeItem = name;}
  },
  methods: {
    changeMenu(val){
      this.$router.push('/'+val)
      sessionStorage.setItem('activeItem',val);
    }
  }
}
</script>

<style>
#testApp {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height:100%;
}
.el-header {
  background-color: #1a1a1a;
  color: #eee;
  line-height: 60px;
}
.el-footer{
  background-color: #1a1a1a;
  color: #eee;
  line-height: 60px;
}
.el-menu{
  height:100%;
}
.el-aside {
  color: #333;
}
.el-menu li{
  text-align:left;
}
.el-main{
  overflow:hidden;
}
</style>

<template>
    <div class="testManager taskdetail taskAdd">
        <el-header height="100px">
            <div class="testSearch" style="border-bottom:none;">
                <div class="testSearch-select">
                  <el-form :inline="true" :model="subForm" class="demo-form-inline">
                    <el-form-item  size="mini" label="项目">
                      <el-select @change="getProId" v-model="subForm.pro" placeholder="请选择项目">
                        <el-option v-for="item in proData" :label="item.name" :key="item.id" :value="item.id"></el-option>                       
                      </el-select>
                    </el-form-item>
                    <el-form-item  size="mini" label="版本">
                        <el-select @change="versionChange" v-model="subForm.ver" placeholder="请选择版本">
                          <el-option  v-for="item in verData" :label="item.name" :key="item.id" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                  </el-form>
                </div>              
              </div>
        </el-header>
       <div class="taskdetail-sub">
          <el-form :inline="true"  ref="taskSubForm" size="mini" :model="taskSubForm" label-width="80px">
              <el-form-item size="mini" label="任务名称">
                <el-input v-model="taskSubForm.name"></el-input>
              </el-form-item>
              <el-form-item size="mini" label="任务描述">
                  <el-input v-model="taskSubForm.description"></el-input>
              </el-form-item>
              <el-button-group>
                <el-button size="mini">保存</el-button>
              </el-button-group>
          </el-form>
       </div>
       <div class="taskdetail-main">
          <div class="taskdetail-main-left">
            <Contextmenu @close="closeMenu" :position="navPosition" :list="navList" :show="showContextMenu"></Contextmenu>
           
            <el-tree 
            ref="taskTree"
            :data="treeData" 
            :props="defaultProps" 
            default-expand-all
            :expand-on-click-node="false"
            :render-content="renderTree"
            @node-click="handleNodeClick"></el-tree>
          </div>
          <div class="taskdetail-main-right">
            <Edittable @change="changeEditTable" :propData="editTableData"></Edittable>
          </div>
       </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HelloWorld',
    data () {     
      return {
        // 查询
        subForm:{
          pro:'',
          ver:''
        },
        proData:[],
        verData:[],
        // 右键菜单
        showContextMenu:false,
        navPosition:{
          x:0,
          y:0
        },         
        navList:[
          {
            name:'添加分组',
            id:'0',
            show:true
          }, {
            name:'添加接口',
            id:'2',
            show:true
          },
          {
            name:'添加循环',
            id:'3',
            show:true,
            children:[
              { 
                name:'存在上下文参数',
                id:'6',
              },
              { 
                name:'for循环',
                id:'7',
              },
              { 
                name:'数字比较',
                id:'8',
              },
              { 
                name:'字符串比较',
                id:'9',
              }
            ]
          },
          {
            name:'添加条件',
            id:'4',
            show:true,
            children:[
              {
                name:'存在上下文参数',
                id:'10',
              },
              {
                name:'for循环',
                id:'11',
              },
              {
                name:'数字比较',
                id:'12',
              }, 
              {
                name:'字符串比较',
                id:'13',
              },
            ]
          },
          {
            name:'添加上下文参数',
            id:'5',
            show:true,
            children:[
              {
                name:'test',
                id:14,
                children:[
                  {
                    name:'test1',
                    id:15
                  }
                ]
              }
            ]
          },
        ],
        curRightNode:'',
        curLeftData:'',

        // 查询
        taskSubForm:{
          name:'',
          description:'',
          taskId:'',
          taskData:''
        },
        // 树
        treeData:[
          {
            name:'测试用例',
            id:-999,
            children:[
              // {
              //   name:'所有接口',
              //   id:1
              // },{
              //   name:'测试接口',
              //   id:2,
              //   children:[
              //     {
              //       name:'aaa',
              //       id:3
              //     }
              //   ]
              // }
            ]
          }
        ],
        defaultProps:{
          label:'name',
          children:'children'
        },
        // 右侧编辑表格
        editTableData:[
          // {
          //   name:'名称',
          //   value:'lily',
          //   select:[],
          // },{
          //   name:'描述',
          //   value:'这是一个测试',
          //   select:[]
          // },{
          //   name:'描述',
          //   value:'true',
          //   select:[{name:'true',value:true},{name:'false',value:false}]
          // }
        ],
        editTableNames:{
          'name':'名称',
          'description': '描述',
          'param_name': '上下文参数名称',
          'check_exists':'检测是否存在',//true false
          'sleep_time':'休眠时间',
          'operator':'操作符',
          'start_value': '开始值', 
          'end_value': '结束值', 
          'increment_value': '增量值', 
          'max_count':'最大迭代次数',
          'value': '值' ,
          'ignore_case': '是否忽略大小写', 
          'use_regexp': '是否使用正则表达式' 
        },
        editTablekeys:{
          '名称':'name',
          '描述':'description',
          '上下文参数名称':'param_name',
          '检测是否存在':'check_exists',//true false
          '休眠时间':'sleep_time',
          '操作符':'operator',
          '开始值':'start_value', 
          '结束值':'end_value', 
          '增量值':'increment_value', 
          '最大迭代次数':'max_count',
          '值':'value',
          '是否忽略大小写':'ignore_case', 
          '是否使用正则表达式':'use_regexp'
        }
      }
    },
    created(){
      this.getProData();
    },
    mounted(){
      // console.log('mounted...');
      // console.log(this.$refs.taskTree);
      let that = this;
      // 点击文档时关闭右键弹框
      document.addEventListener('click',function(event){
            that.showContextMenu = false;
      },false);
    },
    methods:{
      // 获取项目列表
      getProData(){
        let that = this;
        this.$http.get(REQUEST_PATH+'projects/list_all').then(function (res) {
          if(res.data.code === 0){
            let data = res.data.result;           
            that.proData = data.splice(0);
            console.log(that.proData);
          }else{
            let msg =  res.data.message || '获取项目失败';
            this.$message.error(msg);
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      getProId(id){
        this.curPro = id;
        this.subForm.ver = '';
        let that = this;
        // this.treeData = []
        this.$http.get(REQUEST_PATH+'projects/versions/list_all', {
          params: {
            project_id:id,
          }
        }).then(function (res) {
          if(res.data.code === 0){
            let data = res.data.result;
            that.verData = data.splice(0);
          }else{
            let msg =  res.data.message || '获取版本失败';
            this.$message.error(msg);
          }
        }).catch(function (error) {
          console.log(error);
        });
      }, 
      versionChange(ver){
        this.curVersion = ver;
        if(!ver){return;}
        // this.treeData = [];
        this.getGroup(ver);
      },
      getGroup(id){
        let that = this;
        console.log('version change...');
      },      

      // 节点点击事件
      handleNodeClick(data) {
        console.log('node click');
        console.log(data);
        this.curLeftData = data;

        this.editTableData = [];
        // 关闭右键菜单
        this.showContextMenu = false;     

        if(data.id === -999){return}

        //  设置editTable数据
        for(let key in data){
          if(this.editTableNames.hasOwnProperty(key)){
            this.editTableData.push({
              name:this.editTableNames[key],
              value:data[key],
              select:[]
            })
          }
        }

        console.log('edit table data');
        console.log(this.editTableData);
      },
      changeEditTable(val){
        // console.log('table change...');
        // console.log(val);
        val.map(item=>{
          if(this.editTablekeys.hasOwnProperty(item.name)){
            let key = this.editTablekeys[item.name];
            this.$set(this.curLeftData,key,item.value);
          }
        })
      },
      // 树节点的渲染函数
      renderTree(h, { node, data, store }){
        let that = this;
        return (
          <span on-contextmenu={(e)=>{e.preventDefault();this.openRightMenu(node,data,e);}}>
            <span>{node.label}</span>
          </span>
        );
      },
      openRightMenu(node,data,event){
        console.log('right click...');
        console.log(data);

        // 保存当前右键菜单数据
        this.curRightNode = data;

        // 设置右键菜单位置并显示菜单
        this.setMenuPosition(event);  
       
      },
      addSubMenu(data){
        let maxId = this.getMaxId(this.treeData);
        console.log('maxId...');
        console.log(maxId);
        if(!data.hasOwnProperty('children')){
          this.$set(data,'children',[]);
        }
        data.children.push({
          name:'new',
          id:maxId
        })
      },
      getMaxId(arr){
        let max = 0;
        arr.map(item=>{
          if(item.id > max){
            max = item.id;
          }
          if(item.hasOwnProperty('children')){
            let itemMax = this.getMaxId(item.children);
            max = max > itemMax ? max : itemMax;
          }
        })
        return max;
      },
      setMenuPosition(event){
        let e = event || window.event;
        let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        let scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        // let x = e.pageX || e.clientX + scrollX;
        // let y = e.pageY || e.clientY + scrollY;
        
        let src = e.target || e.srcElement;
        let bounding = src.getBoundingClientRect();
        let x = bounding.left + bounding.width +5;
        let y = bounding.top;
        this.$set(this.navPosition,'x',x);
        this.$set(this.navPosition,'y',y);
        
        this.showContextMenu = true;
        console.log(this.showContextMenu);
      },
      // 点击右键子菜单时获取数据并关闭菜单
      closeMenu(val){
        console.log('closeMenu...');
        console.log(val);
        this.showContextMenu = false;

         // 添加子组件
         this.addSubMenu(this.curRightNode);
      },    
     
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
    .taskdetail{
      position:relative;
    }
    .taskdetail .taskdetail-main{
      position:absolute;
      top:110px;
      bottom:0;
      width:100%;
      overflow:hidden;
      overflow:hidden;
    }
    .taskdetail .taskdetail-main .taskdetail-main-left{
      float:left;
      width:49%;
      border-right:1px solid #e6ebf5;
      height:100%;
    }
    .taskdetail .taskdetail-main .taskdetail-main-right{
      float:right;
      width:50%;
      height:100%;
      background-color:#fff;
    }
    .taskAdd .el-header{
      background-color:#fff;
      height:50px!important;
      position:relative;
      line-height:30px;
    }
  </style>
  
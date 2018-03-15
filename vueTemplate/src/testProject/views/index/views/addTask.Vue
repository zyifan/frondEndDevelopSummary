<template>
    <div class="testManager taskdetail taskAdd">
        <el-header height="100px">
            <div class="testSearch" style="border-bottom:none;">
                <div class="testSearch-select">
                  <el-form :inline="true"  size="mini"  :model="subForm"  label-width="42px">
                    <el-form-item  label="项目">
                      <el-select style="width:200px" @change="getProId" v-model="subForm.pro" placeholder="请选择项目">
                        <el-option v-for="item in proData" :label="item.name" :key="item.id" :value="item.id"></el-option>                       
                      </el-select>
                    </el-form-item>
                    <el-form-item label="版本">
                        <el-select style="width:200px" @change="versionChange" v-model="subForm.ver" placeholder="请选择版本">
                          <el-option  v-for="item in verData" :label="item.name" :key="item.id" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                  </el-form>
                </div>              
              </div>
        </el-header>
       <div class="taskdetail-sub">
          <el-form :inline="true"  ref="taskSubForm" size="mini" :model="taskSubForm" label-width="70px">
              <el-form-item label="任务名称">
                <el-input style="width:200px" v-model="taskSubForm.name"></el-input>
              </el-form-item>
              <el-form-item label="任务描述">
                  <el-input style="width:200px" v-model="taskSubForm.description"></el-input>
              </el-form-item>
              <el-button-group>
                <el-button size="mini" @click="saveNewTask">保存</el-button>
                <!-- <el-button @click="openTest" size="mini">测试</el-button> -->
              </el-button-group>
          </el-form>
       </div>
       <div class="taskdetail-main"  @contextmenu="(e)=>e.preventDefault()">
          <div class="taskdetail-main-left">
            <Contextmenu @leave="hideContext" @close="closeMenu" :position="navPosition" :list="navList" :show="showContextMenu"></Contextmenu>
           <div style="text-align:center;padding-top:20px;" v-if="treeData.length<=0">
             <span>暂无数据</span>
           </div>
            <el-tree 
            v-if="treeData.length>0"
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

       <!-- 测试 -->
       <el-dialog  title="测试" width="500px" :visible.sync="testFlag">
        <el-form  ref="testForm" :model="testForm" label-width="80px" :rules="testFormRules">
          <el-form-item label="平台" prop="platform_id">
            <el-select @change="confChange" v-model="testForm.platform_id" style="width:100%" placeholder="请选择">
              <el-option v-for="item,index in platArr" :key="index" :label="item.type" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备" prop="device_id">
            <el-select v-model="testForm.device_id" style="width:100%" placeholder="请选择">
              <el-option v-for="item,index in deviceArr" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="环境" prop="env_id">
            <el-select v-model="testForm.env_id" style="width:100%" placeholder="请选择">
              <el-option v-for="item,index in envArr" :key="index":label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配置" prop="config_id">
            <el-select v-model="testForm.config_id" style="width:100%" placeholder="请选择">
              <el-option v-for="item,index in configArr" :key="index":label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="testFormNo">取消</el-button>
          <el-button @click="testFormOk" type="primary" >确定</el-button>
        </div>
    </el-dialog>
    <!-- 新增接口 -->
    <el-dialog  title="新增接口" width="600px" :visible.sync="addNewInterface">
      <div style="height:400px;overflow:hidden;overflow-y:auto;">
          <el-tree highlight-current default-expand-all :data="interTreeData" :props="interDefaultProps" @node-click="interHandleNodeClick"></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interTreeNo">取消</el-button>
        <el-button @click="interTreeOk" type="primary" >确定</el-button>
      </div>
    </el-dialog>
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
        // 设备、环境、配置、接口
        platArr:[],
        deviceArr:[],
        configArr:[],
        envArr:[],
        interfaceArr:[],
        // 右键菜单
        showContextMenu:false,
        navPosition:{
          x:0,
          y:0
        },         
        navObj:{
          'group': {name:'添加分组',type:'group',id:'1',show:true},  //添加分组  false
          'interface':{name:'添加接口',type:'interface',id:'2',show:true},//添加接口  true
          'loop':{//添加循环  true
            name:'添加循环',
            id:'3',
            show:true,
            type:'loop',
            children:[
              {name:'存在上下文参数',id:'8',show:true,type:'loop',sub_type: 'exists'},
              {name:'for循环',id:'9',show:true,type:'loop',sub_type: 'for'},
              {name:'数字比较',id:'10',show:true,type:'loop',sub_type: 'number_compare'},
              {name:'字符串比较',id:'11',show:true,type:'loop',sub_type: 'string_compare'}
            ]
          },  
          'condition':{ //添加条件 true
            name:'添加条件',
            id:'4',
            show:true,
            type:'condition',
            children:[
              {name:'存在上下文参数',id:'12',show:true,type:'condition',sub_type: 'exists'},
              {name:'数字比较',id:'13',show:true,type:'condition',sub_type: 'number_compare'}, 
              {name:'字符串比较',id:'14',show:true,type:'condition',sub_type: 'string_compare'},
            ]
          }, 
          'event': { //添加事件 false
            name:'添加事件',
            id:'5',
            show:true,
            type:'event',
            children:[
              {name:'onBefore',id:'15',show:true,type:'event',sub_type: 'before'},
              {name:'onAfter',id:'16',show:true,type:'event',sub_type: 'after'}
            ]
          }, 
          'param':{name:'添加上下文参数',type:'param',id:'6',show:true}, // 添加上下文参数 true
          'delete':{name:'删除',type:'delete',id:'7',show:true}  //删除 true
        },
        navList:[
          // {name:'添加分组',id:'1',show:true}, 
          // {name:'添加接口',id:'2',show:true},
          // {
          //   name:'添加循环',
          //   id:'3',
          //   show:true,
          //   children:[
          //     {name:'存在上下文参数',id:'8',show:true},
          //     {name:'for循环',id:'9',show:true},
          //   ]
          // }         
        ],
        initialData:{
          'group':{
              "name": "新建分组", //分组名称
              "type": "group",  
              "description": "",  //分组描述
              "id": "",
              "add_time": '', //添加时间
              "children": []
          },
          'event':{
            'before':{
              name:'新建before事件',
              description:'',
              type:'event',
              sub_type: 'before',
              script:''
            },
            'after':{
              name:'新建after事件',
              description:'',
              type:'event',
              sub_type: 'after',
              script:''
            }
          },
          'interface':{
            "type": "interface",
            "interface_id": 9, //接口id
            "name": "请求建立连接（Android）",
            description:'',
          },
          'loop':{
            'exists':{
              name: '新建循环(上下文参数)',
              type: 'loop',
              sub_type: 'exists',
              description: '',
              param_name: '', //上下文参数名称
              check_exists: true, //检测是否存在
              max_count:-1,//最大迭代次数
              sleep_time:-1//休眠时间
            },
            'for':{
              name: '新建循环(For循环)',
              type: 'loop',
              sub_type: 'for',
              description: '',
              param_name: '',//上下文参数名称
              operator: '<', //操作符  （<、<=、>、>=）
              start_value: 0, //开始值
              end_value: 0, //结束值
              increment_value: 0, //增量值
              max_count:-1,//最大迭代次数
              sleep_time:-1//休眠时间
            },
            'number_compare':{
              name: '新建循环(数字比较)',
              type: 'loop',
              sub_type: 'number_compare',
              description: '',
              param_name: '',//上下文参数名称
              operator: '==', //操作符（==、!=、<、<=、>、>=）
              value: 0, //值
              max_count:-1,//最大迭代次数
              sleep_time:-1//休眠时间
            },
            'string_compare':{
              name: '新建循环(字符串比较)',
              type: 'loop',
              sub_type: 'string_compare',
              description: '',
              param_name: '',//上下文参数名称
              operator: '==',//操作符（==、!=）
              value: '', //值
              ignore_case: true, //是否忽略大小写
              use_regexp: false, //是否使用正则表达式
              max_count:-1,//最大迭代次数
              sleep_time:-1//休眠时间
            }
          },
          'condition':{
            'exists':{
              name: '新建条件(上下文参数)',
              type: 'condition',
              sub_type: 'exists',
              description: '',
              param_name: '', //上下文参数名称
              check_exists: true //检测是否存在
            },
            'number_compare':{
              name: '新建条件(数字比较)',
              type: 'condition',
              sub_type: 'number_compare',
              description: '',
              param_name: '',//上下文参数名称
              operator: '==', //操作符（==、!=、<、<=、>、>=）
              value: 0 //值
            },
            'string_compare':{
              name: '新建条件(字符串比较)',
              type: 'condition',
              sub_type: 'string_compare',
              description: '',
              param_name: '',//上下文参数名称
              operator: '==',//操作符（==、!=）
              value: '', //值
              ignore_case: true, //是否忽略大小写
              use_regexp: false //是否使用正则表达式
            }
          },
          'param':{
            name: '新建上下文参数',
            type: 'param',
            description: '',
            param_name: '',//上下文参数名称
            value:'' //值
          }
        },
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
          // {
          //   name:'测试用例',
          //   id:-999,
          //   type:'root',
          //   children:[
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
          //   ]
          // }
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
        },
        operatorSel:{
          'for':[{name:'<'},{name:'<='},{name:'>'},{name:'>='}],
          'number_compare':[{name:'=='},{name:'!='},{name:'<'},{name:'<='},{name:'>'},{name:'>='}],
          'string_compare':[{name:'=='},{name:'!='}]              
        },
        bolArr:['ignore_case','use_regexp','check_exists'],
        // 测试
        testFlag:false,
        testForm:{
          task_id:'',
          platform_id:'',
          device_id:'',
          env_id:'',
          config_id:''
        },
        testFormRules:{
          'platform_id':[
            { required: true,type:'number', message: '请选择平台', trigger: 'change' }
          ],
          'device_id':[
            { required: true,type:'number', message: '请选择设备', trigger: 'change' }
          ],
          'env_id':[
            { required: true,type:'number', message: '请选择环境', trigger: 'change' }
          ],
          'config_id':[
            { required: true,type:'number', message: '请选择配置', trigger: 'change' }
          ],
        },
        // 新增接口
        addNewInterface:false,
        interTreeData:[{
            id:-999,
            name:'接口列表',
            addable:true,
            root:true,
            children:[]
        }],
        interDefaultProps:{
          children: 'children',
          label: 'name',
          isLeaf:'leaf'
        },
        curInterNode:'',
        proData:[],
        verData:[],
        curVersion:''
      }
    },
    created(){
      this.getProData();
      // this.getTaskDetail();
      // this.getAllConfig();
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
        this.treeData = [{
          name:'测试用例',
            id:-999,
            type:'root',
            children:[]
        }];
      },
      // 获取任务详情
      getTaskDetail(){
        let that = this;      
        this.$http.get(REQUEST_PATH+'tasks/info', {
          params: {
          id:this.taskId
          }
        }).then(function (res) {
          if(res.data.code === 0){
            let data = res.data.result;           
            that.taskData = data;
            that.taskData.cases = JSON.parse(data.cases);
            // console.log('task detail...');
            // console.log(that.taskData);
            that.treeData[0].children = that.taskData.cases;
            that.taskSubForm.name = data.name;
            that.taskSubForm.description = data.description;
            that.getAllEnv();
            that.getAllPlat();
            that.getGroup();
          }else{
            let msg =  res.data.message || '获取数据失败';
            this.$message.error(msg);
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      // 获取平台、设备、环境、配置、接口
      getAllPlat(){
        // device = android/iphone
        let that = this;      
        this.$http.get(REQUEST_PATH+'projects/platforms/list_all', {
          params: {
            project_id:this.taskData.project_id
          }
        }).then(function (res) {
          if(res.data.code === 0){           
            that.platArr = [];
            that.platArr = res.data.result.splice(0);
            // console.log('平台...');
            // console.log(that.platArr);
          }else{
            let msg =  res.data.message || '获取平台失败';
            this.$message.error(msg);
          }
        }).catch(function (error) {
          console.log(error);
        });
      },   
      confChange(val){
        let device = '';
        this.platArr.map(item=>{
          if(item.id == val){
            device = item.type;
          }
        })
        this.getAllDevice(device);
      },
      getAllDevice(device){
        // device = android/iphone
        let that = this;      
        this.$http.get(REQUEST_PATH+'devices/list_all', {
          params: {
            platform_type:device
          }
        }).then(function (res) {
          if(res.data.code === 0){           
            that.deviceArr = [];
            that.deviceArr = res.data.result.splice(0);
            // console.log('设备...');
            // console.log(that.deviceArr);
          }else{
            let msg =  res.data.message || '获取设备失败';
            this.$message.error(msg);
          }
        }).catch(function (error) {
          console.log(error);
        });
      },      
      getAllEnv(){
        let that = this;      
        this.$http.get(REQUEST_PATH+'projects/envs/list_all', {
          params: {
            project_id:this.taskData.project_id
          }
        }).then(function (res) {
          if(res.data.code === 0){           
            that.envArr = [];
            that.envArr = res.data.result.splice(0);
            // console.log('环境...');
            // console.log(that.envArr);
          }else{
            let msg =  res.data.message || '获取环境失败';
            this.$message.error(msg);
          }
        }).catch(function (error) {
          console.log(error);
        });
      },   
      getAllConfig(){
        let that = this;      
        this.$http.get(REQUEST_PATH+'configs/list_all').then(function (res) {
          if(res.data.code === 0){           
            that.configArr = [];
            that.configArr = res.data.result.splice(0);
            // console.log('配置...');
            // console.log(that.configArr);
          }else{
            let msg =  res.data.message || '获取配置失败';
            this.$message.error(msg);
          }
        }).catch(function (error) {
          console.log(error);
        });
      },  
      // 节点点击事件
      handleNodeClick(data) {
        // console.log('node click');
        // console.log(data);
        this.curLeftData = data;

        this.editTableData = [];
        // 关闭右键菜单
        this.showContextMenu = false;     

        if(data.id === -999){return}

        //  设置editTable数据
        for(let key in data){
          let subType = data['sub_type'];
          if(this.editTableNames.hasOwnProperty(key)){
            let obj = {
              name:this.editTableNames[key],
              value:data[key],
              select:[]
            }
            if(key == 'operator'){
              obj.select = this.operatorSel[subType].slice(0);
            }
            if(this.bolArr.indexOf(key) !== -1){
              obj.select = [{name:'true'},{name:'false'}];
            }
            this.editTableData.push(obj)
          }
        }
        
        // console.log('edit table data');
        // console.log(this.editTableData);
      },
      // 右侧数据有修改时实时更新tree节点数据
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
      // 打开右键菜单
      openRightMenu(node,data,event){
        // console.log('right click...');
        // console.log(data);

        // 保存当前右键菜单数据
        this.curRightNode = data;

        // 设置右键菜单位置并显示菜单
        this.setMenuPosition(event,data);  
       
      },
      // 删除tree节点
      delSubMenu(data,arr){
        arr.map((item,index)=>{
          if(item.id === data.id){
            arr.splice(index,1);
          }else{
            if(item.hasOwnProperty('children')){
              this.delSubMenu(data,item.children);
            }
          }
        })
      },
      // 添加tree节点
      addSubMenu(data,type,subtype){
        let maxId = this.getMaxId(this.treeData);
        maxId = this.$util.randomID();

        if(!data.hasOwnProperty('children')){
          this.$set(data,'children',[]);
        }
        let obj = {};
        if(type){
          if(subtype){
            obj =Object.assign({},this.initialData[type][subtype]);
          }else{
            obj =Object.assign({},this.initialData[type]);           
          }
        }
        obj.id = maxId;
        if(obj.hasOwnProperty('add_time')){
          obj.add_time = new Date().getTime();
        }
        if(this.curInterNode){
          obj.name = this.curInterNode.name;
        }
        data.children.push(obj)   
        // console.log('new node');     
        // console.log(obj);
      },
      // 获取tree节点最大id值
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
      // 设置右键菜单实时位置
      setMenuPosition(event,data){
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
        // 设置菜单数据
        this.setNavData(data);
        // console.log(this.showContextMenu);
      },
      // 设置右键菜单data数据
      setNavData(data){
        let len = this.navList.length;
        let listArr = [];
        switch(data.type){
          case 'root':{
            listArr = ['group','interface','loop','condition','param'];
            break;
          }
          case 'group':{
            listArr = ['interface','loop','condition','param','delete'];
            break;
          }
          case 'param':
          case 'event':{
            listArr = ['delete'];
            break;
          }
          case 'interface':{
            listArr = ['event','param','delete'];
            break;
          }
          case 'loop':
          case 'condition':{
            listArr = ['interface','param','delete'];
            break;
          }
          default:{
            listArr = ['group','interface','loop','param'];
          }            
        }
        this.navList = [];
        listArr.map(item=>{
          this.navList.push(this.navObj[item]);
        })    
      },
      // 点击右键子菜单时获取数据并关闭菜单
      closeMenu(val){
        // console.log('closeMenu and add new node...');
        // console.log(val);

        this.showContextMenu = false;

        if(val.type === 'delete'){//删除
          this.delSubMenu(this.curRightNode,this.treeData[0].children);
        }else if(val.type === 'interface'){
          this.addNewInterface = true;
          this.curInterNode = '';
        }else{
          // 添加子组件
          this.addSubMenu(this.curRightNode,val.type,val.sub_type);
        }      
      },    
      interTreeNo(){
        this.addNewInterface = false;
      },
      // 添加新的接口节点
      interTreeOk(){
        if(!this.curInterNode){
          this.$message.warning('请选择一个接口');
        }else{
          this.addSubMenu(this.curRightNode,'interface');
          this.addNewInterface = false;
        }
      },
      // 隐藏菜单
      hideContext(){
        // 鼠标离开时隐藏菜单
        this.showContextMenu = false;
      },
      //测试
      openTest(){
        this.testFlag = true;
      },
      testFormNo(){
        this.testFlag = false;
      },
      testFormOk(){
        this.$refs.testForm.validate((valid) => {
          if (valid) {
            this.testFormAjax();
          }
        });
      },
      testFormAjax(){
        let that = this;
        let uData = Object.assign({},this.testForm);
        uData.task_id = this.taskId;
        this.$http.post(REQUEST_PATH+'tasks/start',uData)
        .then(function(res){
          if(res.data.code === 0){
            let id = res.data.result;
            that.$router.push('/viewReport/'+id);
          }else{
            let msg =  res.data.message || '测试失败!';
            that.$message.error(msg);
          }
        })
        .catch(function(err){
          console.log(err);
        });
      },
      // 新增接口
      interHandleNodeClick(data){
        this.curInterNode = '';
        if(!data.leaf){return}
        // console.log('click interface node...');
        // console.log(data);
        this.curInterNode = data;
      },
      getGroup(){//获取接口分组
        let that = this;
        this.$http.get(REQUEST_PATH+'projects/versions/groups/list', {
          params: {
            version_id:this.taskData.version_id,
          }
        }).then(function (res) {
          if(res.data.code === 0){
            let data = res.data.result;
            that.groupArr =[];
            let arr = [];
            arr = data.map(item=>{
              that.groupArr.push(item);
              item.leaf = false;
              item.children=[];
              return item;
            })
            that.interTreeData[0].children = arr.splice(0);
            // console.log('interface tree data...');
            that.interTreeData[0].children.map(item=>{
              that.getInterByGroup(item);
            })
            // console.log(that.interTreeData[0].children);
          }else{
            let msg =  res.data.message || '获取分组失败';
            this.$message.error(msg);
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      getInterByGroup(parent){
        let that = this;
        this.$http.get(REQUEST_PATH+'projects/versions/interfaces/list', {
          params: {
            group_id:parent.id,
            version_id:this.taskData.version_id,
          }
        }).then(function (res) {
          if(res.data.code === 0){
            let data = res.data.result;
            data = data.map(item=>{
              item.leaf = true;
              return item;
            })
            if(!parent.hasOwnProperty('children')){
              that.$set(parent,'children',[]);
            }
            parent.children = data;
          }else{
            let msg =  res.data.message || '获取子接口失败';
            this.$message.error(msg);
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      // 保存
      saveNewTask(){
        let that = this;
        // console.log('save...');
        if(!this.taskSubForm.name){
          this.$message.warning('请填写任务名称');
          return;
        }
        if(this.treeData.length <=0 || this.treeData[0].children.length<=0){
          this.$message.warning('请添加任务节点');
          return;
        }

        let uData = {
          name:this.taskSubForm.name,
          project_id:this.curPro,
          version_id:this.curVersion,
          description:this.taskSubForm.description,
          cases:JSON.stringify(this.treeData[0].children),
        }
        // console.log(uData);
        this.$http.post(REQUEST_PATH+'tasks/add',uData)
        .then(function(res){
          if(res.data.code === 0){
            that.$router.push('/taskManager');
          }else{
            let msg =  res.data.message || '保存失败!';
            that.$message.error(msg);
          }
        })
        .catch(function(err){
          console.log(err);
        });
      }
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
      padding:0;
    }
  </style>
  
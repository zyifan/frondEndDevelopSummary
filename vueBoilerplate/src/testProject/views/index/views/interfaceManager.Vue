<template>
  <div class="testManager">
    <el-container style="height:100%">
        <el-header height="100px">
            <div class="testSearch">
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
        <el-container>
            <el-aside width="400px">
              <div class="tree-container">
                  <div style="text-align:center;color:#999;margin-top:50px" v-if="treeData.length<=0">
                      暂无数据
                  </div>
                  <el-tree ref="navTree" v-else lazy 
                  node-key="id"
                  :default-expanded-keys="defaultExpand"
                  @current-change="nodeChange"
                  :data="treeData"
                  :render-content="renderContent" 
                  :load="loadNode" 
                  :props="defaultProps"
                  :highlight-current="true"
                  :expand-on-click-node="false"></el-tree>
              </div>                
            </el-aside>
            <el-main  style="padding-bottom:0;padding-top:0;overflow-y:auto;">
              <div class="interface" v-show="!addGroupFlag && !interfaceFlag"><div style="text-align:center;padding-top:70px;color:#999">接口管理...</div></div>
               <div class="interface" v-show="addGroupFlag">                 
                  <div class="inter-title">
                      <h2>添加分组</h2>
                   </div> 
                   <div class="inter-form">
                      <el-form ref="groupForm" :model="groupFormRule" label-width="90px" size="mini">
                          <el-form-item label="名称">
                            <el-input v-model="groupForm.name"></el-input>
                          </el-form-item>
                          <el-form-item label="描述">
                            <el-input type="textarea" :row="5" v-model="groupForm.description"></el-input>
                          </el-form-item>
                          <el-form-item label="">
                              <el-button @click="addGroup">保存</el-button>
                          </el-form-item>
                      </el-form>
                   </div>
               </div>
               <div class="interface" v-show="interfaceFlag">
                 <div class="inter-title">
                    <h2>接口信息<span style="color:#cc6f6f;font-size:14px;font-weight:normal;">({{editCopyInfo}})</span> <el-button-group style="float:right;"><el-button @click="saveInterface" size="mini" >保存</el-button><el-button @click="singleTest" size="mini">测试</el-button></el-button-group></h2>
                 </div>                  
                  <div class="inter-form">
                      <el-form ref="interForm" :model="interForm" :rules="interFormRules" label-width="90px" size="mini">
                          <el-form-item label="接口名称" prop="name">
                            <el-input v-model="interForm.name"></el-input>
                          </el-form-item>
                          <el-form-item label="请求url" prop="url">
                            <el-input v-model="interForm.url" ></el-input>
                          </el-form-item>
                          <el-row>
                              <el-col :span="12">
                                  <el-form-item label="所属分组"  prop="group_id">
                                      <el-select v-model="interForm.group_id" :disabled="disableGroup"  style="width:100%" placeholder="请选择分组">
                                        <el-option v-for="item in groupArr" :label="item.name" :key="item.id" :value="item.id"></el-option>
                                      </el-select>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                  <el-form-item label="请求方式" prop="method">
                                      <el-select v-model="interForm.method" style="width:100%" placeholder="请选择请求方式">
                                        <el-option label="Post" value="post"></el-option>
                                        <el-option label="Get" value="get"></el-option>
                                      </el-select>
                                  </el-form-item>
                              </el-col>
                          </el-row>                        
                          
                          <el-form-item label="支持平台" prop="platforms">
                              <el-select v-model="interForm.platforms" style="width:100%" multiple  placeholder="请选择请求方式">
                                <el-option label="android" value="android"></el-option>
                                <el-option label="iphone" value="iphone"></el-option>
                              </el-select>
                          </el-form-item>
                          <el-form-item label="描述"  prop="description">
                              <el-input type="textarea" v-model="interForm.description"></el-input>
                          </el-form-item>
                      </el-form>
                  </div>
                  <div v-show="!showTreeFlag" style="height:400px;"  element-loading-text="拼命加载中..."
                  element-loading-spinner="el-icon-loading"  v-loading="loadTabs">
                    加载中...
                  </div>
                  <div v-if="showTreeFlag" class="tree-table inter-treetable">
                    <template>
                      <el-tabs  type="card" v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="请求参数" name="req">
                          <Treetable :data="reqTreeData" ref="reqTree"></Treetable>
                        </el-tab-pane>
                        <el-tab-pane label="请求响应" name="res">
                          <div class="flex">
                              <div class="flex-1">
                                  <h3 class="reqtype-title">数据结构</h3>
                                  <Treetable :treeRWidth="550" :showStruct="true" :showParams="false" :showValue="false" :struct="treeData[0].children"  @nodeclick="paramTreeNodeClick" :data="resTreeData" ref="resTree"></Treetable>
                              </div>
                              <div style="width:300px;margin-left:10px;padding-left:10px;border-left:1px solid #eee;">
                                  <h3 class="reqtype-title">验证规则</h3>
                                  <Typetable @change="changeExtend" :disableAdd="curResNodeData?false:true" :propData="typeData"></Typetable>
                              </div>
                          </div>                         
                          
                        </el-tab-pane>
                      </el-tabs>
                    </template>
                  </div>
               </div>
                
            </el-main>
          </el-container>
    </el-container>
    <el-dialog title="添加数据结构" width="1200px" :visible.sync="addStructFlag">
      <div class="addStruct-top">
          <el-form ref="addStructForm" :model="addStructForm" label-width="45px">
              <el-form-item label="名称"  style="width:700px;">
                <el-input v-model="addStructForm.name"></el-input>
              </el-form-item>
              <el-form-item label="描述" style="width:700px;">
                <el-input type="textarea" row="5" v-model="addStructForm.remark"></el-input>
              </el-form-item>
          </el-form>
      </div>
      <div class="addStruct-bottom">
        <div class="flex">
          <div class="flex-1">
              <h3 class="reqtype-title">数据结构</h3>
              <Treetable :treeRWidth="450" style="min-width:820px;" :showParams="false" :showValue="false" @clear="treeClear"  @nodeclick="addParamTreeNodeClick" :data="addResTreeData" ref="addResTree"></Treetable>
          </div>
          <div style="width:300px;margin-left:10px;padding-left:10px;border-left:1px solid #eee;">
              <h3 class="reqtype-title">验证规则</h3>
              <Typetable @change="addChangeExtend" :appendToBody="true" :disableAdd="curAddResNodeData?false:true" :propData="addTypeData"></Typetable>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStructNo">取 消</el-button>
        <el-button @click="addStructOk" type="primary" >确 定</el-button>
      </div>
  </el-dialog>
  </div>
</template>

<script>
  let id = 1000;
export default {
  name: 'HelloWorld',
  data () {
    return {
      typeData:[],
      curResNodeData:'',     
      defaultExpand:[-1000,-999],
      proData:[],
      verData:[],
      curVersion:'',
      groupArr:[],
      curPro:'',
      // 接口信息
      editCopyInfo:'修改',
      copyFlag:false,
      interForm:{
        id:'',
        version_id:'',
        name:'',
        url:'',
        group_id:'',
        method:'',
        platforms:[],
        description:'',
        params:'',
        responses:''
      },
      interFormRules:{
        name:[
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30个字符', trigger: 'blur' }
        ],
        url:[
          { required: true, message: '请输入url', trigger: 'blur' }
        ],
        group_id:[
          { required: true,type:'number', message: '请选择分组', trigger: 'change' }
        ],
        method:[
          { required: true, message: '请选择请求方式', trigger: 'change' }
        ],
      },
      currentRow:'',    
      // 分页
      total:0,
      curPage:1,
      curSize:20,
      // 查询
      subForm:{
        pro:'',
        ver:''
      },
      // 接口树
      treeData:[],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      // 参数
      activeName:'req',

      // treetable
      reqTreeData:[],
      resTreeData:[],
      // 分组
      addGroupFlag:false,
      interfaceFlag:false,
      groupForm:{
        name:'',
        description:''
      },
      groupFormRule:{
        name:[
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ]       
      },
      groupAddOrEdit:'add',
      curEditData:'',
      curGroupData:'',
      disableGroup:true,
      interfaceAddOrEdit:'add',
      curInterfaceData:'',
      showTreeFlag:false,
      loadTabs:true,
      // 数据结构
      addStructFlag:false,
      addStructForm:{
        name:'',
        remark:'',
      },
      addResTreeData:[],
      addTypeData:[],
      curAddResNodeData:'',
      addOrEditStruct:'edit',
      addOrEditFlag:false
    }
  },
  created(){
    // 请求表格数据
    this.getProData();
  },
  mounted(){
  },
  methods:{
    treeClear(val){
      // console.log('clear...');
      this.$nextTick(()=>{
        this.addTypeData = [];
      })      
    },
    // 获取项目列表
    getProData(){
      let that = this;
      this.$http.get(REQUEST_PATH+'projects/list_all').then(function (res) {
        if(res.data.code === 0){
           let data = res.data.result;           
           that.proData = data.splice(0);
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
      this.addGroupFlag = false;
      this.interfaceFlag = false;
      let that = this;
      this.treeData = []
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
      this.addGroupFlag = false;
      this.interfaceFlag = false;
      // console.log('curversion:'+this.curVersion);
      if(!ver){return;}
      this.treeData = [];
      this.getGroup(ver);     
    },
    getGroup(id){
      let that = this;
      this.$http.get(REQUEST_PATH+'projects/versions/groups/list', {
        params: {
          version_id:id,
        }
      }).then(function (res) {
        if(res.data.code === 0){
           let data = res.data.result;
           that.groupArr =[];
           let arr = [];
           arr = data.map(item=>{
             that.groupArr.push(item);
             item.addable = true;
             item.group = true;
             item.children=[];
             return item;
           })       
           that.treeData.push({
            id:-1000,
            name:'数据结构',
            addable:true,
            root:true,
            children:[]
          })   
          that.getDataStruct();
          that.treeData.push({
            id:-999,
            name:'接口列表',
            addable:true,
            root:true,
            children:[]
          })
           that.treeData[1].children = arr.splice(0);
          //  console.log('treeData');
          //  console.log(that.treeData);           
        }else{
          let msg =  res.data.message || '获取接口失败';
          that.$message.error(msg);
        }
      }).catch(function (error) {
        console.log(error);
      });
    },      
    getDataStruct(){
      let that = this;
      this.$http.get(REQUEST_PATH+'projects/versions/structs/list', {
        params: {
          version_id:this.curVersion,
        }
      }).then(function (res) {
        if(res.data.code === 0){
          let data = res.data.result;
          data = data.map(item=>{
            item.leaf = true;
            item.type = 'struct';
            item.subtype = 'substruct';
            item.addable = false;
            item.editable = true;
            item.deletable = true;
            return item;
          });
          that.treeData[0].children = data.splice(0);        
        }else{
          let msg =  res.data.message || '获取数据结构失败';
          that.$message.error(msg);
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    // 树
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.treeData);
      }
      if (node.level === 1) {
        if(node.label == '接口列表'){
          return resolve(this.treeData[1].children);
        }else{
          return resolve(this.treeData[0].children);
        }       
      }
      if (node.level > 2) return resolve([]);
      let id = node.data.id;
      let verId = node.data.version_id;
      this.getChildrenNode(id,verId,resolve,node);
    },    
    getChildrenNode(id,verId,resolve,node){
      let that = this;
      this.$http.get(REQUEST_PATH+'projects/versions/interfaces/list', {
        params: {
          group_id:id,
          version_id:verId,
        }
      }).then(function (res) {
        if(res.data.code === 0){
           let data = res.data.result;
           data = data.map(item=>{
             item.addable = false;
             item.editable = false;
             item.deletable = true;
             item.leaf = true;
             return item;
           })
           node.data.children = data;
           resolve(node.data.children);
          //  console.log('load node...');
          //  console.log(node.data.children);
        }else{
          let msg =  res.data.message || '获取子节点失败';
          this.$message.error(msg);
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    renderContent(h, { node, data, store }) {
        return (
          <span style="flex: 1; display: flex; align-items: center;flex-start: ; font-size: 14px;">
            <span style="padding-right:15px;">
              <span>{node.label+( data.hasOwnProperty('count') ? '['+data.count+']' : '')}</span>
            </span>
            <span>              
              { data.addable ? <el-button size="mini" style="font-size: 12px;color:#666;" icon="el-icon-plus" type="text" on-click={ () => this.append(data,node) }></el-button> : ''}
              { data.editable ? <el-button size="mini" style="font-size: 12px;color:#666;" icon="el-icon-edit" type="text" on-click={ () => this.edit(data,node) }></el-button> : ''}
              { !data.editable &&　!data.addable ? <el-button size="mini" style="font-size: 12px;color:#666;" icon="el-icon-printer" type="text" on-click={ (e) =>{this.copy(data,node)} }></el-button>: ''}
              { data.deletable ? <el-button size="mini" style="font-size: 12px;color:#666;" icon="el-icon-delete" type="text" on-click={ () => this.remove(data,node) }></el-button>: ''}
            </span>
          </span>);
    },
    append(data,node){
      if(data.id === -999){
        this.addGroupFlag = true; 
        this.interfaceFlag = false;
        this.groupAddOrEdit = 'add';  
      }else if(data.id === -1000){
        this.addGroupFlag = false; 
        this.interfaceFlag = false;
        this.groupAddOrEdit = 'add';
        // console.log('add struct...');
        this.addStructFlag = true;
        this.addOrEditStruct = 'add';
        this.addStructForm.name = '';
        this.addStructForm.remark = '',
        this.addResTreeData = [];
        this.addTypeData = [];
      }else{
        this.addGroupFlag = false;
        this.interfaceFlag = true;
        this.interfaceAddOrEdit = 'add';
        this.addOrEditFlag = true;
        // 清空表格数据
        this.$refs.interForm.resetFields();
        this.reqTreeData = [];
        this.resTreeData = [];
        this.interForm.group_id = data.id;
        this.curGroupData = data;
      }
    },
    addGroup(){
      this.$refs.groupForm.validate((valid) => {
          if (valid) {
            if(this.groupAddOrEdit == 'add'){
              this.addGroupAjax();
            }else{
              this.editGroupAjax();
            }           
          } 
        })
    },
    editGroupAjax(){
      let that =this;
      let editdata = this.curEditData;
      this.$http.post(REQUEST_PATH+'projects/versions/groups/edit',{
        id:editdata.id,
        name:this.groupForm.name,
        description:this.groupForm.description,
      })
      .then(function(res){
        if(res.data.code === 0){
           that.$message.success('修改成功!');
           editdata.name = that.groupForm.name;
           editdata.description = that.groupForm.description;
           that.addGroupFlag = false;
        }else{
          let msg =  res.data.message || '修改失败!';
          that.$message.error(msg);
        }
      })
      .catch(function(err){
        console.log(err);
      });
    },
    addGroupAjax(){
      let that = this;
      this.$http.post(REQUEST_PATH+'projects/versions/groups/add',{
        version_id:this.curVersion,
        name:this.groupForm.name,
        description:this.groupForm.description,
      })
      .then(function(res){
        if(res.data.code === 0){
           that.$message.success('操作成功!');
           let data = res.data.result;
           data.addable = true;
           data.count = 0;
           data.deletable = true;  
           data.editable = true;    
           data.group = true;
           that.treeData[0].children.push(data);
           that.addGroupFlag = false;
        }else{
          let msg =  res.data.message || '操作失败!';
          that.$message.error(msg);
        }
      })
      .catch(function(err){
        console.log(err);
      });
    },
    edit(data,node){
      // console.log('edit...');
      this.curEditData = data;
      // console.log('cur data...');
      // console.log(this.curEditData);
      if(data.hasOwnProperty('group')){
        this.addGroupFlag = true;
        this.interfaceFlag = false;
        this.groupAddOrEdit = 'edit';
        this.groupForm.name = data.name;
        this.groupForm.description = data.description;
      }else if(data.hasOwnProperty('leaf') && data.type == 'struct'){       
        this.addStructFlag = true;
        if(typeof this.curEditData.content == 'string'){
          this.curEditData.content = JSON.parse(data.content);
        }       
        this.addStructForm.name = data.name;
        this.addStructForm.remark = data.description;
        this.addResTreeData = [];
        this.curEditData.content.map(item=>{
          this.addResTreeData.push(item);
        });
        this.addTypeData = [];
        this.addOrEditStruct = 'edit';
      }else if(data.hasOwnProperty('leaf')){
        this.addGroupFlag = false;
        this.interfaceFlag = true;
        // 为表格添加数据...
      }
    },
    copy(data,node){
      this.copyFlag = true;
    },
    remove(data,node){
      // console.log(data.type); 
      
      let url = REQUEST_PATH+'projects/versions/groups/del' ;
      let parent = node.parent;
      let children = parent.data.children || parent.data;  
      let index = children.findIndex(d => d.id === data.id);
      if(data.hasOwnProperty('group')){       
        this.removeGroup(data,index,children,parent,url);
        return;
      }
      if(data.hasOwnProperty('type') &&　data.type == 'struct'){
        url = REQUEST_PATH+'projects/versions/structs/del';
        this.removeGroup(data,index,children,parent,url);
        return;
      }
      if(data.hasOwnProperty('leaf') && data.type != 'struct'){
        url = REQUEST_PATH+'projects/versions/interfaces/del'
        this.removeGroup(data,index,children,parent,url);
      }
    },
    removeGroup(data,index,children,parent,url){
      let that = this;
      this.$http.post(url,{
       id:data.id
      })
      .then(function(res){
        if(res.data.code === 0){
          children.splice(index, 1);
          that.$refs.navTree.updateKeyChildren(parent.data.id,children);
          let msg =  res.data.message || '删除成功!';
          that.$message.success(msg);
          if(url == REQUEST_PATH+'projects/versions/interfaces/del'){
            that.interfaceFlag = false;
          }
        }else{
          let msg =  res.data.message || '删除失败!';
          that.$message.error(msg);
        }
      })
      .catch(function(err){
        console.log(err);
      });
    },
    // 参数配置
    handleClick(tab, event) {
      // 标签切换事件
      // console.log(tab, event);
    },
    nodeChange(data,node){     
      // console.log('node click...');
      // console.log(data);

      if(this.copyFlag){
        this.editCopyInfo = '复制';
        this.interfaceAddOrEdit = 'add'
        this.copyFlag = false;
      }else if(this.addOrEditFlag){
        this.editCopyInfo = '添加';
        this.addOrEditFlag = false;
      }else{
        this.editCopyInfo = '修改';
        this.interfaceAddOrEdit = 'edit';
      }

      if(!data.hasOwnProperty('leaf')){
        this.showTreeFlag=true;
        // console.log('middle...');
        // console.log(this.showTreeFlag);
        return;
      }
      
      //如果是数据结构，则不显示任何东西
      if(data.type &&　data.type == 'struct'){return;}
      
      this.typeData = [];
      this.activeName = 'req';
      this.showTreeFlag = false;
      this.curResNodeData = '';
      this.curInterfaceData = data;
     
      this.interForm = Object.assign({},{
        id:data.id,
        name:data.name,
        url:data.url,
        group_id:data.group_id,
        method:data.method,
        platforms:data.platforms ? data.platforms.split(','):[],
        description:data.description,
      })
      let reqdata = JSON.parse(data.params);
      let resdata = JSON.parse(data.responses);
      if(Object.prototype.toString.call(reqdata).slice(8,-1) == 'Array'){
        this.reqTreeData = reqdata;
      }
      if(Object.prototype.toString.call(resdata).slice(8,-1) == 'Array'){
        this.resTreeData = resdata;
        // console.log('resdata...');
        // console.log(resdata);
      }      
      
      this.interfaceFlag = true;  
      this.addGroupFlag = false;    

      setTimeout(() => {
            this.showTreeFlag = true;
            // console.log('showtreeFalg...');
            // console.log(this.showTreeFlag);
      },0);
    },

    //新增接口 
    saveInterface(){
      this.$refs.interForm.validate((valid)=>{
        if(valid){
          if(this.interfaceAddOrEdit == 'add'){
            this.saveAjax();
          }else{
            this.editAjax();
          }         
        }
      })
    },
    editAjax(){
      let that = this;
      let uData = Object.assign({},this.interForm)
      console.log('platforms');
      console.log(this.interForm.platforms);
      
      uData.platforms = this.interForm.platforms.join(',');
      uData.params = JSON.stringify(this.$refs.reqTree.treeData);
      let reqData = this.setReqData(this.$refs.resTree.treeData);      
      uData.responses =  JSON.stringify(reqData);
      this.$http.post(REQUEST_PATH+'projects/versions/interfaces/edit',uData)
      .then(function(res){
        if(res.data.code === 0){          
          that.curInterfaceData = Object.assign(that.curInterfaceData,uData);
          let msg =  res.data.message || '接口编辑成功!';
          that.$message.success(msg);
          that.interfaceFlag = false;
        }else{
          let msg =  res.data.message || '接口编辑失败!';
          that.$message.error(msg);
        }
      })
      .catch(function(err){
        console.log(err);
      });
    },
    setReqData(arr){
     return arr.map(item=>{
       if(item.hasOwnProperty("extend_data")){
         if(typeof item.extend_data == 'string'){
           item.extend_data = JSON.parse(item.extend_data);
         }
       }
       if(item.hasOwnProperty('children')){
         item.children = this.setReqData(item.children);
       }
       return item;
     })
    },
    saveAjax(){
      let that = this;
      let uData = Object.assign({},this.interForm)
      uData.version_id = this.curVersion;
      delete uData.id;
      uData.platforms = this.interForm.platforms.join(',');
      uData.params = JSON.stringify(this.$refs.reqTree.treeData);
      uData.responses =  JSON.stringify(this.$refs.resTree.treeData);

      this.$http.post(REQUEST_PATH+'projects/versions/interfaces/add',uData)
      .then(function(res){
        if(res.data.code === 0){
          let data = res.data.result;
          data.addable = false;
          data.editable = false;
          data.deletable = true;
          data.leaf = true;

          if(!that.curGroupData.hasOwnProperty('children')){
            that.$set( that.curGroupData, 'children', []);
          }
          that.curGroupData.children.push(data);
          that.curGroupData.count = that.curGroupData.count+1;
          that.$refs.navTree.updateKeyChildren(that.curGroupData.id,that.curGroupData.children);
             
          let msg =  res.data.message || '接口添加成功!';
          that.$message.success(msg);
          that.interfaceFlag = false;
        }else{
          let msg =  res.data.message || '接口添加失败!';
          that.$message.error(msg);
        }
      })
      .catch(function(err){
        console.log(err);
      });
    },
    // tree节点点击事件
    paramTreeNodeClick(data){
      this.curResNodeData = data;

      this.typeData = [];
      if(data.extend_data){
        let tdata = JSON.parse(data.extend_data);
        if(tdata){         
          tdata.map(item=>{
            this.typeData.push(item);
          })
        }      
      }    
    },
    changeExtend(data){
      data = data.map(item=>{
        delete item.backFlag;
        delete item.id;
        return item;
      });
      this.curResNodeData.extend_data = JSON.stringify(data);
    },
    singleTest(){
      this.$router.push('/singleTest/'+this.curInterfaceData.id);
    },
    // 数据结构
    addParamTreeNodeClick(data){
      this.curAddResNodeData = data;

      this.addTypeData = [];
      if(data.hasOwnProperty('extend_data')){
        let tdata = null;
        if(typeof data.extend_data == 'string'){
          tdata = JSON.parse(data.extend_data)
          if(typeof tdata == 'string'){
            tdata = JSON.parse(tdata);
          }
        }
        if(tdata){
          tdata.map(item=>{
            this.addTypeData.push(item);
          })
        }
      }    
    },
    addChangeExtend(data){
      data = data.map(item=>{
        delete item.backFlag;
        delete item.id;
        return item;
      });
      if(this.curAddResNodeData){
        this.curAddResNodeData.extend_data = JSON.stringify(data);
      }      
    },
    // 添加
    addStructNo(){
      this.addStructFlag = false;
    },
    addStructOk(){
      let data = {
        content: JSON.stringify(this.$refs.addResTree.treeData),
        name:this.addStructForm.name,
        description:this.addStructForm.remark,
      }
      if(this.addOrEditStruct == 'add'){
        data.version_id = this.curVersion;       
        this.addStructAjax(data);
      }else{
        data.id = this.curEditData.id;
        this.editStructAjax(data);
      }    
      
    },
    addStructAjax(data){
      let that = this;      
      this.$http.post(REQUEST_PATH+'projects/versions/structs/add',data)
      .then(function(res){
        if(res.data.code === 0){
          let data = res.data.result;
          data.addable = false;
          data.editable = true;
          data.deletable = true;
          data.leaf = true;
          data.type = 'struct';
          // that.treeData[0].children.push(data);

          if(! that.treeData[0].hasOwnProperty('children')){
            that.$set( that.treeData[0], 'children', []);
          }
          that.treeData[0].children.push(data);
          that.$refs.navTree.updateKeyChildren(that.treeData[0].id,that.treeData[0].children);
             
          let msg =  res.data.message || '接口添加成功!';
          that.$message.success(msg);
          that.addStructFlag = false;
        }else{
          let msg =  res.data.message || '接口添加失败!';
          that.$message.error(msg);
        }
      })
      .catch(function(err){
        console.log(err);
      });
    },
    editStructAjax(data){
      let that = this;      
      this.$http.post(REQUEST_PATH+'projects/versions/structs/edit',data)
      .then(function(res){
        if(res.data.code === 0){
          let data = res.data.result;
          // that.$refs.navTree.updateKeyChildren(that.treeData[0].id,that.treeData[0].children);
          that.curEditData.name = that.addStructForm.name;
          that.curEditData.description = that.addStructForm.remark;
          that.curEditData.content = JSON.stringify(that.$refs.addResTree.treeData);

          let msg =  res.data.message || '修改成功!';
          that.$message.success(msg);
          that.addStructFlag = false;
        }else{
          let msg =  res.data.message || '修改失败!';
          that.$message.error(msg);
        }
      })
      .catch(function(err){
        console.log(err);
      });
      // this.addStructFlag = false;
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .testManager .container{
    top:0px;
    bottom:40px;
  }
  .testManager .el-header{
    background-color:#fff;
    height:50px!important;
    position:relative;
    line-height:30px;
  }
  #toolbar{
    padding-top:5px;
    padding-bottom:none;
  }
  .testSearch{
    border-bottom:none;
  }
  .interface .inter-title{
    margin-bottom:20px;
  }
  .interface .inter-title h2{
    border-bottom:1px solid #eee;
    padding-bottom:10px;
  }
  .interface .inter-form{
    max-width:900px;
  }
  .interface .tree-table{
    margin-bottom:30px;
  }
  .testManager .tree-container{
    padding-left:5px;
    overflow:hidden;
    overflow-y:auto;
  }
  .reqtype-title{
    padding-bottom:15px;    
  }
  .addStruct-bottom{
    height:300px;
    overflow:hidden;
    overflow-y:auto;
  }
</style>
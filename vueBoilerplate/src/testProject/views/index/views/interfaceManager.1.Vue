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
            <el-aside width="450px">
              <div class="tree-container">
                  <div style="text-align:center;color:#999;margin-top:50px" v-if="treeData.length<=0">
                      暂无数据
                  </div>
                  <el-tree v-else lazy 
                  :render-content="renderContent" 
                  :load="loadNode" 
                  :props="defaultProps"
                  :expand-on-click-node="false"></el-tree>
              </div>                
            </el-aside>
            <el-main  style="padding-bottom:0;padding-top:0;">
               <div class="interface">
                 <div class="inter-title">
                    <h2>接口信息</h2>
                 </div>                  
                  <div class="inter-form">
                      <el-form ref="interForm" :model="interForm" label-width="90px" size="mini">
                          <el-form-item label="接口名称">
                            <el-input v-model="interForm.name"></el-input>
                          </el-form-item>
                          <el-form-item label="请求url">
                            <el-input v-model="interForm.url" ></el-input>
                          </el-form-item>
                          <el-row>
                              <el-col :span="12">
                                  <el-form-item label="所属分组">
                                      <el-select v-model="interForm.group"  style="width:100%" placeholder="请选择分组">
                                        <el-option v-for="item in groupArr" :label="item.name" :key="item.id" value="item.id"></el-option>
                                      </el-select>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                  <el-form-item label="请求方式">
                                      <el-select v-model="interForm.method" style="width:100%" placeholder="请选择请求方式">
                                        <el-option label="Post" value="post"></el-option>
                                        <el-option label="Get" value="get"></el-option>
                                      </el-select>
                                  </el-form-item>
                              </el-col>
                          </el-row>                        
                          
                          <el-form-item label="支持平台">
                              <el-select v-model="interForm.plat" style="width:100%" multiple  placeholder="请选择请求方式">
                                <el-option label="android" value="a"></el-option>
                                <el-option label="iphone" value="i"></el-option>
                              </el-select>
                          </el-form-item>
                          <el-form-item label="描述">
                              <el-input type="textarea" v-model="interForm.desc"></el-input>
                          </el-form-item>
                      </el-form>
                  </div>
                  <div>
                    <template>
                      <el-tabs  type="card" v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="请求参数" name="req">
                          请求参数
                        </el-tab-pane>
                        <el-tab-pane label="请求响应" name="res">
                          请求响应
                        </el-tab-pane>
                      </el-tabs>
                    </template>
                  </div>
               </div>
                
            </el-main>
          </el-container>
      
      
      <el-dialog title="添加应用" :visible.sync="addFlag">
          <el-form :model="addFrom">
            <el-form-item label="名称" :label-width="formLabelWidth">
              <el-input v-model="addFrom.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述" :label-width="formLabelWidth">
                <el-input v-model="addFrom.desc" auto-complete="off"></el-input>
              </el-form-item>
            <el-form-item label="headers" :label-width="formLabelWidth">
              <el-input type="textarea" :rows="5" v-model="addFrom.headers"></el-input>
            </el-form-item>
            <el-form-item label="参数" :label-width="formLabelWidth">
              <el-input type="textarea" :rows="5" v-model="addFrom.params"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addNo">取 消</el-button>
            <el-button type="primary" @click="addOk">确 定</el-button>
          </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
  let id = 1000;
export default {
  name: 'HelloWorld',
  data () {

    return {
      proData:[],
      verData:[],
      curVersion:'',
      groupArr:[],
      curPro:'',
      // 接口信息
      interForm:{
        name:'',
        url:'',
        group:'',
        method:'',
        plat:'',
        desc:''
      },
      currentRow:'',
      // 添加弹框
      formLabelWidth:'80px',
      addFlag:false,
      addFrom:{
        name:'',
        desc:'',
        headers:'',
        params:'',
      },      
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
        label: 'name'
      },
      // 参数
      activeName:'req',

    } 
  },
  created(){
    // 请求表格数据
    this.getProData();
  },
  mounted(){
  },
  methods:{
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
      let that = this;
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
      this.getGroup(ver);
    },
    getGroup(id){
      let that = this;
      this.$http.get(REQUEST_PATH+'projects/versions/groups/list', {
        params: {
          version_id:id,
        }
      }).then(function (res) {
        // console.log('group...');
        if(res.data.code === 0){
           let data = res.data.result;
           that.groupArr =[];
           let arr = [];
           arr = data.map(item=>{
             that.groupArr.push(item);
             item.addable = true;
             return item;
           })
          //  console.log(arr);
           that.treeData = arr.splice(0);
          //  console.log(that.treeData);
        }else{
          let msg =  res.data.message || '获取接口失败';
          this.$message.error(msg);
        }
      }).catch(function (error) {
        console.log(error);
      });
    },      
    // 添加
    addNo(){
      this.addFlag = false;
    },
    addOk(){
      this.addFlag = false;
    },
    // 树
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.treeData);
      }
      if (node.level > 2) return resolve([]);
      let id = node.data.id;
      let verId = node.data.version_id;
      this.getChildrenNode(id,verId,resolve);
    },    
    getChildrenNode(id,verId,resolve){
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
             item.editable = true;
             item.deletable = true;
             return item;
           })
           resolve(data);
        }else{
          let msg =  res.data.message || '获取版本失败';
          this.$message.error(msg);
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    renderContent(h, { node, data, store }) {
      // console.log('node');
      // console.log(node);
      // console.log(data);
        return (
          <span style="flex: 1; display: flex; align-items: center;flex-start: ; font-size: 14px;">
            <span style="padding-right:15px;">
              <span>{node.label+'('+data.count+')'}</span>
            </span>
            <span>              
              { data.addable ? <el-button size="mini" style="font-size: 12px;color:#666;" icon="el-icon-plus" type="text" on-click={ () => this.append(data) }></el-button> : ''}
              { data.editable ? <el-button size="mini" style="font-size: 12px;color:#666;" icon="el-icon-edit" type="text" on-click={ () => this.edit(data) }></el-button> : ''}
              { data.deletable ? <el-button size="mini" style="font-size: 12px;color:#666;" icon="el-icon-delete" type="text" on-click={ () => this.remove(node, data) }></el-button>: ''}
            </span>
          </span>);
    },
    append(data){
      console.log('append...');
    },
    edit(data){
      console.log('edit...');
    },
    remove(node,data){
      console.log('del...');
    },
    // 参数配置
    handleClick(tab, event) {
      // 标签切换事件
      // console.log(tab, event);
    }
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
</style>
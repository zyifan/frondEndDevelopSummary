<template>
  <div class="testManager viewReport">
    <div>
        <el-form ref="singleForm" :inline="true" size="mini" :model="singleForm" :rules="singleFormRule" class="demo-form-inline">           
            <el-form-item label="平台" prop="platform_id">
              <el-select  @change="confChange" v-model="singleForm.platform_id" placeholder="活动区域">
                  <el-option v-for="item,index in platArr" :key="index" :label="item.type" :value="item.id"></el-option>          
              </el-select>
            </el-form-item>
            <el-form-item label="设备" prop="device_id">
              <el-select v-model="singleForm.device_id" placeholder="活动区域">
                  <el-option v-for="item,index in deviceArr" :key="index" :label="item.name" :value="item.id"></el-option>          
              </el-select>
            </el-form-item>      
            <el-form-item label="环境" prop="env_id">
              <el-select v-model="singleForm.env_id" placeholder="活动区域">
                  <el-option v-for="item,index in envArr" :key="index":label="item.name" :value="item.id"></el-option>        
              </el-select>
            </el-form-item>      
            <el-form-item label="配置" prop="config_id">
              <el-select v-model="singleForm.config_id" placeholder="活动区域">
                  <el-option v-for="item,index in configArr" :key="index":label="item.name" :value="item.id"></el-option>          
              </el-select>
            </el-form-item>
            <el-form-item label-width="0">
               <el-button @click="testSingle">测试</el-button>
            </el-form-item>
          </el-form>
    </div>
    <div class="vrCard">
        <div class="vrCard-title" style="margin-bottom:20px;">
          <h3>上下文参数</h3>
        </div>
        <div class="vrCard-body" style="overflow-y:auto;">      
            <Treetable :disType="true" :disParams="true" :data="resTreeData" ref="resTree"></Treetable>     
        </div>
    </div>
    <div class="vrCard">
        <div class="vrCard-title" style="margin-bottom:20px;">
          <h3>参数</h3>
        </div>
        <div class="vrCard-body" style="overflow-y:auto;">
            <Treetable :disName="true" :disType="true" :disParams="true"  :disTool="false" :data="reqTreeData" ref="reqTree"></Treetable> 
        </div>
    </div>
    <div class="vrCard" style="height:500px;">
        <div class="vrCard-title">
          <h3>测试结果</h3>
        </div>
        <div class="vrCard-body">
          <el-tabs v-model="activeName2" v-loading="loadNodeDetail">
              <el-tab-pane label="headers" name="first">
                <div class="tabmain">
                    <div v-show="!!curNodeDetail">
                        <h4>General</h4>
                        <div class="nodedetail-txt" v-html="curNodeDetail? htmlStringify(curNodeDetail.general):''"></div>
                    </div>
                    <div v-show="!!curNodeDetail">
                        <h4>Responses Headers</h4>
                        <div class="nodedetail-txt" v-html="curNodeDetail? htmlStringify(curNodeDetail.response.headers):''"></div>
                    </div>
                    <div v-show="!!curNodeDetail">
                        <h4>Request Headers</h4>
                        <div class="nodedetail-txt" v-html="curNodeDetail? htmlStringify(curNodeDetail.response.request.headers):''"></div>
                    </div>
                    <div v-show="!!curNodeDetail">
                        <h4>Form Data</h4>
                        <div class="nodedetail-txt" v-html="curNodeDetail? htmlStringify(curNodeDetail.form):''"></div>
                    </div>
                </div>              
               
              </el-tab-pane>
              <el-tab-pane label="响应数据" name="second">
                  <div class="tabmain">
                    <div v-show="!!curNodeDetail">
                        <div class="nodedetail-txt" v-text="curNodeDetail? htmlStringify(curNodeDetail.response.body):''"></div>                     
                    </div>
                  </div>
              </el-tab-pane>
              <el-tab-pane label="上下文参数" name="third">
                  <div class="tabmain">
                    <div v-show="!!curNodeDetail">
                        <div class="nodedetail-txt" v-html="curNodeDetail? htmlStringify(curNodeDetail.context):''"></div>
                    </div>
                  </div>
              </el-tab-pane>
              <el-tab-pane label="日志" name="fourth">
                  <div class="tabmain">
                    <div v-show="curNodeDetail">
                      <div v-if="curNodeDetail && curNodeDetail.logArr">
                          <span style="color:#5a5e66;">请选择错误类别：</span><el-select  size="mini" v-model="chklog" placeholder="请选择" style="margin-bottom:15px;">
                              <el-option
                                v-for="item in curNodeDetail.logArr"
                                :key="item.name"
                                :label="item.name"
                                :value="item.name">
                              </el-option>
                            </el-select>
                      </div>
                       
                          <div v-if="chklog && curNodeDetail.logObj[chklog]">
                            <div v-for="item,index in curNodeDetail.logObj[chklog]" :key="index" class="nodedetail-txt" v-html="htmlStringify(item)"></div>
                          </div>
                    </div>
                  </div>
                     
              </el-tab-pane>
            </el-tabs>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {   
    return {
      treeData: [{name:"测试用例",id:-999,children:[]}],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      activeName2: 'first',
      singleId:'',
      detailData:{},
      defaultKeyArr:[-999],
      curNodeDetail:'',
      chklog:'',
      loadNodeDetail:false,
      // 基础参数
      projectid:'',
      versionId:'',
      platArr:[],
      deviceArr:[],
      envArr:[],
      configArr:[],
      singleForm:{
        platform_id:'',
        device_id:'',
        env_id:'',
        config_id:''
      },
      singleFormRule:{
        'platform_id':[
          {required:true,type:'number',message:'请选择平台',trigger:'change'}
        ],
        'device_id':[
          {required:true,type:'number',message:'请选择平台',trigger:'change'}
        ],
        'env_id':[
          {required:true,type:'number',message:'请选择平台',trigger:'change'}
        ],
        'config_id':[
          {required:true,type:'number',message:'请选择平台',trigger:'change'}
        ]
      },
      resTreeData:[{
        id:0,
        name:'did',
        param_type:'header',
        type:'string',
        value:'7253',
        description:'设备id',
        add_time:''
      },{
        id:1,
        name:'secretkey',
        param_type:'header',
        type:'string',
        value:'fff',
        description:'通信秘钥',
        add_time:''
      },{
        id:2,
        name:'token',
        type:'string',
        param_type:'header',
        value:'fff',
        description:'此参数为通过服务端返回的Token.如果没有返回可以不带',
        add_time:''
      },{
        id:3,
        name:'userguid',
        type:'string',
        value:'fff',
        param_type:'header',
        description:'用户登陆后返回的userguid，没有则不填',
        add_time:''
      }],
      reqTreeData:[]
    } 
  },
  created(){
    this.singleId = this.$route.params.id;
    this.getDetail(this.viewId);
    this.getAllConfig();
  },
  mounted(){
   this.resTreeData = this.resTreeData.map(item=>{
     item.add_time = this.$util.coverDate(new Date());
     return item;
   })
  },
  methods:{    
    testSingle(){
      console.log('test...');
      this.$refs.singleForm.validate((valid)=>{
        if(valid){
          this.testSingleAjax();
        }
      });
    },
    testSingleAjax(){
      let that = this;
      let uData = Object.assign({},this.singleForm);
      uData.id = this.singleId;
      uData.params = JSON.stringify(this.$refs.reqTree.treeData);
      uData.context_params = JSON.stringify(this.$refs.resTree.treeData);
      this.$http.post(REQUEST_PATH+'projects/versions/interfaces/test',uData)
      .then(function(res){
        if(res.data.code === 0){
          console.log('res...');
          let data= res.data.result;  
          if(data){
              data.context = JSON.parse(data.context);
              data.interface_info = JSON.parse(data.interface_info);
              data.logs = JSON.parse(data.logs);
              data.response = JSON.parse(data.response);
              data.general = {
                'Request URL':data.response.request.uri.href,
                'Request Method':data.response.request.method,
                'Status Code':data.response.statusCode
              }
             data.logObj = {
               'debug':[],
               'info':[],
               'warning':[],
               'error':[]
             }
             data.logs.map(item=>{
               data.logObj[item.level].push(item);
             });
             data.logArr = [];
             for(let val in data.logObj){
              data.logArr.push({
                name:val
              })
             }
          }
          console.log(data);
          that.curNodeDetail = data;
        }else{
          let msg =  res.data.message || '操作失败!';
          that.$message.error(msg);
        }
      })
      .catch(function(err){
        console.log(err);
      });
    },
    htmlStringify(obj) {
        var objStr = JSON.stringify(obj, null, 4);
        var html = objStr.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;');
        return html
    },
    getDetail(viewId){
      let that = this;
      this.$http.get(REQUEST_PATH+'projects/versions/interfaces/info',{
        params:{
          id:this.singleId
        }
      })
      .then(function(res){
        if(res.data.code === 0){
         let data = res.data.result;        
         data.params = JSON.parse(data.params);
         data.responses = JSON.parse(data.responses);
         that.projectid = data.project_id;
         that.reqTreeData = [];
        //  data.params.map(item=>{
        //    that.reqTreeData.push(item);
        //  })
         that.getParams(data.input_params);
         console.log('detail...');         
         console.log(data);
         that.getAllPlat();
         that.getAllEnv();
        }else{
          let msg =  res.data.message || '操作失败!';
          that.$message.error(msg);
        }
      })
      .catch(function(err){
        console.log(err);
      });
    },
    getParams(obj){     
      // let reg = /^(###)(.*)(###)$/im;
      // arr.map(item=>{
      //   if(reg.test(item.value)){
      //     item.name = item.value.replace(reg,function(){return arguments[2]});
      //     item.value = '';
      //     this.reqTreeData.push(item);
      //   }
      //   if(item.hasOwnProperty('children')){
      //     this.getParams(item.children);
      //   }
      // })
        for(var key in obj){
          this.reqTreeData.push(obj[key]);
        }
    },
    // 获取平台
    getAllPlat(){
      // device = android/iphone
      let that = this;      
      this.$http.get(REQUEST_PATH+'projects/platforms/list_all', {
        params: {
          project_id:this.projectid
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
    // 获取设备
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
     // 获取环境
     getAllEnv(){
      let that = this;      
      this.$http.get(REQUEST_PATH+'projects/envs/list_all', {
        params: {
          project_id:this.projectid
        }
      }).then(function (res) {
        if(res.data.code === 0){           
          that.envArr = [];
          that.envArr = res.data.result.splice(0);
        }else{
          let msg =  res.data.message || '获取环境失败';
          this.$message.error(msg);
        }
      }).catch(function (error) {
        console.log(error);
      });
    },   
    // 获取配置
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
    getDetailfff(viewId){
      let that = this;
      this.$http.post(REQUEST_PATH+'tasks/reports/info',{id:viewId})
      .then(function(res){
        if(res.data.code === 0){
         
        }else{
          let msg =  res.data.message || '操作失败!';
          that.$message.error(msg);
        }
      })
      .catch(function(err){
        console.log(err);
      });
    },
    handleNodeClick(data) {
      // console.log('node click...');
      // console.log(data);
      this.curNodeDetail = '';
      this.chklog = '';
      this.getNodeDetail(data.id);
    },
    getNodeDetail(id){
      let that = this;
      this.loadNodeDetail = true;
      this.$http.get(REQUEST_PATH+'projects/versions/interfaces/info',{
        params:{
         id:this.singleId
        }
      })
      .then(function(res){
        that.loadNodeDetail = false;
        if(res.data.code === 0){

        }else{
          let msg =  res.data.message || '操作失败!';
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
.viewReport{
  overflow:hidden;
  overflow-y:auto;
  padding-right: 13px;
  position: relative;
  left: 0;
  margin-right: -31px;
}
.viewReport .vrCard{
  /* height:50%; */
  height:300px;
  overflow:hidden;
  position:relative;
}
.viewReport .vrCard .vrCard-title{
  padding-bottom:10px;
  border-bottom:1px solid #dfe4ed;
  margin-bottom:10px;
}
.viewReport .vrCard .vrCard-body{
  position:absolute;
  width:100%;
  top:42px;
  bottom:0;
  overflow:hidden;
}
.tabmain{
  padding-bottom:20px;
}
.tabmain .nodedetail-txt{
  word-break: break-all;
  padding:0 10px;
}
</style>

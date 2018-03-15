<template>
  <div class="testManager viewReport">
    <div class="vrCard">
        <div class="vrCard-title" style="margin-bottom:20px;">
          <h3>测试用例</h3>
        </div>
        <div class="vrCard-body" style="overflow-y:auto;">
            <el-tree  
            :render-content="renderTree"
            node-key = "id"   
            default-expand-all
            :expand-on-click-node="false"   
            :data="treeData" 
            :props="defaultProps" 
            @node-click="handleNodeClick"></el-tree>
        </div>
    </div>
    <div class="vrCard">
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
                        <div class="nodedetail-txt" v-html="curNodeDetail? htmlStringify(curNodeDetail.response.body):''"></div>
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
                          <span style="color:#5a5e66;">请选择错误类别：</span>
                          <el-select  size="mini" @change="changeLog" v-model="chklog" placeholder="请选择" style="margin-bottom:15px;">
                              <el-option
                                v-for="item in curNodeDetail.logArr"
                                :key="item.name"
                                :label="item.name"
                                :value="item.name">
                              </el-option>
                            </el-select>
                      </div>
                       
                      <!-- <div v-if="chklog && curNodeDetail.logObj[chklog]">
                        <div v-for="item,index in curNodeDetail.logObj[chklog]" :key="index" class="nodedetail-txt" v-html="htmlStringify(item)"></div>
                      </div> -->

                      <div v-if="chkArr.length>0">
                        <div v-for="item,index in chkArr" :key="index">
                          <template v-if="item.arr.length > 0">
                              <h2 v-text="item.title"></h2>
                              <div v-for="val,key in item.arr" :key="key" class="nodedetail-txt" v-html="htmlStringify(val)"></div>
                          </template>
                        
                        </div>
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
      viewId:'',
      detailData:{},
      defaultKeyArr:[-999],
      curNodeDetail:'',
      chklog:'',
      chkArr:[],
      loadNodeDetail:false,
    } 
  },
  created(){
    this.viewId = this.$route.params.id;
    this.getDetail(this.viewId);
  },
  mounted(){
   
  },
  methods:{    
    htmlStringify(obj) {
        var objStr = JSON.stringify(obj, null, 4);
        var html = objStr.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;');
        return html
    },
    getDetail(viewId){
      let that = this;
      this.$http.post(REQUEST_PATH+'tasks/reports/info',{id:viewId})
      .then(function(res){
        if(res.data.code === 0){
          let data= res.data.result;         
          data.cases_info = JSON.parse(data.cases_info);
          data.config_info = JSON.parse(data.config_info);
          data.device_info = JSON.parse(data.device_info);
          data.platform_info = JSON.parse(data.platform_info);
          data.env_info = JSON.parse(data.env_info);
          data.path = JSON.parse(data.path);
          that.detailData = Object.assign({},data);
          // console.log('detail data...');
          // console.log(that.detailData);
          that.treeData[0].children = data.cases_info;
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
      this.activeName2 = 'first';
      this.curNodeDetail = '';
      this.chklog = '';
      this.chkArr = [];
      this.getNodeDetail(data.id);
    },
    getNodeDetail(id){
      let that = this;
      this.loadNodeDetail = true;
      this.$http.get(REQUEST_PATH+'tasks/reports/item/info',{
        params:{
          report_id:this.viewId,
          case_id:id
        }
      })
      .then(function(res){
        that.loadNodeDetail = false;
        if(res.data.code === 0){
          let rdata= res.data.result;   
          if(!rdata){
            that.curNodeDetail = null;
            return;
          }  
          let data = Object.assign({},rdata);   
          if(data){
              data.context = JSON.parse(data.context);
              data.interface_info = JSON.parse(data.interface_info);
              data.logs = JSON.parse(data.logs);
              data.response = JSON.parse(data.response);
              data.form = JSON.parse(data.form);
              data.general = {
                'Request URL':data.response.request.uri.href,
                'Request Method':data.response.request.method,
                'Status Code':data.response.statusCode
              }
             data.logObj = {
               'error':[],
               'warning':[],
               'info':[],
               'debug':[] 
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
          // console.log(data);
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
    changeLog(val){
      // console.log('val...');
      // console.log(val);      
      let errorVal = this.curNodeDetail.logObj.error;
      let warnVal = this.curNodeDetail.logObj.warning;
      let infoVal = this.curNodeDetail.logObj.info;
      let debugVal = this.curNodeDetail.logObj.debug;

      switch(val){
        case 'debug':{
          this.chkArr = [
            {
              title:'error',
              arr:errorVal,
            },{
              title:'warning',
              arr:warnVal
            },{
              title:'info',
              arr:infoVal
            },{
              title:'debug',
              arr:debugVal
            }
          ]
          break;
        }
        case 'info':{
          this.chkArr = [
            {
              title:'error',
              arr:errorVal,
            },{
              title:'warning',
              arr:warnVal
            },{
              title:'info',
              arr:infoVal
            }
          ]
          break;
        }
        case 'warning':{
          this.chkArr = [
            {
              title:'error',
              arr:errorVal,
            },{
              title:'warning',
              arr:warnVal
            }
          ]
          break;
        }
        case 'error':{
          this.chkArr = [
            {
              title:'error',
              arr:errorVal,
            }
          ]
          break;
        }
        default:{
          this.chkArr = [];
        }
      }
    },
    renderTree(h, { node, data, store }){
      let that = this;
      return (
        <span>
          <span>{node.label}[{data.add_time ? that.$util.coverTime(parseInt(data.add_time)):''}]</span>
        </span>
      );
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.viewReport .vrCard{
  height:50%;
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

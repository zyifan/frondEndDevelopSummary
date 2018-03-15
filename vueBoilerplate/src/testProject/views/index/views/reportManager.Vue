<template>
  <div class="testManager utable-widthauto">
      <div class="testSearch">
        <div class="testSearch-select">
          <el-form :inline="true" :model="subForm" class="demo-form-inline">
            <el-form-item  size="mini" label="项目">
              <el-select @change ="getProId" v-model="subForm.region" placeholder="请选择项目">
                <el-option v-for="item in proData" :label="item.name" :key="item.id" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>      
      </div>
      <div class="spinx" v-loading="tableLoading" style="top:50px;" v-show="tableLoading"></div>  
      <div ref="testContainer" class="container">
          <Utable 
          :columns="tableColumns" 
          :theight="tHeight" 
          :tabledata="tableData">     
          <template slot="operation">
            <el-table-column  label="操作">
                <template slot-scope="scope">                         
                  <el-button
                    size="mini"           
                    type="text"  
                    @click="handleScience(scope.$index, scope.row)">查看报告</el-button>
                    <el-button
                    size="mini"           
                    type="text"  
                    @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
      </template>      
          </Utable>
      </div>     
      <Pagination :total="total" :currentPage="curPage" :pageSize="curSize" @pagesize="changeSize" @curpage="changeCur"></Pagination>
        
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {    
    return {
      tableLoading:false,
      proData:[],
      proId:'',
      tableData: [],//表格数据，现实中需要ajax请求数据
      tHeight:788,
      tableColumns:[
        {prop:'task_name',label:"名称",width:''},
        {prop:'version_name',label:"版本",width:''},
        {prop:'platform_name',label:'平台',width:''},
        {prop:'device_name',label:'设备',width:''},
        {prop:'env_name',label:'环境',width:''},
        {prop:'config_name',label:'配置',width:''},
        {prop:'success',label:'状态',width:''},
        {prop:'start_time',label:'开始时间',width:''},
        {prop:'end_time',label:'结束时间',width:''}
      ],
      // 分页
      total:0,
      curPage:1,
      curSize:20,
      // 查询
      subForm:{
        region:'',
      }
    } 
  },
  created(){
    // 请求表格数据
    this.getProData();
    this.getList();   

  },
  mounted(){
    var that =this;
    that.autoHeight();
    window.onresize=function(){
     that.autoHeight();
    }
  },
  methods:{
    getEncoderArr(){
      let that = this;
      this.$http.get(REQUEST_PATH+'projects/versions/list_all',{
        params:{
          project_id:this.proId
        }
      }).then(function (res) {
        if(res.data.code === 0){
           let data = res.data.result;           
           that.encoderData = data.splice(0);
        }else{
          let msg =  res.data.message || '获取加密方案失败';
          this.$message.error(msg);
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    autoHeight(){
      var container = this.$refs.testContainer;   
      if(container){
        this.tHeight = container.getBoundingClientRect().height;
      }
    },
    getProId(val){
      this.proId = val;
      this.getList();
      // 获取加密方案列表
      this.getEncoderArr();
    },
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
     // 获取列表数据
     getList(){
       if(!this.proId){
         this.$message.warning({message:'请选择项目！',duration:1000});
         return;
       }
      this.tableLoading = true;
      let that = this;
      this.$http.get(REQUEST_PATH+'tasks/reports/list', {
        params: {
          project_id:this.proId,
          page: this.curPage,
          page_size:this.curSize
        }
      }).then(function (res) {
        if(res.data.code === 0){
           let data = res.data.result;
           that.total = data.total;
           let arr = data.rows.map(item=>{
             item.start_time = that.$util.coverDay(item.start_time);
             item.end_time = that.$util.coverDay(item.end_time);
             return item;
           })
           that.tableData = arr.splice(0);
           that.tableLoading = false;
        }else{
          let msg =  res.data.message || '获取数据失败';
          this.$message.error(msg);
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    handleScience(index, row){
      console.log('查看报告');
      this.$router.push('/viewReport/'+row.id);
    },
    handleDel(index, row){
      this.$confirm('确定要删除吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delAjax(row);
        }).catch(() => { });
    },
    delAjax(row){
      let that = this;
      this.$http.post(REQUEST_PATH+'tasks/reports/del',{
       id:row.id
      })
      .then(function(res){
        if(res.data.code === 0){
           that.$message.success('删除成功!');
           that.getList();
        }else{
          let msg =  res.data.message || '删除失败!';
          that.$message.error(msg);
        }
      })
      .catch(function(err){
        console.log(err);
      });
    },
    // 切换分页的size
    changeSize(size){
      this.curSize = size;
      this.getList();
    },
    // 切换分页page
    changeCur(cur){
      this.curPage = cur;
      this.getList();
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .testManager .container{
    top:50px;
    bottom:40px;
  }
  .testSearch{
    border-bottom:none;
  }
</style>

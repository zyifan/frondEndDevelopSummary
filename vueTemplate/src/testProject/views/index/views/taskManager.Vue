<template>
    <div class="testManager">
        <Toolbar 
        :disableDel="!currentRow"  
        :showEdit="false"
        @del="del" @add="add" 
        @refresh="refresh"></Toolbar>
        <div class="spinx" v-loading="tableLoading" style="top:50px;" v-show="tableLoading"></div> 
        <div id="testContainer" ref="testContainer" class="container">
            <Utable 
            @changRow="choiceRow" 
            :columns="tableColumns" 
            :theight="tHeight" 
            :tabledata="tableData">
              <template slot="inbefore">
                    <el-table-column prop="name"  label="名称">
                        <template slot-scope="scope">
                          <el-button
                            size="mini"           
                            type="text"  
                            @click="handleScience(scope.$index, scope.row)">{{scope.row.name}}</el-button>
                        </template>
                      </el-table-column>
              </template>
            </Utable>
        </div> 
        <Pagination :total="total" 
        :currentPage="curPage" 
        :pageSize="curSize" 
        @pagesize="changeSize" 
        @curpage="changeCur"></Pagination>

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
    </div>
  </template>
  
  <script>
  export default {
    name: 'HelloWorld',
    data () {
      return {
        tableLoading:true,
        tableData: [],
        tHeight:788,
        tableColumns:[         
          {prop:'project_name',label:'项目',width:''},
          {prop:'version_name',label:'版本',width:''},
          {prop:'description',label:'描述',width:''},         
          {prop:'add_time',label:'添加时间',width:''}
        ],
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
      }
    },
    created(){     
       // 请求表格数据 
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
      autoHeight(){
        var container = this.$refs.testContainer;   
        if(container){
          this.tHeight = container.getBoundingClientRect().height;
        }
      },
      // 获取列表数据
      getList(){
        this.tableLoading = true;
        let that = this;
        this.$http.get(REQUEST_PATH+'tasks/list', {
          params: {
            page: this.curPage,
            page_size:this.curSize
          }
        }).then(function (res) {
          if(res.data.code === 0){
            let data = res.data.result;
            that.total = data.total;
            let arr = data.rows.map(item=>{
              item.add_time = that.$util.coverDay(item.add_time);
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
      add(){
        console.log('添加');
        // this.addFlag = true;
        this.$router.push('/taskManager/addTask')
      },    
      del(){
        this.$confirm('确定要删除吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delAjax();
        }).catch(() => { });
      },
      delAjax(){
        let that = this;
        let curId = this.currentRow.id;
        this.$http.post(REQUEST_PATH+'tasks/del',{
          id:curId
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
      refresh(){
        //重新加载表格数据
        this.curPage = 1;
        this.curSize = 20;
        this.getList();
      },
      handleScience(index, row){
        console.log('查看报告');
        this.$router.push('/taskManager/taskDetail/'+row.id);
      },
       // 添加
      addNo(){
        this.addFlag = false;
      },
      addOk(){
        this.addFlag = false;
      },
      choiceRow(val){
        this.currentRow = val;
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
      }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
 .testManager .container{
  bottom:40px;
}
  </style>
  
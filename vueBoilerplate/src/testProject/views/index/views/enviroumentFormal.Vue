<template>
  <div class="testManager">
      <div class="managerBread">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">应用列表</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/enviroument/:1' }">[UU跑腿环境]</el-breadcrumb-item>
          <el-breadcrumb-item>[正式环境]</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <Toolbar @add="add" @edit="edit" @del="del" @refresh="refresh"></Toolbar>
      <div id="testContainer" ref="testContainer" class="container">
          <Utable :operation="true" :columns="tableColumns" :theight="tHeight" :tabledata="tableData">
          </Utable>
      </div> 
      <Pagination :total="total" :currentPage="curPage" :pageSize="curSize" @pagesize="changeSize" @curpage="changeCur"></Pagination>
      
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
    const item = {
        date: '2016-05-02',
        from: '王小虎',
        to:'王莉',
        desc: '上海市普陀区金沙江路 1518 弄'
    };
    return {
      msg: 'Welcome to Your Vue.js App',
      tableData: Array(20).fill(item),
      tHeight:788,
      tableColumns:[
        {prop:'from',label:"From",width:''},
        {prop:'to',label:'To',width:''},
        {prop:'desc',label:'地址',width:''},
        {prop:'date',label:'添加时间',width:''}
      ],
      // 添加弹框
      formLabelWidth:'80px',
      addFlag:false,
      addFrom:{
        name:'',
        desc:'',
        headers:'',
        params:'',
      },
      currentRow:'',
       // 分页
       total:0,
      curPage:1,
      curSize:20,
    } 
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
    add(){
      console.log('添加');
      this.addFlag = true;
    },
    edit(){
      console.log('编辑');
      this.addFlag = true;
    },
    del(){
      console.log('删除');
    },
    refresh(){
      console.log('刷新');
      //重新加载表格数据
    },
    handlePlat(index, row){
      console.log('平台');
    },
    handleScience(index, row){
      console.log('环境');
    },
    // 添加
    addNo(){
      this.addFlag = false;
    },
    addOk(){
      this.addFlag = false;
    },
    choiceRow(val){
      console.log('选择行');
      console.log(val);
      this.currentRow = val;
    },
     // 切换分页的size
     changeSize(size){
      console.log('size');
      console.log(size);
      this.curSize = size;
    },
    // 切换分页page
    changeCur(cur){
      console.log('cur');
      console.log(cur);
      this.curPage = cur;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .managerBread{
    padding-bottom:15px;
  }
  .testManager .container{
    top:65px;
    bottom:40px;
  }
</style>

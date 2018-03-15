<template>
  <div class="testManager">
      <div class="testSearch">
        <div class="testSearch-select">
          <el-form :inline="true" :model="subForm" class="demo-form-inline">
            <el-form-item size="mini" label="姓名">
              <el-input v-model="subForm.user" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item  size="mini" label="地区">
              <el-select v-model="subForm.region" placeholder="地区">
                <el-option label="上海" value="shanghai"></el-option>
                <el-option label="北京" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" label="活动时间">
                  <el-date-picker type="date" placeholder="选择日期" v-model="subForm.date1"></el-date-picker>
              </el-form-item>
          </el-form>
        </div>
        <div class="testSearch-btn">
            <el-button
            size="mini"
            type="primary"
            @click="onSubmit">查询</el-button>
        </div>
      </div>
      <Toolbar @add="add" @edit="edit" @del="del" @refresh="refresh"></Toolbar>
      <div id="testContainer" ref="testContainer" class="container">
          <Utable :operation="true" @changRow="choiceRow" :columns="tableColumns" :theight="tHeight" :tabledata="tableData">           
            <template slot="operation">
                <el-table-column  label="操作">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="text"
                        @click="handlePlat(scope.$index, scope.row)">平台</el-button>
                      <el-button
                        size="mini"    
                        type="text"                   
                        @click="handleScience(scope.$index, scope.row)">环境</el-button>
                    </template>
                  </el-table-column>
            </template>
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
    return {
      msg: 'Welcome to Your Vue.js App',
      tableData:[],
      tHeight:788,
      tableColumns:[
        {prop:'name',label:"项目名称",width:''},
        {prop:'desc',label:'描述',width:''},
        {prop:'headers',label:'Headers',width:''},
        {prop:'param',label:'参数',width:''},
        {prop:'date',label:'添加时间',width:''}
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
      // 查询
      subForm:{
        user:'',
        region:'',
        date1:'',
        date2:''
      }
    } 
  },
  created(){
    // 请求表格数据
    console.log('created...');   
    // 注意tableData的item不能使用同一个obj，因为指向同一个地址
    for(var i=0;i<20;i++){
      this.tableData.push({
        name:'王小虎',
        desc:'郑州市二七区',
        headers:'123',
        param:'jjj',
        date:'2017-11-13'
      })
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
      this.tHeight = container.getBoundingClientRect().height;
    },
    // 添加弹框
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
      this.$router.push('/platForm/1')
    },
    handleScience(index, row){
      console.log('环境');
      this.$router.push('/enviroument/1')
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
    },
    // 查询
    onSubmit(){
      console.log('查询');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .testManager .container{
    top:90px;
    bottom:40px;
  }
</style>

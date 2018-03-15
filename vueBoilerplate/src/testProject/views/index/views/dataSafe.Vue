<template>
    <div class="testManager">
        <Toolbar 
          @add="add" 
          :disableEdit="!currentRow" 
          :disableDel="!currentRow" 
          @edit="edit" @del="del"
          @refresh="refresh"
          ></Toolbar>
        <div class="spinx" v-loading="tableLoading" style="top:50px;" v-show="tableLoading"></div>    
        <div id="testContainer" ref="testContainer" class="container">
            <Utable 
              @changRow="choiceRow"  
              :columns="tableColumns" 
              :theight="tHeight" 
              :tabledata="tableData">
            </Utable>
        </div>      
        <Pagination :total="total" :currentPage="curPage" :pageSize="curSize" @pagesize="changeSize" @curpage="changeCur"></Pagination>
        
        <el-dialog title="添加应用" :visible.sync="addFlag">
            <el-form  ref="addForm" :rules="addRules" :model="addForm">
              <el-form-item label="类型" prop="type" :label-width="formLabelWidth">
                  <el-select v-model="addForm.type"  placeholder="请选择类型">
                    <el-option label="decoder" value="decoder"></el-option>
                    <el-option label="encoder" value="encoder"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
                <el-input v-model="addForm.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="描述" prop="description" :label-width="formLabelWidth">
                  <el-input type="textarea" :rows="3" v-model="addForm.description" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="脚本" prop="script" :label-width="formLabelWidth">
                  <el-input type="textarea" :rows="8" v-model="addForm.script" auto-complete="off"></el-input>
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
        tableLoading:false,
        msg: 'Welcome to Your Vue.js App',
        tableData:[],
        tHeight:788,
        tableColumns:[
          {prop:'type',label:"类型",width:''},
          {prop:'name',label:'名称',width:''},
          {prop:'description',label:"描述",width:''},
          {prop:'script',label:'脚本',width:''},
          {prop:'add_time',label:"添加时间",width:''},
        ],
        currentRow:'',
         // 添加弹框
        addOrEdit:'add',
        formLabelWidth:'80px',
        addFlag:false,
        addForm:{
          type:'',
          name:'',
          description:'',
          script:''
        },      
        addRules:{
          type: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ]   
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
        this.tHeight = container.getBoundingClientRect().height;
      },
      // 获取列表数据
      getList(){
        this.tableLoading = true;
        let that = this;
        this.$http.get(REQUEST_PATH+'secures/list', {
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
            this.$Message.error(msg);
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      add(){
        this.addOrEdit = 'add';
        this.addForm = Object.assign({},{
          type:'',
          name:'',
          description:'',
          script:''
        });
        this.addFlag = true;    
      },
      edit(){
        this.addOrEdit = 'edit';
        this.addFlag = true;      
        this.addForm = Object.assign({},{
          type:this.currentRow.type,
          name:this.currentRow.name,
          description: this.currentRow.description,
          script:JSON.parse(this.currentRow.script)
        });
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
        this.$http.post(REQUEST_PATH+'secures/del',{
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
       // 添加
      addNo(){
        this.addFlag = false;
      },
      addOk(){
        this.$refs.addForm.validate((valid) => {
            if (valid) {               
                this.editAjax();        
            }
        });
      },
      editAjax(params){
        let that = this;
        let url = '';
        let uData = {
          type:this.addForm.type,
          name:this.addForm.name,
          description:this.addForm.description,
          script:JSON.stringify(this.addForm.script),
        };
        if(this.addOrEdit == 'add'){
          url=REQUEST_PATH+'secures/add'
        }else{
          url=REQUEST_PATH+'secures/edit'
          uData.id = this.currentRow.id
        }
        this.$http.post(url,uData)
        .then(function(res){
          if(res.data.code === 0){
            that.$message.success('操作成功!');
            that.addFlag = false;
            that.getList();
          }else{
            let msg =  res.data.message || '操作失败!';
            that.$message.error(msg);
          }
        })
        .catch(function(err){
          console.log(err);
        });
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
        this.getList();
      },
      // 切换分页page
      changeCur(cur){
        console.log('cur');
        console.log(cur);
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
  
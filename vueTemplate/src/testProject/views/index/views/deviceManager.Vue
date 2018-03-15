<template>
    <div class="testManager">
        <Toolbar 
        @add="add" 
        :disableEdit="!currentRow" 
        :disableDel="!currentRow" 
        @edit="edit" @del="del" 
        @refresh="refresh"></Toolbar>
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
        <el-dialog  width="1000px" title="添加设备" :visible.sync="addFlag">
            <el-form ref="addForm" :rules="addRules" :model="addForm">
              <el-form-item label="类型" prop="platform_type" :label-width="formLabelWidth">
                  <el-select v-model="addForm.platform_type"  placeholder="请选择类型">
                    <el-option label="android" value="android"></el-option>
                    <el-option label="iphone" value="iphone"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="名称"  prop="name" :label-width="formLabelWidth">
                <el-input v-model="addForm.name" auto-complete="off"></el-input>
              </el-form-item>    
              <el-form-item label="描述"  prop="description" :label-width="formLabelWidth">
                <el-input type="textarea" :rows="3" v-model="addForm.description" auto-complete="off"></el-input>
              </el-form-item>            
            </el-form>
            <Treetable :data="treeData" ref="addTree"></Treetable>
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
        tableData:[],
        tHeight:788,
        tableColumns:[
          {prop:'platform_type',label:"平台",width:''},
          {prop:'name',label:'名称',width:''},
          {prop:'description',label:'描述',width:''},
          {prop:'info',label:"设备信息",width:''},
          {prop:'add_time',label:"添加时间",width:''},
        ],
        currentRow:'',
         // 添加弹框
        addOrEdit:'add',
        formLabelWidth:'50px',
        addFlag:false,
        addForm:{
          platform_type:'',
          name:'',
          description:''
        },
        treeData:[],
        addRules:{
          platform_type: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
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
        this.$http.get(REQUEST_PATH+'devices/list', {
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
        this.addOrEdit = 'add';
        this.addForm.platform_type='';
        this.addForm.name='';
        this.addForm.description = '';      
        this.treeData = [];
        this.addFlag = true;      
      },
      edit(){
        console.log('edit');
        this.addOrEdit = 'edit';
        this.addFlag = true;   
        this.addForm.platform_type = this.currentRow.platform_type;
        this.addForm.name = this.currentRow.name;
        this.addForm.description = this.currentRow.description;
        this.treeData = [];
        if(this.currentRow.info){
          let arr = JSON.parse(this.currentRow.info)
          arr.map(item=>{
            this.treeData.push(item);
            return;
          })
        }
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
        this.$http.post(REQUEST_PATH+'devices/del',{
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
        let params = this.$refs.addTree.treeData;
        this.$refs.addForm.validate((valid) => {
            if (valid) {  
              if(this.addOrEdit == 'add'){
                this.addAjax(JSON.stringify(params));
              }else{
                this.editAjax(JSON.stringify(params));
              }            
            }
        });
      },
      editAjax(params){
        let that = this;
        this.$http.post(REQUEST_PATH+'devices/edit',{
          id:this.currentRow.id,
          name:this.addForm.name,
          description:this.addForm.description,
          info:params,
        })
        .then(function(res){
          if(res.data.code === 0){
            that.$message.success('编辑成功!');
            that.addFlag = false;
            that.getList();
          }else{
            let msg =  res.data.message || '编辑失败!';
            that.$message.error(msg);
          }
        })
        .catch(function(err){
          console.log(err);
        });
      },
      addAjax(params){
        let that = this;
        this.$http.post(REQUEST_PATH+'devices/add',{
          platform_type:this.addForm.platform_type,
          name:this.addForm.name,
          description:this.addForm.description,
          info:params,
        })
        .then(function(res){
          if(res.data.code === 0){
            that.$message.success('添加成功!');
            that.addFlag = false;
            that.getList();
          }else{
            let msg =  res.data.message || '添加失败!';
            that.$message.error(msg);
          }
        })
        .catch(function(err){
          console.log(err);
        });
      },
      choiceRow(val){
        // console.log('选择行');
        // console.log(val);
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
    .testManager{
      text-align:left;
      height:100%;
      overflow:hidden;
      position:relative;
    }
    .testManager .container{
      width:100%;
      position:absolute;
      left:0;
      top:40px;
      bottom:0;
      right:0;
    }
  </style>
  
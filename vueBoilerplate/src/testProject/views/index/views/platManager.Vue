<template>
  <div class="testManager">
      <div class="testSearch">
        <div class="testSearch-select">
          <el-form :inline="true" :model="subForm" class="demo-form-inline">
            <el-form-item  size="mini" label="项目">
              <el-select @change ="getProId" v-model="subForm.region" placeholder="请选择项目">
                <el-option v-for="item in proData" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>      
      </div>
      <Toolbar 
        :disableEdit="!currentRow" 
        :disableDel="!currentRow"     
        @add="add"
        @edit="edit" 
        @del="del" 
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
      
      <el-dialog  width="1000px"  title="添加平台" :visible.sync="addFlag">
          <el-form ref="addForm" :rules="addRules" :model="addForm">
            <el-form-item label="类型" prop="type" :label-width="formLabelWidth">
                <el-select v-model="addForm.type"  placeholder="请选择类型">
                  <el-option label="android" value="android"></el-option>
                  <el-option label="iphone" value="iphone"></el-option>
                </el-select>
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
      tableLoading:false,
      proData:[],
      proId:'',
      tableData: [],//表格数据，现实中需要ajax请求数据
      tHeight:788,
      tableColumns:[
        {prop:'type',label:"类型",width:''},
        {prop:'description',label:'描述',width:''},
        {prop:'params',label:'参数',width:''},
        {prop:'add_time',label:'添加时间',width:''}
      ],
      currentRow:'',
      // 添加弹框
      addOrEdit:'add',
      formLabelWidth:'50px',
      addFlag:false,
      addForm:{
        type:'',
        description:''
      },      
      treeData:[],
      addRules:{
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ]
      },
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
    autoHeight(){
      var container = this.$refs.testContainer;   
      if(container){
        this.tHeight = container.getBoundingClientRect().height;
      }
    },
    getProId(val){
      this.proId = val;
      this.getList();
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
      this.$http.get(REQUEST_PATH+'projects/platforms/list', {
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
    // 添加弹框
    add(){
      // console.log('添加');
      if(!this.proId){this.$message.warning('请先选择项目');return;}
      this.addOrEdit = 'add';
      this.addForm.type='';
      this.addForm.description = '';      
      this.treeData = [];
      this.addFlag = true;      
    },
    edit(){
      // console.log('编辑');
      this.addOrEdit = 'edit';
      this.addFlag = true;      
      this.addForm.type = this.currentRow.type;
      this.addForm.description = this.currentRow.description;
      this.treeData = [];
      if(this.currentRow.params){
        let arr = JSON.parse(this.currentRow.params)    
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
      this.$http.post(REQUEST_PATH+'projects/platforms/del',{
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
      if(!this.proId){ this.$message.warning({message:'请选择项目！',duration:1000});return;}
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
      this.$http.post(REQUEST_PATH+'projects/platforms/edit',{
        id:this.currentRow.id,
        type:this.addForm.type,
        description:this.addForm.description,
        params:params,
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
      this.$http.post(REQUEST_PATH+'projects/platforms/add',{
        project_id:this.proId,
        type:this.addForm.type,
        description:this.addForm.description,
        params:params,
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
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .testManager .container{
    top:90px;
    bottom:40px;
  }
  .testSearch{
    border-bottom:none;
  }
</style>

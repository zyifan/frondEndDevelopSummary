<template>
  <div class="testManager">     
      <Toolbar
        @add="add" 
        :disableEdit="!currentRow" 
        :disableDel="!currentRow" 
        @edit="edit" @del="del" 
        @refresh="refresh"></Toolbar>
      <div class="spinx" v-loading="tableLoading" style="top:50px;" v-show="tableLoading"></div>  
      <div>
          <div id="testContainer" ref="testContainer" class="container">
              <Utable 
                @changRow="choiceRow" 
                :columns="tableColumns" 
                :theight="tHeight" 
                :tabledata="tableData">     
              </Utable>
          </div>     
          <Pagination 
            :total="total" 
            :currentPage="curPage" 
            :pageSize="curSize" 
            @pagesize="changeSize" 
            @curpage="changeCur"></Pagination>
      </div>
     
      
      <el-dialog width="1000px" title="添加项目" :visible.sync="addFlag">
          <el-form ref="addForm" :rules="addRules"  :model="addForm" label-position="left">
            <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
              <el-input v-model="addForm.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description" :label-width="formLabelWidth">
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
        {prop:'name',label:"应用名称",width:''},
        {prop:'description',label:'描述',width:''},
        {prop:'add_time',label:'添加时间',width:''}
      ],
      currentRow:'',
      // 添加弹框
      addOrEdit:'add',
      formLabelWidth:'50px',
      addFlag:false,
      addForm:{
        name:'',
        description:'',
      },      
      treeData:[],
      addRules:{
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请填写描述', trigger: 'blur' }
        ]
      },
      // 分页
      total:0,
      curPage:1,
      curSize:20
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
      this.$http.get(REQUEST_PATH+'projects/list', {
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
    // 添加弹框
    add(){     
      this.addOrEdit = 'add';
      this.addForm.name='';
      this.addForm.description = '';      
      this.treeData = [];
      this.addFlag = true;      
    },
    edit(){
      // console.log('编辑');
      this.addOrEdit = 'edit';
      this.addFlag = true;      
      this.addForm.name = this.currentRow.name;
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
      this.$http.post(REQUEST_PATH+'projects/del',{
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
            this.editAjax(JSON.stringify(params));                    
          }
      });
    },
    editAjax(params){
      let that = this;
      let url = '';
      let uData = {
        name:this.addForm.name,
        description:this.addForm.description,
        params:params,
      }
      if(this.addOrEdit == 'add'){
        url = REQUEST_PATH+'projects/add'
      }else{
        url = REQUEST_PATH+'projects/edit'
        uData.id = this.currentRow.id;
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
    top:40px;
    bottom:40px;
  }
</style>

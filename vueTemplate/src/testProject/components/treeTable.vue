<template>
    <div id='treeTable'>
        <div class="treetable-btn" v-show="disTool">
            <el-button-group>
                <el-button @click="append" size="mini">添加</el-button>
                <el-button size="mini"  @click="appendChild" :disabled="disableSub">添加子参数</el-button>
                <el-button @click="clearTree" :disabled="treeData.length<=0" size="mini">清空</el-button>
            </el-button-group>
        </div>
        <div class="treetable-tree">
            <div class="treetable-header"> 
                <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                    <span style="display:inline-block;flex:1;">
                        <span style="padding-left:7px">参数名称</span>
                    </span>
                    <span class="treetable-right" :style="{width:treeRWidth+'px'}">
                        <span v-if="showParams" class="treeitem">参数类型</span>
                        <span class="treeitem">数据类型</span>
                        <span v-if="showValue" class="treeitem">值</span>
                        <span v-if="showStruct" class="treeitem">数据结构</span>
                        <span class="treeitem">描述</span>
                        <span  class="treeitem" style="width:150px">添加时间</span>
                        <span  class="treeitem" style="width:80px;border-right:none;">                    
                           操作
                        </span>
                    </span>
                </span>
            </div>
            <div v-if="treeData.length<=0">
              <p style="height:50px;line-height:50px;text-align:center;color:#6f7180;font-size:12px;border-top:1px solid #e6ebf5;">暂无数据</p>
            </div>
            <el-tree v-if="treeData.length > 0"
            node-key="id"
            @node-click="checkNode"
            :data="treeData"
            :props="defaultProps"            
            default-expand-all
            :render-content="renderContent"
            :expand-on-click-node="false"
            :highlight-current = "true"            
            :indent="8">
            </el-tree>
        </div>
           
    </div>
</template>

<script>
  let id = 1000;

  export default {
    props:{
       'data':{
         type:Array,
         default:()=>{
           return []
         }
       },
       'disTool':{
         type:Boolean,
         default:()=>{
           return true
         }
       },
       'disType':{
         type:Boolean,
         default:()=>{
           return false
         }
       },
       'disParams':{
         type:Boolean,
         default:()=>{
           return false
         }
       },
       'showParams':{
         type:Boolean,
         default:()=>{
           return true
         }
       },
       'showValue':{
         type:Boolean,
         default:()=>{
           return true
         }
       },
       'disName':{
         type:Boolean,
         default:()=>{
           return false
         }
       },
       'struct':{
         type:Array,
         default:()=>{
           return [];
         }
       },
       'showStruct':{
         type:Boolean,
         default:()=>{
           return false
         }
       },
       'treeRWidth':{
         type:Number,
         default:()=>{
           return 650
         }
       }
    },
    data() {
      return {
        // 按钮
        disableSub:true,
        // 树
        treeData:[],
        // treeData: [{
        //   id: 1,
        //   name: '一级 1',
        //   param_type:'header',
        //   type:'number',
        //   value:'10',
        //   description:'数值',
        //   add_time:'2017-11-15 10:10:10',
        //   edit:true,
        //   children: [{
        //     id: 4,
        //     name: '二级 1-1',
        //     param_type:'header',
        //     type:'number',
        //     value:'10',
        //     description:'数值',
        //     add_time:'2017-11-15 10:10:10',
        //     edit:true
        //   }]
        // }]
        // }],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        curNode:'',
      }
    },
    created(){   
      // 处理传过来的参数
      if(this.data.length >0){
        let arr = this.setPropTreeData(this.data,true,false);
        this.treeData = arr.splice(0);
      }    
      // console.log('created...');  
    },
    // beforeUpdate () {
    //   console.log('tee before...');
    // },
    // updated () {
    //   console.log('tree updated..');
    // },
    watch:{
      data(cur,old){
        // console.log('watch data...');       
        if(cur.length >0){
          let arr = this.setPropTreeData(cur,true,false);
          this.treeData = arr.splice(0);
        }else{
          this.treeData = [];
        }
        // console.log('watch tree data');
      }
    },
    methods: {
      setPropTreeData(arr,flag,nameflag){    
        return arr.map(item=>{
          item = Object.assign({
            name: 'new',
            param_type:'header',
            type:'number',
            value:'0',
            description:'数值',
            add_time:'2017-11-15 10:10:10',
            edit:true,
            disValue:false,
            booleanFlag:false,            
            showParams:flag,
            disName:nameflag,
          },item);
          item.edit = true;
          if(item.type == 'boolean'){item.booleanFlag = true;}
          if(item.type == 'object' ||　item.type == "array"){item.disValue =  true;item.value=''};
          if(item.hasOwnProperty('children')){
            if(item.type == 'object'){
              item.children = this.setPropTreeData(item.children,false,false);
            }else if(item.type == "array"){
              item.children = this.setPropTreeData(item.children,false,true);
            }else{
              item.children = this.setPropTreeData(item.children,true,true);
            }            
          }
          if(item.hasOwnProperty('extend_data')){
           item.extend_data = JSON.stringify(item.extend_data);
          }          
          if(!this.showParams){
            delete item.param_type;
          }
          if(!this.showValue){
            delete item.value;
          }
          return item;
        })
      },
      clearTree(){
        this.treeData = [];
      },
      append(){     
        this.resetEditFlag(this.treeData,NaN);
        let maxId = 0;
        if(this.treeData.length >0){        
            maxId = this.getMaxId(this.treeData,0);
        }
        let data = this.curNode.data;
        let id = maxId+1;        
        const newChild = {
          id: id,
          name: 'new',
          param_type:'form',
          type:'string',
          value:'',
          description:'数值',
          add_time:this.$util.coverDate(new Date()),
          edit:false,
          disValue:false,
          booleanFlag:false,
          showParams:true,
          disName:false,
          children: [] 
        };   
        if(this.disType){
          newChild.type = 'string';
          newChild.value="";
          newChild.description = '字符';
        }
        this.treeData.push(newChild);
      },
      appendChild() {
        let maxId = 0;
        if(this.treeData.length >0){
          if(!this.curNode){
            this.$message.warning('请选择一个父节点！');
            return;
          }else{
            maxId = this.getMaxId(this.treeData,0);
          }
        }
        // console.log('curnode...');
        // console.log(this.curNode);
        let data = this.curNode.data;
        let id = maxId+1;       
        let newname = 'new' ;
        let disablename = false;
        if(data.type == 'array'){
          disablename = true;
          newname = '';
        }
        const newChild = { 
          id: id,
          name: newname,
          param_type:data.param_type,
          type:'string',
          value:'',
          description:'数值',
          add_time:this.$util.coverDate(new Date()),
          edit:false,
          disValue:false,
          booleanFlag:false,
          showParams:false,
          disName:disablename,
          children: [] 
        };
        if (!data.children) {
          this.$set(data, 'children', []);
        }       
        data.children.push(newChild);
      },
      getMaxId(arr,initId){
        let id = initId;
        arr.map(item=>{
          if(item.id > id){
            id = item.id;
          }
          if(item.hasOwnProperty('children')){
             id = this.getMaxId(item.children,id);
          }          
        })
        return id;
      },
      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
        this.curNode = '';
        // 删除数据时清空类型
        this.$emit('clear',{
          data:data,
          length:this.treeData.length
        });
      },
      edit(data){
        data = Object.assign(data,{edit:false});     
      },
      save(data){        
        data = Object.assign(data,{edit:true});
      },
      changeParams(param){
        // console.log(param);
      },
      changeType(type,data){
        // console.log(type);
        if(type == 'object' ||　type=='array'){//禁用启用添加子参数
          this.disableSub = false;
          data.disValue = true;
          data.value = '';
        }else{
          this.disableSub = true;
          data.disValue = false;
        }
        if(type == 'boolean'){
          data.booleanFlag = true;
          data.value =  'true';
        }else{
          data.booleanFlag = false;
        }
      },
      getSelList(arr){
        let res = [];
        arr.map(item=>{
          res.push(<el-option value={''+item.id} label={item.name}></el-option>);
        })
        return res;
      },
      getStructName(ID){
        let name = '';
        this.struct.map(item=>{
          if(parseInt(ID) == item.id){
            name =  item.name
          }          
        })
        return name;
      },
      renderContent(h, { node, data, store }) { 
        return (
          <span on-dblclick={()=>{this.handleDblclick(data)}} style="flex-grow: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span style="display:inline-block;flex-grow:1;width:0;overflow:hidden;">
              <span style="display:block;overflow: hidden;text-overflow: ellipsis; white-space: nowrap;" v-show={data.edit}>{data.name}</span>
              <span style="vertical-align: super;" v-show={!data.edit}><el-input  disabled={this.disName || data.disName} v-model={data.name} value={data.name}></el-input></span>
            </span>
            <span style={{width:this.treeRWidth+'px'}} class="treetable-right">
                <span v-show={ this.showParams && data.edit} class="treeitem">
                  <span v-show={data.showParams}>{data.param_type}</span>
                  <span v-show={!data.showParams}></span>                  
                </span>
                <span v-show={ this.showParams && !data.edit}>
                    <span  v-show={!data.showParams}><el-input style="width:100px" disabled={true}></el-input></span>
                    <span  v-show={data.showParams}>
                        <el-select  style="width:100px;border:none;" disabled={this.disParams} on-change={(val)=>this.changeParams(val)} value={data.param_type} v-model={data.param_type} placeholder="请选择">
                          <el-option value={'header'} label="header"></el-option>
                          <el-option value={"form"} label="form"></el-option>
                      </el-select>  
                    </span>                                    
                </span>
                <span v-show={data.edit} class="treeitem">{data.type}</span>
                <span v-show={!data.edit}>
                    <el-select style="width:100px;border:none;" disabled={this.disType}  on-change={(val)=>this.changeType(val,data)} value={data.type} v-model={data.type} placeholder="请选择">
                        <el-option value={'string'} label="string"></el-option>                        
                        <el-option value={"number"} label="number"></el-option>
                        <el-option value={"boolean"} label="boolean"></el-option>
                        <el-option value={"object"} label="object"></el-option>
                        <el-option value={"array"} label="array"></el-option>
                    </el-select>
                </span>
                <span v-show={this.showValue && data.edit} class="treeitem">{data.value}</span>
                <span v-show={this.showValue && !data.edit && !data.booleanFlag}><el-input style="width:100px" disabled={data.disValue} v-model={data.value} value={data.value}></el-input></span>
                <span v-show={this.showValue && !data.edit &&　data.booleanFlag}>
                    <el-select style="width:100px;border:none;"  value={data.value} v-model={data.value} placeholder="请选择">
                        <el-option value={'true'} label="true"></el-option>
                        <el-option value={"false"} label="false"></el-option>
                    </el-select>
                </span>
                <span v-show={this.showStruct && data.edit} class="treeitem">{this.getStructName(data.struct)}</span>
                <span v-show={this.showStruct && !data.edit && data.type != 'object' && data.type != 'array'} class="treeitem"></span>
                <span v-show={this.showStruct && !data.edit && (data.type == 'object'|| data.type=="array")}>
                  <el-select style="width:100px;border:none;"  value={data.struct} v-model={data.struct} placeholder="请选择">
                    {this.getSelList(this.struct)}
                  </el-select>
                </span>
                <span v-show={data.edit} class="treeitem">{data.description}</span>
                <span v-show={!data.edit}><el-input style="width:100px" value={data.description} v-model={data.description}></el-input></span>
                <span  class="treeitem" style="width:150px">{data.add_time}</span>
                <span  class="treeitem" style="width:80px;border-right:none;"> 
                    <el-button v-show={!data.edit} style="margin-left:10px;font-size: 12px;" type="text" on-click={ (e) =>{this.save(data)} }>保存</el-button>
                    <el-button v-show={data.edit} style="font-size: 12px;" type="text" on-click={ (e) =>{ this.edit(data) }}>编辑</el-button>
                    <el-button style="font-size: 12px;" type="text" on-click={ (e) => {this.remove(node, data) }}>删除</el-button>
                </span>
            </span>           
          </span>);
      },
      checkNode(data,node,el){
          this.curNode = node;
          this.resetEditFlag(this.treeData,data.id);
          if(data.type == 'object' || data.type == 'array'){//禁用启用添加子参数
            this.disableSub = false;
          }else{
            this.disableSub = true;
          }
          // console.log('nodeclick');
          // console.log(node);
          this.$emit('nodeclick',data);
      },
      resetEditFlag(arr,id){
        arr.map(item=>{ 
            if(item.id !== id){item.edit = true}      
            if(item.hasOwnProperty('children')){
                this.resetEditFlag(item.children,id);
            }    
        })
      },
      handleDblclick(data){
        data.edit = !data.edit;
      }
    }
  };
</script>

<style>
#treeTable{min-width:920px;}
#treeTable .treetable-btn{
    padding-bottom:15px;
}
#treeTable .treeitem{
  display:inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  width:100px;
  height:35px;
  padding:0 8px;
  border-right:1px solid #e6ebf5;
  font-size:14px;
}
#treeTable .treeitem input{
  vertical-align: middle;
}
#treeTable .el-tree{
    border:1px solid #e6ebf5;
    border-bottom:none;
}
#treeTable .el-tree-node__content{
    border-bottom:1px solid #e6ebf5;
    line-height:35px;
    height:35px;
}
#treeTable .treetable-header{
    height:40px;
    line-height:40px;
    border:1px solid #e6ebf5;
    border-bottom:none;
    overflow:hidden;
}
.treetable-right{
    width:650px;
    border-left:1px solid #e6ebf5;
    font-size:0;
}
</style>
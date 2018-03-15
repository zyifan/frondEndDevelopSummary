<template>
    <div id='editTable'>     
        <el-button-group style="margin-bottom:15px;">
            <el-button size="mini" :disabled="disableAdd" @click="add" icon="el-icon-plus">添加</el-button>
            <el-button size="mini" :disabled="cur?false:true" @click="edit" icon="el-icon-edit">修改</el-button>
            <el-button size="mini" :disabled="cur?false:true" @click="del" icon="el-icon-delete">删除</el-button>
        </el-button-group>
        <ul>
            <li  class="flex editTable-head">
                <div class="editTable-left flex-1">Type</div>
                <div class="editTable-right flex-1"> <span class="editTable-right-text">Value</span></div>
            </li>
        </ul>
       <ul  v-if="eData.length > 0">
           <li :class="{'flex':true,'itemback':item.backFlag}"  @click="clickItem(item,index)" v-for="item,index in eData" :key="index">
               <div class="editTable-left flex-1" v-text="item.type"></div>              
               <div class="editTable-right flex-1" v-text="item.value"></div>        
            </li>
       </ul>
        <!-- 新增接口 -->
        <el-dialog  title="新增" width="500px" :visible.sync="addFlag" :append-to-body="appendToBody">
            <div style="height:200px;overflow:hidden;overflow-y:auto;">
                <el-row  style="margin-bottom:15px;">
                    <el-col :span="4">
                        <span>类型：</span>
                    </el-col>
                    <el-col :span="20">
                        <el-select size="mini"  v-model="addSel" placeholder="请选择">
                            <el-option label="Not Null" value="not_null"></el-option>
                            <el-option label="Equals" value="equals"></el-option>
                            <el-option label="脚本" value="script"></el-option>
                        </el-select>
                    </el-col>                  
                </el-row>                
               
                <template v-if="addSel == 'not_null'">
                    <el-row>
                        <el-col :span="4">
                            <span>值：</span>
                        </el-col>
                        <el-col :span="20">
                            <el-select size="mini" v-model="addVal" placeholder="请选择">
                                <el-option label="true" value="true"></el-option>
                                <el-option label="false" value="false"></el-option>
                            </el-select>
                        </el-col>                  
                    </el-row>
                </template>
                <template v-else-if="addSel == 'equals'">
                    <el-row>
                        <el-col :span="4">
                            <span>值：</span>
                        </el-col>
                        <el-col :span="20">
                            <el-input  size="mini" v-model="addVal"></el-input>
                        </el-col>                  
                    </el-row>                    
                </template>
                <template v-else-if="addSel == 'script'">
                    <el-row>
                        <el-col :span="4">
                            <span>值：</span>
                        </el-col>
                        <el-col :span="20">
                            <el-input size="mini" :rows="5"  type="textarea" v-model="addVal"></el-input>
                        </el-col>                  
                    </el-row>                    
                </template>
            </div>
            <div slot="footer" class="dialog-footer">
            <el-button @click="addNo">取消</el-button>
            <el-button @click="addOk" type="primary" >确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'typetable',
    props:{
        'propData':{
            type:Array,
            default:()=>{
                return []
            }
        },
        'disableAdd':{
            type:Boolean,
            default:()=>{
                return true
            }
        } ,
        'appendToBody': {
            type:Boolean,
            default:()=>{
                return false
            }
        }      
    },
    created(){        
        if(this.propData.length>0){
            this.eData = [];
            this.propData.map(item=>{
                let obj = Object.assign({},item);
                obj.id = this.$util.randomID(6); 
                obj.backFlag = false;
                this.eData.push(obj);
            })
        }
    },
    watch:{
        propData:{
            handler:function(cur,old){
                // console.log('watch prodata...');
                // console.log(cur);
                this.eData = [];
                this.cur = '';
                cur.map(item=>{         
                    let obj = Object.assign({},item);
                    obj.id = this.$util.randomID(6); 
                    obj.backFlag = false;
                    this.eData.push(obj);
                })
            },
            deep:true           
        },
        eData:{
            handler:function(cur,old){
                this.$emit('change',cur);
            },
            deep:true
        }
    },
    data() {       
        return {
            eData:[],
            cur:'',
            itemClassFlag:false,
            addSel:'',
            addVal:'',
            addFlag:false,
            addOrEdit:'add'
        }
    },
    methods:{
        judgeBool(val){
            if(typeof val === 'boolean'){
                return true;
            }else{
                return false;
            }
        },
        clickItem(item,index){
            this.eData.map(child=>{
                if(child.id == item.id){return}
                child.backFlag = false;
            })
            item.backFlag = true;
            this.cur = item;
        },
        saveBtn(){
            this.$emit('save',this.eData);
        },
        add(){
            this.addOrEdit = 'add';
            this.addFlag = true;
            this.addSel = '';
            this.addVal = '';
        },
        edit(){
            this.addOrEdit = 'edit';
            this.addSel = this.cur.type;
            this.addVal = this.cur.value;
            this.addFlag = true;
        },
        addNo(){
            this.addFlag = false;
        },
        addOk(){
            if(this.addOrEdit == 'add'){
                this.eData.push({
                    type:this.addSel,
                    value:this.addVal,
                    id:this.$util.randomID(6),
                    backFlag : false
                })
            }else{
               this.cur = Object.assign(this.cur,{
                   type:this.addSel,
                   value:this.addVal
               })               
            }       
            this.cur = '';
            this.addFlag = false;
            // console.log(this.cur);
            // console.log(this.eData);
        },
        del(){
            this.eData.map((item,index)=>{
                if(this.cur.id == item.id){
                    this.eData.splice(index,1);
                    this.cur = '';
                }
            })
        }
    }
}
</script>

<style scoped>
#editTable{
    position:relative;
}    
#editTable ul{
    width:100%;
    border-top:1px dashed #e6ebf5;
}
#editTable ul .editTable-head{
    height:40px;
    line-height:40px;
}
#editTable ul li{
    height:30px;
    line-height:30px;
    font-size:12px;
    cursor:pointer;
}
#editTable ul li .editTable-left{
    border-bottom:1px dashed #e6ebf5;
    border-right:1px dashed #e6ebf5;
}
#editTable ul li .editTable-right{
    border-bottom:1px dashed #e6ebf5;
}
#editTable ul li .editTable-right-text{
    padding-left:5px;
}
#editTable .editTable-save{
    margin-top:15px;
    text-align:right;
}
.itemback{
    background-color:#f0f7ff;
}
</style>
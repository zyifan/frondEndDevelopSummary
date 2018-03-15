<template>
    <div v-if="propData.length > 0" id='editTable'>        
       <ul>
           <li  class="flex editTable-head">
            <div class="editTable-left flex-1">Name</div>
            <div class="editTable-right flex-1"> <span class="editTable-right-text">Value</span></div>
           </li>
           <li class="flex" @click="clickItem(item,index)" v-for="item,index in eData" :key="index">
               <div class="editTable-left flex-1" v-text="item.name"></div>
               <div class="editTable-right flex-1">                  
                    <span v-show="item.editFlag" class="editTable-right-text" v-text="item.value"></span>                   
                    <span v-show="!item.editFlag">
                        <el-input size="mini" v-show="item.select.length<=0" v-model="item.value" placeholder="请输入内容"></el-input>
                        <el-select  size="mini" style="width:100%"  v-show="item.select.length>0" v-model="item.value" placeholder="请选择">
                            <el-option
                                v-for="sel,key in item.select"
                                :key="key"
                                :label="sel.name"
                                :value="sel.name">
                            </el-option>
                        </el-select>
                    </span>                    
                </div>
            </li>
       </ul>
       <!-- <div class="editTable-save">
            <el-button @click="saveBtn" size="mini">保存</el-button>
       </div> -->
    </div>
</template>

<script>
export default {
    name: 'name',
    props:{
        'propData':{
            type:Array,
            default:()=>{
                return []
            }
        }         
    },
    created(){ 
        if(this.propData.length>0){
            this.eData = [];
            this.propData.map(item=>{
                item.editFlag = true;
                this.eData.push(item);
            })
        }
        // console.log('edit table...');
        // console.log(this.eData);
    },
    watch:{
        propData(cur,old){
            this.eData = [];
            cur.map(item=>{
                item.editFlag = true;
                this.eData.push(item);
            })
        }
    },
    data() {       
        return {
            eData:[],
        }
    },
    methods:{
        clickItem(item,index){
            console.log('click li');
            this.hideItemAll(index);
            let obj = {
                editFlag:!this.eData[index].editFlag
            }
            let newObj = Object.assign(this.eData[index],obj)
            this.$set(this.eData,index,newObj);
        },
        hideItemAll(key){
            this.eData.map((item,index)=>{
                if(key && key === index){return}
                if(!item.editFlag){
                    let obj = Object.assign(item,{editFlag:true});
                    this.$set(this.eData,index,obj);
                }               
            })
        },
        saveBtn(){
            this.hideItemAll();
            this.$emit('save',this.eData);
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
</style>
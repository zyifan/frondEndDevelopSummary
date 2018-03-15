<template>
    <div id='utable'>        
        <el-table         
        :border="showborder" 
        ref="utable" 
        :data="tabledata" 
        highlight-current-row 
         @current-change="handleCurrentChange" 
         :height="theight" style="width: auto;">
            <slot name="inbefore"></slot>
            <el-table-column :key="item.prop"
            :property ="item.prop" 
            :label="item.label" 
            :width="item.width||''" 
            :align="item.align || 'left'" 
            v-for="item in columns">
            </el-table-column>     
            <slot name="operation"></slot>
        </el-table>      
    </div>
</template>

<script>
export default {
    name: 'name',
    props:{
        'theight':{
            type:Number,
            default:()=>{
                return 788
            }
        },
        'tabledata':{
            type:Array,
            default:()=>{
                return []
            }
        },
        'columns':{
            type:Array,
            default:()=>{
                return []
            }
        },
        'showborder':{
            type:Boolean,
            default:()=>{
                return false
            }
        }        
    },
    data() {       
        return {
            currentRow:null
        }
    },
    methods:{
        handleCurrentChange(val){
            this.$emit('changRow',val);
        }
    }
}
</script>

<style scoped>
 #utable{
     height:100%;
 }

</style>
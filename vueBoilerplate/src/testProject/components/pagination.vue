<template>
    <div id='pagiNation'>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizeArr"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="total">
        </el-pagination>    
    </div>
</template>

<script>
export default {
    name: 'name',
    props:{
        'currentPage':{
            type:Number,
            default:()=>{
                return 1;
            }
        },
        'pageSizeArr':{
            type:Array,
            default:()=>{
                return [10, 20, 30, 40];
            }
        },
        'pageSize':{
            type:Number,
            default:()=>{
                return 20;
            }
        },
        'total':{
            type:Number,
            default:()=>{
                return 0;
            }
        },
    },
    methods:{
        handleSizeChange(size){
            this.$emit('pagesize',size);
        },
        handleCurrentChange(cur){
            this.$emit('curpage',cur);
        }
    }
}
</script>

<style scoped>
   #pagiNation{
       position:absolute;
       width:100%;
       background-color:#fff;
       bottom:0;
       text-align:right;
   }
</style>
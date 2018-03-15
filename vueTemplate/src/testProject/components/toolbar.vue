<template>
    <div id='toolbar'>
        <el-button-group>
            <el-button :disabled="disableAdd" v-if="showAdd" plain @click="add" size="mini" icon="el-icon-plus">添加</el-button>
            <el-button :disabled="disableEdit" v-if="showEdit"plain @click="edit" size="mini" icon="el-icon-edit">修改</el-button>
            <el-button :disabled="disableDel" v-if="showDel" plain @click="del" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button :disabled="disableCopy" v-if="showCopy" plain @click="copy" size="mini" icon="el-icon-delete">复制</el-button>
            <el-button :disabled="disableRefresh" v-if="showRefresh" plain @click="refresh" size="mini" icon="el-icon-refresh">刷新</el-button>
        </el-button-group>         
    </div>
</template>

<script>
export default {
    name: 'name',
    props:{
        'showAdd':{
            type:Boolean,
            default:()=>{
                return true;
            }
        },
        'showEdit':{
            type:Boolean,
            default:()=>{
                return true;
            }
        },
        'showDel':{
            type:Boolean,
            default:()=>{
                return true;
            }
        },
        'showCopy':{
            type:Boolean,
            default:()=>{
                return false;
            }
        },
        'showRefresh':{
            type:Boolean,
            default:()=>{
                return true;
            }
        },
        'disableAdd':{
            type:Boolean,
            default:()=>{
                return false;
            }
        },
        'disableEdit':{
            type:Boolean,
            default:()=>{
                return false;
            }
        },
        'disableDel':{
            type:Boolean,
            default:()=>{
                return false;
            }
        },
        'disableCopy':{
            type:Boolean,
            default:()=>{
                return false;
            }
        },
        'disableRefresh':{
            type:Boolean,
            default:()=>{
                return false;
            }
        }
    },
    methods:{
        add(){
            this.$emit('add');
        },
        edit(){
            this.$emit('edit');
        },
        del(){
            this.$emit('del');
        },
        copy(){
            this.$emit('copy');
        },
        refresh(){
            this.$emit('refresh');
        }
    }
}
</script>

<style scoped>
    #toolbar{
        width:100%;
        text-align:left;
        padding-bottom:20px;
    }
</style>
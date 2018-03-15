<template>
    <li class="contextItem" v-show="model.show" @click.stop="clickItem(model)">
        <div>           
            <span>{{model.name}}</span>
            <span v-show="model.children && model.children.length>0"><i class="el-icon-caret-right"></i></span>
        </div>
        <ul class="contextItem-subMenu"  v-show="model.children && model.children.length>0">
            <Item @menuclick="outClick" v-for="item,index in model.children" :key="index" :model="item"></Item>
        </ul>
    </li>
</template>

<script>

export default {
    name: 'item',
    props:{
        'model':{//子菜单对象
            type:Object,
            default:()=>{
                return {}
            }
        }       
    }, 
    created(){},
    mounted(){},
    data() {       
        return {}
    },
    methods:{
        // 节点点击事件
        clickItem(val){           
            this.$emit('menuclick',val);                     
        },
        // item组件点击事件
        outClick(val){
            this.$emit('menuclick',val);
        }
    }
}
</script>

<style scoped>
.contextItem{
    padding:0 10px;
}
.contextItem:hover{
    background-color: #f5f7fa;
}
.contextItem:hover > ul.contextItem-subMenu{
    display:block;
}
.contextItem .contextItem-subMenu{
    display:none;
    position:absolute;
    margin-left:-5px;
    left:100%;
    top:12px;
    width:auto;
    background-color:#fff;
    border: 1px solid #dfe4ed;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
</style>
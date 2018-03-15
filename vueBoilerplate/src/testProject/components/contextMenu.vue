<template>
    <div  @mouseleave="hideContext" ref="contextMenu" v-show="showFlag && list.length>0" id='contextMenu'>        
       <ul class="contextMenu-main">
           <Item  @menuclick="menuClick" v-for="item,index in list" :key="index" :model="item"></Item>
       </ul>
    </div>
</template>

<script>
export default {
    name: 'contextmenu',
    props:{
        'show':{//菜单显示状态
            type:Boolean,
            default:()=>{
                return false
            }
        },
        'position':{//菜单坐标位置
            type:Object,
            default:()=>{
                return {
                    x:0,
                    y:0
                }
            }
        },
        'list':{//菜单数据
            type:Array,
            default:()=>{
                return []
            }
        }         
    },
    watch:{
        show:{
            handler:function(cur,old){
                // 处理菜单实时显示状态
                // console.log('watch show...');
                this.showFlag = cur;
            }
        },
        position:{
            handler:function(cur,old){
                // 不能写成箭头函数，监听坐标并实时设置到菜单上
                if(this.$refs.contextMenu){
                    this.$refs.contextMenu.style.left = cur.x +'px';
                    this.$refs.contextMenu.style.top = cur.y + 'px';
                }
            },
            deep:true
        }
    },
    created(){
        this.showFlag = this.show;       
    },
    mounted(){
        // 设置菜单位置
        if(this.$refs.contextMenu){
            this.$refs.contextMenu.style.left = this.position.x +'px';
            this.$refs.contextMenu.style.top = this.position.y + 'px';
        }       
    },
    data() {       
        return {
            showFlag:false,
        }
    },
    methods:{
        // 接收处理菜单点击事件
        menuClick(val){
            if(!val.hasOwnProperty('children') || val.children.length <= 0){
                this.showFlag = false;
                this.$emit('close',val);
            }
        },
        hideContext(){
            this.$emit('leave')
        }
    }
}
</script>

<style scoped>
#contextMenu{
    position: fixed;
    z-index:100;
    top:0;
    left:0;
    /* width:100px; */
    /* height:500px; */
    background-color:#fff;
    border: 1px solid #dfe4ed;
    border-radius: 4px;
    background-color: #fff;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #5a5e66;
    font-size:12px;
    line-height:30px;
}
#contextMenu li{
    min-width:100px;
    position:relative;
    height:30px;
    white-space: nowrap;
    cursor:pointer;
    padding:0 10px;
}
</style>
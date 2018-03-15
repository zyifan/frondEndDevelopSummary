<template>
    <div id='id'>
        <el-tree node-key="id" ref="tree" :data="data" :props="defaultProps" :render-content="renderContent" @node-click="handleNodeClick" default-expand-all :expand-on-click-node="false"></el-tree>
    </div>
</template>

<script>
export default {
    name: 'name',
    data() {
      return {
        data: [{
          label: '一级 1',
          id:1,
          children: [{
            label: '二级 1-1',
            id:11,
            children: [{
              label: '三级 1-1-1',
              id:111,
            }]
          }]
        }, {
          label: '一级 2',
          id:2,
          children: [{
            label: '二级 2-1',
            id:21,
            children: [{
              label: '三级 2-1-1',
              id:211,
            }]
          }, {
            label: '二级 2-2',
            id:22,
            children: [{
              label: '三级 2-2-1',
              id:221,
            }]
          }]
        }, {
          label: '一级 3',
          id:3,
          children: [{
            label: '二级 3-1',
            id:31,
            children: [{
              label: '三级 3-1-1',
              id:311,
            }]
          }, {
            label: '二级 3-2',
            id:32,
            children: [{
              label: '三级 3-2-1',
              id:321,
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dragNode:'',
      }
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
      },
      renderContent(h, { node, data, store }) {
        return (
            //drag <span draggable="true" on-dragover={(e)=>{e.preventDefault();}} on-drop={(e)=>{this.drop(data,node,e)}} on-dragstart={(e)=>this.dragStart(data,node,e)}  style="font-size: 14px; padding-right: 8px;">
          <span style="font-size: 14px; padding-right: 8px;">
              <span  on-dblclick={(e)=>{this.dbClick(data,node)}}>{node.label}</span>           
          </span>);
      },
      dbClick(data,node){
          console.log('double click...');
          console.log(data);
      },
      dragStart(data,node,e){
          console.log('dragstart...');
          this.dragNode = data;
      },
      drop(data,node,e){
        console.log('drop....');
        console.log(this.dragNode);
        console.log(data)
        if(this.dragNode.id == data.id){return;}
        this.delTreeNode(this.data,this.dragNode.id);
        // this.addTreeNode(data,this.dragNode);
        if(!data.hasOwnProperty('children')){
            this.$set(data,'children',[]);
        }
        data.children.push(this.dragNode);
        this.$refs.tree.updateKeyChildren(data.id,data.children);
      },
      addTreeNode(parent,child){
        if(!parent.hasOwnProperty('children')){
            this.$set(parent,'children',[]);
        }
        parent.children.push(child);
        console.log('parent...');
        console.log(parent);
        this.$refs.tree.updateKeyChildren(parent.id,parent.children);
      },
      delTreeNode(arr,id){
        let len = arr.length;
        for(let i = 0;i<len;i++){
            let item = arr[i];
            if(item.id == id){
                arr.splice(i,1);
                return;
            }else{
                if(item.hasOwnProperty('children')){
                    this.delTreeNode(item.children,id);
                }
            }
        }
      }
    }
}
</script>

<style scoped>

</style>
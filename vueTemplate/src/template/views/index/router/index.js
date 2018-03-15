import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '../../../components/HelloWorld'
//  懒加载引入方式， /**/ 注释是定义懒加载的chunkname的名字，方便输出的chunkfile时候分模块。
const HelloWorld = () =>    import ( /* webpackChunkName: "index/chunks" */ '@components/HelloWorld')

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'Hello',
        component: HelloWorld
    }]
})
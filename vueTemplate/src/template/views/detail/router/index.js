import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '../../../components/HelloWorld'

const HelloWorld = () =>
    import ( /* webpackChunkName: "detail/chunks" */ '../../../components/hello')

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'Hello',
        component: HelloWorld
    }]
})
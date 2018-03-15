import Vue from 'vue'
import Router from 'vue-router'
// 接口测试
const proManager = () =>    import ( /* webpackChunkName: "index/chunks" */ '../views/proManager')
const taskManager = () =>    import ( /* webpackChunkName: "index/chunks" */ '../views/taskManager')
const reportManager = () =>    import ( /* webpackChunkName: "index/chunks" */ '../views/reportManager')
const editionManager = () =>    import ( /* webpackChunkName: "index/chunks" */ '../views/editionManager')
const interfaceManager = () =>    import ( /* webpackChunkName: "index/chunks" */ '../views/interfaceManager')
const viewReport = () =>    import ( /* webpackChunkName: "index/chunks" */ '../views/viewReport')
const enviroument = () =>    import ( /* webpackChunkName: "index/chunks" */ '../views/enviroument')
const enviroumentFormal = () =>    import ( /* webpackChunkName: "index/chunks" */ '../views/enviroumentFormal')
const taskDetail = () =>    import ( /* webpackChunkName: "index/chunks" */ '../views/taskDetail')
const taskAdd = () =>    import ( /* webpackChunkName: "index/chunks" */ '../views/addTask')
const singleTest = () =>    import ( /* webpackChunkName: "index/chunks" */ '../views/singleTest')

// 工具管理
const platManager = () =>    import ( /* webpackChunkName: "index/chunks" */ '../views/platManager')
const deviceManager = () =>    import ( /* webpackChunkName: "index/chunks" */ '../views/deviceManager')
const dataSafe = () =>    import ( /* webpackChunkName: "index/chunks" */ '../views/dataSafe')
const configManager = () =>    import ( /* webpackChunkName: "index/chunks" */ '../views/configManager')
const enviroumentManager = () =>    import ( /* webpackChunkName: "index/chunks" */ '../views/enviroumentManager')
const help = () =>    import ( /* webpackChunkName: "index/chunks" */ '../views/help')


Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect:'/proManager'
        },
        {
            path: '/proManager',
            name: 'proManager',
            component: proManager
        },
        {
            path: '/taskManager',
            name: 'taskManager',
            component: taskManager
        },
        {
            path: '/reportManager',
            name: 'reportManager',
            component: reportManager
        },
        {
            path: '/editionManager',
            name: 'editionManager',
            component: editionManager
        },
        {
            path: '/interfaceManager',
            name: 'interfaceManager',
            component: interfaceManager
        },
        {
            path: '/singleTest/:id',
            name: 'singleTest',
            component: singleTest
        },
        {
            path: '/platManager',
            name: 'platManager',
            component: platManager
        },
        {
            path: '/deviceManager',
            name: 'deviceManager',
            component: deviceManager
        },
        {
            path: '/dataSafe',
            name: 'dataSafe',
            component: dataSafe
        },
        {
            path: '/configManager',
            name: 'configManager',
            component: configManager
        },
        {
            path: '/enviroumentManager',
            name: 'enviroumentManager',
            component: enviroumentManager
        },
        {
            path: '/help',
            name: 'help',
            component: help
        },
        {
            path: '/viewReport/:id',
            name: 'viewReport',
            component: viewReport
        },
        {
            path: '/enviroument/:id',
            name: 'enviroument',
            component: enviroument
        },
        {
            path: '/enviroument/enviroumentFormal/:id',
            name: 'enviroumentFormal',
            component: enviroumentFormal
        },
        {
            path: '/taskManager/taskDetail/:id',
            name: 'taskDetail',
            component: taskDetail
        },
        {
            path: '/taskManager/addTask',
            name: 'taskAdd',
            component: taskAdd
        }
    ]   
})
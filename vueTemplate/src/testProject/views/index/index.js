import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import router from './router'
import 'iview/dist/styles/iview.css';
import '@assets/css/reset.less'
import '@assets/css/common.less'
import VueRouter from 'vue-router';
import toolbar from '@components/toolbar';
import table from '@components/table';
import pagination from '@components/pagination';
import treetable from '@components/treeTable';
import typetable from '@components/typeTable';
import editTable from '@components/editTable';
import Contextmenu from '@components/contextMenu';
import item from '@components/contextItem';
import util from '@assets/js/common.js'

Vue.prototype.$http = axios;
Vue.prototype.$util = util;
Vue.use(ElementUI);


Vue.component('Toolbar',toolbar);
Vue.component('Utable',table);
Vue.component('Pagination',pagination);
Vue.component('Treetable',treetable);
Vue.component('Edittable',editTable);
Vue.component('Typetable',typetable);
Vue.component('Contextmenu',Contextmenu);
Vue.component('Item',item);

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
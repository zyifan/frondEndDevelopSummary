import axios from 'axios';
// import env from '../config/env';
let util = {

};
util.title = function(title) {
    title = title ? title + ' - Home' : 'UU跑腿城市运营后台';
    window.document.title = title;
};
// let baseUrl = 'http://192.168.4.130:8088/ApiTranser'; //chen
// let baseUrl = 'http://192.168.6.99:1018/ApiTranser'; //谢继辉
// let baseUrl = 'http://192.168.6.111:5566/ApiTranser'; //崔长胜
let baseUrl = 'http://admin.uupaotui.com/ApiTranser'; //正式
util.baseUrl = baseUrl;
// 新请求方法
util.post = (obj) => {
    let data = null,
        baseurl = null;
    let host = obj.host || '';
    let mothod = obj.method || 'post';
    if (obj.method === 'get') {
        data = '';
        for (let i in obj.data) {
            if (!obj.data.hasOwnProperty(i)) continue;
            if (data === '') data += i + '=' + obj.data[i];
            else data += '&' + i + '=' + obj.data[i];
        }
        data = encodeURIComponent(data);
        // console.log(data);
    } else {
        data = JSON.stringify(obj.data);
    }
    baseurl = obj.baseUrl || baseUrl;
    axios.post(baseurl, { action: obj.url, dataParams: data, rt: mothod, host: host }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' } })
        .then(res => {
            obj.success ? obj.success(res) : null;
        })
        .catch(error => {
            obj.error ? obj.error(error) : null;
        })
};
util.session = (key, value) => {
    if (typeof value === 'boolean' || typeof value === 'number') {
        sessionStorage.setItem(key, value);
        return;
    }
    if (value) {
        if (typeof value == 'object') {
            value = JSON.stringify(value);
        }
        sessionStorage.setItem(key, value);
        return;
    }
    let session = sessionStorage.getItem(key);
    if (session) {
        try {
            session = JSON.parse(session);
        } catch (e) {
            session = session;
        }
    } else {
        session = null;
    }
    return session;
};
// 格式化时间格式 y-m-d h:m:s
util.coverDate = (date) => {
    if (!date) return '';
    if (typeof date === 'object') {
        date = date;
        if (!date.getFullYear) return '';
        let year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            h = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds();
        month = month > 9 ? month : '0' + month;
        day = day > 9 ? day : '0' + day;
        h = h > 9 ? h : '0' + h;
        m = m > 9 ? m : '0' + m;
        s = s > 9 ? s : '0' + s;
        return year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s;
    }
    if (date.length > 0) {
        date = date.split('.')[0];
        date = Date.parse(date.replace(/-/g, "/").replace('T', ' '));
        date = new Date(date);
        let year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            h = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds();
        month = month > 9 ? month : '0' + month;
        day = day > 9 ? day : '0' + day;
        h = h > 9 ? h : '0' + h;
        m = m > 9 ? m : '0' + m;
        s = s > 9 ? s : '0' + s;
        return year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s;
    }
    return "";
};
// 格式化时间  h:m:s;
util.coverTime = (date) => {
        let day = new Date(date),
            h = day.getHours(),
            m = day.getMinutes(),
            s = day.getSeconds();
        m = m > 9 ? m : '0' + m;
        h = h > 9 ? h : '0' + h;
        s = s > 9 ? s : '0' + s;
        return h + ':' + m + ':' + s;
    }
    // 格式化时间 y-m-d
util.coverDay = (date) => {
        date = new Date(date);
        let year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate();
        month = month > 9 ? month : '0' + month;
        day = day > 9 ? day : '0' + day;
        return year + '-' + month + '-' + day;
    }
    // 获取dom元素的位置属性
util.getStyle = (prop, ele) => {
        if (!ele) {
            return null;
        }
        let pro = null;
        if (window.currentStyle) {
            pro = ele.currentStyle[prop];
            if (pro) {
                return parseInt(pro);
            };
            return null;
        }
        pro = getComputedStyle(ele, false)[prop];
        if (pro) {
            return parseInt(pro);
        }
        return null;
    }
    // 获取通用数据的name值;
util.getName = (a, b, key) => {
    for (let i = 0; i < b.length; i++) {
        if (b[i].id == a) {
            if (key) return b[i][key];
            return b[i].name;
        }
    }
    return '--';
};
util.getBase = (key) => {
        let obj = sessionStorage.getItem('BaseData');
        if (obj) {
            obj = JSON.parse(obj);
            if (obj[key]) {
                return obj[key];
            }
        }
        return null;
    }
    // let resolve = function(path) {
    //     return resolve => require(['./../views/pages/content/children/contentone.vue'], resolve);
    // }
    // util.resolve = resolve;
export default util;
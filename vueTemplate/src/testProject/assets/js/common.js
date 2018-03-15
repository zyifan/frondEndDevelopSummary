let util={};

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
// 随机生成不重复的id值
util.randomID = function (randomLength){
    return Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36)
}

export default util;
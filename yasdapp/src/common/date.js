Date.prototype.EosFormat = function (fmt) { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours() + 8, //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}


export function EosFormatDate(date, fmt) {
  return date.EosFormat(fmt)
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

export function getCountDown(dt) {
  var now = new Date()    //结束时间
  var date = now.getTime() - new Date(dt).getTime()   //时间差的毫秒数    
  //计算出相差天数
  var days = Math.floor(date / (24 * 3600 * 1000))

  //计算出小时数
  var leave1 = date % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))
  //计算相差秒数
  var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000)
  return " 相差 " + days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒"
}
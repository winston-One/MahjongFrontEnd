 /**
  * @param {String} str (y-m-d h:i:s) y:年 m:月 d:日 h:时 i:分 s:秒
  */
 function dateTimeStr(str){
 	var date = new Date(),
 	year = date.getFullYear(), //年
 	month = date.getMonth() + 1, //月
 	day = date.getDate(), //日
 	hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(), //时
 	minute = date.getMinutes() < 10 ? date.getMinutes() : date.getMinutes(), //分
 	second = date.getSeconds() < 10 ? date.getSeconds() : date.getSeconds(); //秒
 	month >= 1 && month <= 9 ? (month = "0" + month) : "";
 	day >= 0 && day <= 9 ? (day = "0" + day) : "";
 	hour >= 0 && hour <= 9 ? hour : "";
 	minute >= 0 && minute <= 9 ? (minute = "0" + minute) : "";
 	second >= 0 && second <= 9 ? (second = "0" + second) : "";
 	if(str.indexOf('y') != -1){
 		str = str.replace('y', year)
 	}
 	if(str.indexOf('m') != -1){
 		str = str.replace('m', month)
 	}
 	if(str.indexOf('d') != -1){
 		str = str.replace('d', day)
 	}
 	return str.substring(0,10);
 }
 // 从当前时间开始，获取以半个小时制的时间段
 function getTimeRange(){
  var step = 30
  var date = new Date()
  var date1 = new Date()
  var date2 = new Date()
  var localDay = date2.getDay()
  if (30 < Number(date.getUTCMinutes()) < 59){
    date.setUTCMinutes(30)
  }
  if (0 < Number(date.getUTCMinutes()) < 30){
    date.setUTCMinutes(0)
  }
  if (30 < Number(date1.getUTCMinutes()) < 59){
    date1.setUTCMinutes(30)
  }
  if (0 < Number(date1.getUTCMinutes()) < 30){
    date1.setUTCMinutes(0)
  }
  var arr = [], timeArr = [];
  var slotNum = 24*60/step   // 算出多少个间隔
  for (var f = 0; f < slotNum; f++) {
      var time = new Date(Number(date.getTime()) + Number(step*60*1000*f))
      var time1 = new Date(Number(date1.getTime() + 1000*60*30) + Number(step*60*1000*f))
      var hour = '', sec = '';
      var hour1 = '', sec1 = '';
      time.getHours() < 10 ? hour = '0' + time.getHours() : hour = time.getHours()
      time.getMinutes() < 10 ? sec = '0' + time.getMinutes() : sec = time.getMinutes()
      time1.getHours() < 10 ? hour1 = '0' + time1.getHours() : hour1 = time1.getHours()
      time1.getMinutes() < 10 ? sec1 = '0' + time1.getMinutes() : sec1 = time1.getMinutes()
      var start = hour + ':' + sec
      var end = hour1 + ':' + sec1

      var body = new Object();
      body.time = start +'-' + end
      body.isNextDay = 0
      if (time.getDay() != localDay) {
        body.isNextDay = 1
      }
      body.free = 0
      timeArr.push(body)
  }
  return timeArr
 }
 // 获取近七天的日期加星期几，日期按照2022-10-03的格式
 function getDate() {
   var base = new Date().getTime()
   var oneDay = 24 * 3600 * 1000;
   var date = [];
   var data = [Math.random() * 300];
   var time = new Date(base);
   var weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
   var body1 = new Object();
   var myddy1 = time.getDay()
   body1.week = weekday[myddy1]
   body1.year = time.getFullYear()
   time.setMonth(time.getMonth() + 1)
   if(time.getMonth()<10){
    var month = "0"+time.getMonth()
    console.log(time.getMonth())
   }
   body1.data = [month, time.getDate()].join('-')
   date.push(body1);
   for (var i = 1; i < 7; i++) {
       var now = new Date(base += oneDay);
       var myddy = now.getDay(); //获取存储当前日期
       var body = new Object();
       body.week = weekday[myddy]
       body.year = now.getFullYear()
       now.setMonth(now.getMonth() + 1)
       if(now.getMonth()<10){
        var month1 = "0"+time.getMonth()
        console.log(time.getMonth())
       }
       body.data = [month1, now.getDate()].join('-')
       date.push(body);
       data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
   }
   //var newdate = date.reverse()
   return date;
 }
 function getSeven() {
   let dates = [];  
       let currentDate = new Date(); // 获取当前日期  
     
       // 添加今天的日期  
       let year = currentDate.getFullYear();  
       let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');  
       let day = currentDate.getDate().toString().padStart(2, '0');  
       let formattedDate = `${month}-${day}`;  
       let dayOfWeek = currentDate.toLocaleString('zh-CN', { weekday: 'long' });  
       dates.push({  
           data: formattedDate,  
           week: dayOfWeek,  
           year: year  
       });  
     
       // 生成接下来的六天日期  
       for (let i = 1; i < 7; i++) {  
           currentDate.setDate(currentDate.getDate() + 1);  
           year = currentDate.getFullYear();  
           month = (currentDate.getMonth() + 1).toString().padStart(2, '0');  
           day = currentDate.getDate().toString().padStart(2, '0');  
           formattedDate = `${month}-${day}`;  
           dayOfWeek = currentDate.toLocaleString('zh-CN', { weekday: 'long' });  
     
           dates.push({  
               data: formattedDate,  
               week: dayOfWeek,  
               year: year  
           });  
       }  
     
       return dates;  
 }
 
 module.exports = {
	dateTimeStr,
  getTimeRange,
  getDate,
  getSeven,
}
/** 
* JavaScript Method 1.0
* The public JavaScript method
* JavaScript 通用方法
* 
* 作者:lichenbuliren
* 更新日期：2014年8月19日
* BUG提交：67106268@qq.com
*/
var CommonUtil = {
	//格式化当前时间: yyyy-MM-dd
	formatDate : function(formatStr){
		var str = formatStr;
		var date = new Date();
		var Week = ['日', '一', '二', '三', '四', '五', '六'];
		str = str.replace(/yyyy|YYYY/, date.getFullYear());
		str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));
		str = str.replace(/MM/, (date.getMonth() + 1) > 9 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1));
		str = str.replace(/M/g, (date.getMonth() + 1));
		str = str.replace(/w|W/g, Week[date.getDay()]);
		str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
		str = str.replace(/d|D/g, date.getDate());
		str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
		str = str.replace(/h|H/g, date.getHours());
		str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
		str = str.replace(/m/g, date.getMinutes());
		str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
		str = str.replace(/s|S/g, date.getSeconds());
		return str
	}
}

module.exports = CommonUtil;
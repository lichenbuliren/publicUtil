/**
 * 配置信息对象
 */
var commonUtil = require('./commonUtil.js');

var Config = {
	//又拍云信息
	CLOUD_PIC_HOST: 'http://uimg.hai360.com',
	CLOUD_PIC_PATH: '/upload/'+ commonUtil.formatDate('yyyy-MM-dd')+'/',
	CLOUD_FILE_PATH: 'http://htfiles.b0.upaiyun.com',
	CLOUD_BUCKET_IMG: 'hai360',
	CLOUD_BUCKET_FILE: 'htfiles',
	CLOUD_USER: 'taohai',
	CLOUD_PWD: 'taohai@2013',

	//ftp地址信息
	FTP_HOST: "2X3.1X5.1X9.1X8",
	FTP_USER: "XXXX",
	FTP_PASS: "XXXXX",
	FTP_PATH: "/var/www/act.XXXX.com",

	//接口信息
	API_HOST: "marketing.XXX.com",
	API_PATH: "/api/v1/marketing_active.get_active_by_id",

	//活动页面访问路由
	ACTIVE_HOST: "http://newact.XXX.com/"
}
module.exports = Config;
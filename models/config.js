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
	FTP_HOST: "203.195.159.158",
	FTP_USER: "samgui",
	FTP_PASS: "tao1314521hai",
	FTP_PATH: "/var/www/act.hai360.com",

	//接口信息
	API_HOST: "marketing.hai0.com",
	API_PATH: "/api/v1/marketing_active.get_active_by_id",

	//活动页面访问路由
	ACTIVE_HOST: "http://newact.hai360.com/"
}
module.exports = Config;
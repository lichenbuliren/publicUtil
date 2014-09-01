/**
 * 配置信息对象
 */
var commonUtil = require('./commonUtil.js');

var Config = {
	CLOUD_PIC_HOST: 'http://uimg.xxxx.com',
	CLOUD_PIC_PATH: '/upload/'+ commonUtil.formatDate('yyyy-MM-dd')+'/',
	CLOUD_FILE_PATH: 'http://xxxx.b0.upaiyun.com',
	CLOUD_BUCKET_IMG: 'xxxxx',
	CLOUD_BUCKET_FILE: 'xxxx',
	CLOUD_USER: 'xxxxx',
	CLOUD_PWD: 'xxxxxxxx'
}
module.exports = Config;

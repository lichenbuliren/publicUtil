/**
 * 配置信息对象
 */
var commonUtil = require('./commonUtil.js');

var Config = {
	CLOUD_PIC_HOST: 'http://uimg.hai360.com',
	CLOUD_PIC_PATH: '/upload/'+ commonUtil.formatDate('yyyy-MM-dd')+'/',
	CLOUD_FILE_PATH: 'http://htfiles.b0.upaiyun.com',
	CLOUD_BUCKET_IMG: 'hai360',
	CLOUD_BUCKET_FILE: 'htfiles',
	CLOUD_USER: 'taohai',
	CLOUD_PWD: 'taohai@2013'
}
module.exports = Config;
/**
 * 工具类，提供与业务相关的公共方法
 * @author Heaven
 * @date 2014-09-03
 */
var http = require("http");
var crypto = require('crypto');
var util = require('util');
var path = require("path");
var Connection = require('ssh2'); //ssh2模块
//配置文件信息对象
var config = require('../models/config.js');
var Sftp = require('./sftp.js');

var helper = {
	//http get请求
	doGet: function(url, callback){
		var data = [];
		http.get(url,function(res){
			res.setEncoding("utf8");
			res.on("data",function(chunk){
				data.push(chunk);
			}).on("end",function(){
				return callback(null,data.join(''));
			});
		}).on("error",function(err){
			console.log("err============" + err);
			return callback(err);
		});
	},
	//sftp文件上传
	sftpFastPut : function (fileName,localFilePath,remoteFilePath,callback) {
		var sftp = new Sftp(config.FTP_HOST,22,config.FTP_USER,config.FTP_PASS);
		sftp.fastPut(fileName,localFilePath,remoteFilePath,function(err){
			return callback(err);
		});
	},

	//构建活动文件名称，规则为活动id+md5(id).str(-5)
	generalActName: function(act_id){
		return act_id + this.md5(act_id).substr(-5);
	},

	//md5加密
	md5: function(str){
		return crypto.createHash('md5').update(str, 'utf8').digest('hex');
	}
}

module.exports = helper
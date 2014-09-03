/**
 * sftp文件上传
 */
var Connection = require('ssh2'); //ssh2模块
var config = require('./config.js');
function Sftp(host,port,username,password){
	this.host = host;
	this.port = port || 22;
	this.username = username;
	this.password = password;
}
/**
 * 保存本地文件到远程服务器
 * @param  {String}   fileName       [保存文件名]
 * @param  {String}   localFilePath  [本地文件路径，包括文件名]
 * @param  {String}   remoteFilePath [远程服务器保存路径，不包括文件名，以'/'结尾]
 * @param  {Function} callback       [回调函数，返回一个err参数]
 * @return {void}
 */
Sftp.prototype.fastPut = function(fileName,localFilePath,remoteFilePath,callback){
	var conn = new Connection();
	conn.on('ready',function(){
		console.log('Connection :: ready');
		conn.sftp(function(err,sftp){
			if(err){
				conn.end();
				console.log(err);
				return callback(err);
			}
			//读取文件目录remoteFilePath的属性
			sftp.stat(remoteFilePath,function(err,stat){
				if(err){
					sftp.mkdir(remoteFilePath,function(err){
						if(err){//不存在当前路径，则新建一个目录
							conn.end();
							console.log('the remoteFilePath err:' + err);
							return callback(err);
						}
						// sftp.fastPut(localFilePath,remoteFilePath + fileName,function(err){
						// 	if(err){
						// 		conn.end();
						// 		console.log(err);
						// 		return callback(err);
						// 	}
						// 	console.log("文件上传成功");
						// 	conn.end();
						// 	return callback(null);
						// });
						fastPut(sftp,localFilePath,remoteFilePath + fileName,function(err){
							return callback(err);
						});
					});
				}
				fastPut(sftp,localFilePath,remoteFilePath + fileName,function(err){
					return callback(err);
				});
			});
		});
	}).connect({
		host: this.host,
		port: this.post,
		username: this.username,
		password: this.password
	});

	function fastPut(sftp,localFilePath,remoteFile,callback){
		sftp.fastPut(localFilePath,remoteFilePath + fileName,function(err){
			conn.end();
			if(err){
				console.log(err);
				return callback(err);
			}
			console.log("文件上传成功");
			return callback(null);
		});
	}
}

module.exports = Sftp;
/**
 * 总的路由文件
 */
//crypto 是 Node.js 的一个核心模块，我们用它生成散列值来加密密码。
var crypto = require('crypto');
var util = require('util');
var path = require("path");
var http = require("http");
var fs = require('fs'); //文件操作模块
var querystring = require('querystring');
//日期工具类
var commonUtil = require("../models/commonUtil.js");
//配置文件信息对象
var config = require('../models/config.js');
var UPYun = require('../models/upyun').UPYun;
//卖场对象
var Active = require('../models/active.js');
//工具类
var helper = require('../models/helper.js');

module.exports = function(app) {
	app.get('/marketing', function(req, res) {
		res.render('index', {
			title: '管理平台-淘海科技',
		});
	});

	//发布活动
	app.post("/publish",function(req,res){
		var act = {
			act_id : commonUtil.trim(req.body.act_id),
			templateId : commonUtil.trim(req.body.templateId),
			page_css : commonUtil.trim(req.body.page_css),
			page_js : commonUtil.trim(req.body.page_js)
		}
		//title,page_url需要后面获取
		//var getUrl = "http://marketing.hai0.com/api/v1/marketing_active.get_active_by_id?id=124";
		var api_url = "http://" + config.API_HOST + config.API_PATH + "?id=" + act.act_id;
		//发送get请求
		helper.doGet(api_url,function(err,data){
			if(err){
				console.log(err);
				return;
			}

			data = JSON.parse(data).data[0];
			//给页面返回自定义css与js样式脚本
			if(!data) {
				res.send(500,'数据异常！(请检查活动商品包ID是否有效)');
				return false;
			};
			data.page_css = act.page_css;
			console.log("act.page_css================" + act.page_css);
			data.page_js = act.page_js || "";
			//设置活动标题
			act.title = data.active_name;
			
			//渲染模板数据
			res.render('template/' + act.templateId,{
				data: data
			},function(err,html){
				if(err){
					console.log("err==============" + err);
					return res.send(500,err);
				}

				//生成活动名称
				var fileName = helper.generalActName(act.act_id) + ".html",
					localFilePath = path.join(path.dirname(__dirname),'publish',fileName);

				//保存活动页面到本地路径
				fs.writeFile(localFilePath,html,function(err){
					if(err) throw err;
					/**
					 * 首先判断需要写入文件的目录是否存在
					 * 如果存在，则直接写入，如果不存在则，建立目录
					*/
					var actDir  = commonUtil.formatDate('yyyyMM');
					//远程ftp路径
					var remoteFilePath = config.FTP_PATH + "/" + actDir +"/";
					helper.sftpFastPut(fileName,localFilePath,remoteFilePath,function(err){
						if(err) throw err;
						//删除本地文件
						fs.unlinkSync(localFilePath);
						//活动url
						act.page_url = config.ACTIVE_HOST + actDir + '/' + fileName;
						//构建一个活动对象
						var active = new Active(act);
						active.save(function(err){
							if(err){
								console.log(err);
								return res.redirect('/');
							}
							console.log(act.page_url);
							console.log('数据保存成功');
							res.redirect(act.page_url);
						});
					});
				});
			});
		});
	});

	app.get('/test', function(req, res) {
		var serverResponse = res;
		//要发送的post数据
		var getUrl = "http://marketing.hai0.com/api/v1/marketing_active.get_active_by_id?id=124";
		var result = [];
		var responseData = {};
		//发起请求
		var reqGet = http.get(getUrl, function(res) {
			res.setEncoding("utf8");
			res.on('data', function(chunk) {
				result.push(chunk);
			}).on("end", function() {
				//result.data[0].goods_items[0]
				var responseResult = JSON.parse(result.join(''));
				//res.render如果设置了回调函数，则默认没有回应
				serverResponse.render('saleTemplate', {
					data: responseResult.data[0]
				}, function(err, html) {
					if (err) {
						console.log("err : " + err);
						serverResponse.send(500, err);
					}
					var fileName = commonUtil.formatDate('yyyy-MM-dd') + '-sale.html';
					fs.writeFile(fileName, html, function(err) {
						if(err) throw err;
						console.log("files writed ");
						serverResponse.send(200, html);
						//开启sftp服务
						var conn = new Connection();
						conn.on('ready', function() {
							console.log('Connection :: ready');
							conn.sftp(function(err, sftp) {
								if (err) throw err;
								// sftp.readdir('/var/www/act.hai360.com', function(err, list) {
								// 	if (err) throw err;
								// 	console.dir(list);
								// 	conn.end();
								// });
								var localFilePath = path.join(path.dirname(__dirname),fileName);
								console.log("localFilePath:===" + localFilePath);
								sftp.fastPut(localFilePath,"/var/www/act.hai360.com/201409/demo.html",{},function(err){
									if(err){
										console.dir(err);
										return;
									}
									console.log("文件上传成功");
									conn.end();
								});
							});
						}).connect({
							host: config.FTP_HOST,
							port: 22,
							username: config.FTP_USER,
							password: config.FTP_PASS
						});
					});
				});
			});
		}).on("error", function(e) {
			console.log(e.message);
		});
	});
	//读取测试文件
	app.get("/test2", function(req, res) {
		var dataFile = __dirname + "/data.json";
		console.log(dataFile);
		fs.readFile(dataFile, "utf-8", function(err, data) {
			if (err) {
				console.log(err);
				return;
			}
			data = JSON.parse(data);
			// res.render("saleTemplate",);
		});
	});


	//upyun文件上传
	app.post('/', function(req, res) {
		var upyun = new UPYun(config.CLOUD_BUCKET_IMG, config.CLOUD_USER, config.CLOUD_PWD);
		// upyun.getBucketUsage(testCallback);
		// console.log("===================");
		// console.log(util.inspect(req.files));
		// console.log("===================");
		for (var i in req.files) {
			if (req.files[i].size == 0) {
				//使用同步方法删除一个文件
				fs.unlinkSync(req.files[i].path);
			} else {
				/**
				 * var fileContent = fs.readFileSync('test.jpg');
					var md5Str = md5(fileContent);
					upyun.setContentMD5(md5Str);
					upyun.setFileSecret('bac');
				 */
				console.log("=====================" + util.inspect(req.files[i].path));
				var fileContent = fs.readFileSync(req.files[i].path);
				var md5Str = md5(fileContent);
				upyun.setContentMD5(md5Str);
				// console.log("保存路径：" + config.CLOUD_PIC_PATH+req.files[i].name+"==========文件内容：" + util.inspect(fileContent));
				upyun.writeFile(config.CLOUD_PIC_PATH + req.files[i].name, fileContent, true, testCallback);
				var target_path = './public/img/' + req.files[i].name;
				fs.renameSync(req.files[i].path, target_path);
			}
		}
		req.flash('success', '文件上传成功!');
		res.redirect('/');
	});


	app.post("/multipartUpload", function(req, res) {
		var upyun = new UPYun(config.CLOUD_BUCKET_IMG, config.CLOUD_USER, config.CLOUD_PWD);
		for (var i in req.files) {
			if (req.files[i].size == 0) {
				//使用同步方法删除一个文件
				fs.unlinkSync(req.files[i].path);
			} else {
				// var fileContent =  fs.readFileSync(req.files[i].path);
				// var md5Str = md5(fileContent);
				// upyun.setContentMD5(md5Str);
				// upyun.writeFile(config.CLOUD_PIC_PATH+req.files[i].name, fileContent, true, testCallback);
				var target_path = './public/img/' + req.files[i].name;
				fs.renameSync(req.files[i].path, target_path);
			}
		}
		req.flash('success', '文件上传成功!');
		res.redirect('/');
	});

	function testCallback(err, data) {
		if (!err) {
			console.log('Data: ' + data);
		} else {
			console.log('Error: ' + util.inspect(err));
		}
	}


	//判断已登录
	function checkLogin(req, res, next) {
		if (!req.session.user) {
			req.flash('error', '未登录！');
			res.redirect('/login');
		}
		next();
	}

	//判断未登录
	function checkNotLogin(req, res, next) {
		if (req.session.user) {
			req.flash('error', '已登录！');
			res.redirect('back');
		}
		next();
	}
}
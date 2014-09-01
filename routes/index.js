/**
 * 总的路由文件
 */
//crypto 是 Node.js 的一个核心模块，我们用它生成散列值来加密密码。
var crypto = require('crypto');
var util = require('util');
var fs = require('fs'); //文件操作模块
var http = require('http');
var querystring = require('querystring');
//日期工具类
var commonUtil = require("../models/commonUtil.js");
//配置文件信息对象
var config = require('../models/config.js');
var UPYun = require('../models/upyun').UPYun;

// exports.index = function(req, res){
//   res.render('index', { title: 'Express' });
// };
module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('index', {
			title: '管理平台-淘海科技',
		});
	});

	app.get('/test',function(req,res){
		var serverResponse = res;
		//要发送的post数据
		var contents = querystring.stringify({
			"id" : 100
		});

		//post信息
		var options = {
			host: "marketing.xxxxx.com",
			//默认
			port: 80,
			path: "/api/v1/marketing_active.get_active_by_id?id=127",
			method: "GET",
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': contents.length
			}
		};
		var getUrl = "http://marketing.xxxxx.com/api/v1/marketing_active.get_active_by_id?id=124";
		var result = [];
		var responseData = {};
		//发起请求
		var reqGet  = http.get(getUrl,function(res){
			res.setEncoding("utf8");
			console.log("statusCode:" + res.statusCode);
			res.on('data',function(chunk){
				result.push(chunk);
			}).on("end",function(){
				//result.data[0].goods_items[0]
				var responseResult = JSON.parse(result.join(''));
				//res.render如果设置了回调函数，则默认没有回应
				serverResponse.render('saleTemplate',{
					data: responseResult.data[0]
				},function(err,html){
					if(err){
						console.log("err : " + err);
						serverResponse.send(500,err);
					}
					fs.writeFile(commonUtil.formatDate('yyyy-MM-dd')+'-sale.html', html,function(res){
						console.log("files writed ");
						serverResponse.send(200,html);
					});
				});
			});
		}).on("error",function(e){
			console.log(e.message);
		});
	});
	//读取测试文件
	app.get("/test2",function(req,res){
		var dataFile = __dirname + "/data.json";
		console.log(dataFile);
		fs.readFile(dataFile,"utf-8",function(err,data){
			if(err){
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
				console.log("====================="  + util.inspect(req.files[i].path));
				var fileContent =  fs.readFileSync(req.files[i].path);
				var md5Str = md5(fileContent);
				upyun.setContentMD5(md5Str);
				// console.log("保存路径：" + config.CLOUD_PIC_PATH+req.files[i].name+"==========文件内容：" + util.inspect(fileContent));
				upyun.writeFile(config.CLOUD_PIC_PATH+req.files[i].name, fileContent, true, testCallback);
				var target_path = './public/img/' + req.files[i].name;
				fs.renameSync(req.files[i].path, target_path);
			}
		}
		req.flash('success', '文件上传成功!');
		res.redirect('/');
	});


	app.post("/multipartUpload",function(req,res){
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

	function testCallback(err,data){
		if (!err) {
			console.log('Data: ' + data);
		} else {
			console.log('Error: ' + util.inspect(err));
		}
	}

	function md5(string) {
		var crypto = require('crypto');
		var md5sum = crypto.createHash('md5');
		md5sum.update(string, 'utf8');
		return md5sum.digest('hex');
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

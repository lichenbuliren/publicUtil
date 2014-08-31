/**
 * 总的路由文件
 */
//crypto 是 Node.js 的一个核心模块，我们用它生成散列值来加密密码。
var crypto = require('crypto');
var util = require('util');
var fs = require('fs'); //文件操作模块
var http = require('http');
var querystring = require('querystring');
//配置文件信息对象
var config = require('../models/config.js');
var UPYun = require('../models/upyun').UPYun;

// exports.index = function(req, res){
//   res.render('index', { title: 'Express' });
// };
module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('index', {
			title: '主页',
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	app.get("/post",function(req,res){
		var result = [];
		//发起请求
		var reqGet  = http.get("/test",function(res){
			res.setEncoding("utf8");
			console.log("statusCode:" + res.statusCode);
			res.on('data',function(chunk){
				result.push(chunk);
			}).on("end",function(){
				console.log("resbody===============" + res.body);
				//写文件
				fs.writeFile('test.html', res.body, function (err) {
					if (err) throw err;
					console.log('It\'s saved!');
				});
			});
		}).on("error",function(e){
			console.log(e.message);
		});
	});

	app.get('/test',function(req,res){
		var serverResponse = res;
		//要发送的post数据
		var contents = querystring.stringify({
			"id" : 129
		});

		//post信息
		var options = {
			host: "marketing.hai0.com",
			//默认
			port: 80,
			path: "/api/v1/marketing_active.get_active_by_id?id=129",
			method: "GET",
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': contents.length
			}
		};
		var getUrl = "http://marketing.hai0.com/api/v1/marketing_active.get_active_by_id?id=129";
		var result = [];
		var responseData = {};
		//发起请求
		var reqGet  = http.get(getUrl,function(res){
			res.setEncoding("utf8");
			console.log("statusCode:" + res.statusCode);
			res.on('data',function(chunk){
				console.log("chunk:===========" + chunk);
				result.push(chunk);
			}).on("end",function(){
				var content = serverResponse.render('index',{
					responseData: JSON.parse(result.toString()),
					success: req.flash('success').toString(),
					error: req.flash('error').toString()
				});
				console.log(content);
				fs.writeFileSync('index.html', content);
			});
		}).on("error",function(e){
			console.log(e.message);
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
var mongodb = require("./db"),
	commonUtil = require("./commonUtil.js");

/**
 * 活动模型
 */
function Active(active){
	this.act_id = active.act_id;
	this.templateId = active.templateId;
	this.page_css = active.page_css;
	this.page_js = active.page_js;
	this.title = active.title;
	this.page_url = active.page_url;
}

module.exports = Active;

//保存一个活动信息
Active.prototype.save = function (callback) {
	var publish_time = commonUtil.formatDate("yyyy-MM-dd hh:mm:ss");
	var active = {
		act_id : this.act_id,
		templateId : this.templateId,
		page_css : this.page_css,
		page_js : this.page_js,
		title : this.title,
		publish_time: publish_time,
		page_url : this.page_url
	}

	//打开数据库
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		//读取actives集合
		db.collection('actives',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//将数据插入文档
			collection.insert(active,{safe:true},function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			});
		});
	});
}

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express);
var settings  = require('./settings');
var flash = require('connect-flash');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
//改变默认模板后缀
app.engine('.html', require("ejs").__express);
app.set('view engine', 'html');// app.set('view engine', 'ejs');
app.use(flash());
//设置默认的图标，如果要改为自己的
// app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.favicon());
app.use(express.logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded());
app.use(express.bodyParser({keepExtensions: true, uploadDir: './public/img'}));
app.use(express.methodOverride());
//express.cookieParser()是Cookie解析的中间件
app.use(express.cookieParser());
//使用session
app.use(express.session({
	secret : settings.cookieSecret,
	key: settings.db,
	cookie:{maxAge: 1000*60*60*24*30},//30 days
	store: new MongoStore({
		db: settings.db
	})
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
console.log("static path:" + __dirname + "\\" +"public");

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// app.get('/', routes.index);
// app.get('/users', user.list);
routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('publicUtil server listening on port ' + app.get('port'));
});

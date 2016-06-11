var express = require('express');
var http = require('http');  
var app = express();
var myApp = require('./app');
var myrouter = require('./router');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

app.use(multipart({ uploadDir: __dirname }));
app.use(bodyParser.urlencoded({limit: '50mb',extended: false}));
app.use(bodyParser.json({limit:'10mb',strict:false}));


app.get('/', myApp.getHomePage);
app.get('/special', myApp.getSpecial);
app.get('/fullpage', myApp.getFullpage);

app.post('/upload/uploadImg', myApp.uploadImg);
app.post('/upload/packup', myApp.packup);

myrouter.routeForStaticFiles(app,['/static','/public','/output','/bootstrap','/dashboard','/plugins']);


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.listen(8888);
var http = require('http');
var querystring = require('querystring');
var URL = require('url');
var getData = function (url,params,callback) {
	var qs = '';
	var kv = [];
	for (var x in params) {
		kv.push(x + "=" + encodeURIComponent(params[x]));
	}
	qs = kv.join("&");
	http.get(url + "?" + qs, function(res) {
		var data = '';
		res.on('data', function (chunk) {
			data += chunk;
		}).on('end',function(){
			callback(data);
		});
	}).on('error', function(e) {
		console.log("error" + e.message);
	});
};
var postData = function (url,params,callback,port) {
	var hostname = URL.parse(url).hostname;
	var path = URL.parse(url).pathname;
	var postData = querystring.stringify(params);
	port = !!port?port:80;

	var options = {
		hostname: hostname,
		port: port,
		path: path,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length
		}
	};

	var req = http.request(options, function(res) {
		res.setEncoding('utf8');
		var data = '';
		res.on('data', function (chunk) {
			data += chunk;
		}).on('end', function() {
			callback(data);
		})
	});
	req.on('error', function(e) {
		console.log('error: ' + e.message);
	});
	req.write(postData);
	req.end();
};
exports.getData = getData;
exports.postData = postData;
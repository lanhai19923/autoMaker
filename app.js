var crypto = require('crypto');
var multer = require('multer');
var zip = require("node-native-zip");
var fs = require('fs');
var filesHandler = require('./filesHandler');
var HOST ="http://" + getIP() + ":8888/";

function getIP () {
	var network = require('os').networkInterfaces();
	for (var key in network) {
		var iface = network[key];  
		for (var i = 0;  i < iface.length; i++) {  
			var alias = iface[i];  
			if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {  
				return alias.address;
			}
		}
	}
}
function getHomePage (req, res) {
	res.render('starter',{title : "PPmoney",bodyClass:""});
}
function getSpecial (req, res) {
	res.render('special',{title : "PPmoney",bodyClass:""});
}
function getFullpage (req, res) {
	res.render('fullpage',{title : "PPmoney",bodyClass:""});
}
function uploadImg (req, res) {
	console.log(req.body, req.files);
	// don't forget to delete all req.files when done 
	// 获得文件的临时路径
	var tmp_path = req.files.file.path;

	var relativePath = req.body.relativePath;
	relativePath = relativePath.slice(1, relativePath.lastIndexOf("/")+1);
	console.log(relativePath);
	// 指定文件上传后的目录 - 示例为"images"目录。
	var postfix = tmp_path.slice(tmp_path.lastIndexOf("."));
	var shasum = crypto.createHash('sha1');
	shasum.update(req.files.file.name);
	var d = shasum.digest('hex');

	var target_path = './public/img/uploadImg/' + d + postfix;
	console.log(target_path.slice(1, target_path.lastIndexOf("/")+1));

	// 移动文件
	filesHandler.exists('./public/img/uploadImg/').then(() => {
		fs.rename(tmp_path, target_path, function(err) {
			if (err) throw err;
			// 删除临时文件夹文件
			/*fs.unlink(tmp_path, function(err) {
			    if (err) throw err;
			});*/
			return res.json({status: true,url:target_path});
		});
	})
}
function packup (req, res) {
	var time = new Date();
	var timeString =  time.toJSON();
	var shasum = crypto.createHash('sha1');
	shasum.update(timeString);
	var d = shasum.digest('hex');
	var folder = './output/'+ d + '/';
	var jsfolder = './output/'+ d + '/js/';
	var cssfolder = './output/'+ d + '/css/';
	var imgfolder = './output/'+ d + '/img/';

	var finishedWriting_count = 3;
	function finishedWriting () {
		console.log("ok");
		finishedWriting_count--;
		if (finishedWriting_count == 0) {
			filesHandler.getAllFilesPath(folder, function (pathArr) {
				var data = [];
				for (var i = 0; i < pathArr.length; i++) {
					data.push({
						name: pathArr[i].replace(folder+'/',''),
						path: pathArr[i]
					})
				}
				console.log(data);
				var archive = new zip();
				archive.addFiles(data, function () {
					var buff = archive.toBuffer();
					fs.writeFile(folder+"PPmoney.zip", buff, function () {
						console.log("im finished");
						return res.json({status: true,link: HOST+'output/'+ d + '/PPmoney.zip'});
					});
				}, function (err) {
					console.log(err);
				});
			});
		}
	}
	//复制模板
	filesHandler.copyfolder('./static/crop_templet', folder).then(() => {
		console.log("文件夹复制完成");
		finishedWriting();
	});
	qData = JSON.parse(req.param('qData'));
	//写入图片
	filesHandler.exists(imgfolder).then(() => {
		var finished_count = qData.imgs.length;
		function finishedCountDown () {
			finished_count--;
			if (finished_count == 0) {
				console.log("写入图片ok");
				finishedWriting();
			}
		}
		for (var i = 0; i < qData.imgs.length; i++) {
			base64Data = qData.imgs[i].bg_a.replace(/^data:image\/jpeg;base64,/,""),
			binaryData = new Buffer(base64Data, 'base64').toString('binary');

			fs.writeFile(imgfolder + "img" + (i+1) +".jpg", binaryData, "binary", function(err) {
				if(err) {
					console.log("fail " + err);  
				} else {
					finishedCountDown();
				}
			});
		}
	})
	//写入配置js文件
	filesHandler.exists(jsfolder).then(() => {
		var CONFIG_data = {};
		CONFIG_data.copyrightBackgroundColor = qData.copyrightBackgroundColor;
		CONFIG_data.copyrightColor = qData.copyrightColor;
		CONFIG_data.showCopyright = qData.showCopyright;
		CONFIG_data.title = qData.title;
		CONFIG_data.imgs = [];

		for (var i = 0; i < qData.imgs.length; i++) {
			CONFIG_data.imgs[i] = {};
			CONFIG_data.imgs[i]["bg_a"] = "img/img" + (i+1) + ".jpg";
			CONFIG_data.imgs[i]["bg_b"] = "img/img" + (i+1) + ".jpg";
			CONFIG_data.imgs[i]["width"] = qData.imgs[i]["width"];
			CONFIG_data.imgs[i]["height"] = qData.imgs[i]["height"];
		}
		fs.writeFile(jsfolder + "config.js", "CONFIG=" + JSON.stringify(CONFIG_data), function(err){  
			if(err)  
				console.log("fail " + err);  
			else  
				console.log("写入config.js文件ok");
				finishedWriting();
		});
	})
}
exports.getHomePage = getHomePage;
exports.getSpecial = getSpecial;
exports.getFullpage = getFullpage;
exports.uploadImg = uploadImg;
exports.packup = packup;
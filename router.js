function routeForStaticFiles (app,path) {
	for (var i = 0; i < path.length; i++) {
		(function(p){
			app.get(p+'/*',function(req, res){
				res.sendFile(__dirname + req.originalUrl);
			})
		})(path[i]);
	}
}
exports.routeForStaticFiles = routeForStaticFiles;
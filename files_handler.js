﻿var fs = require('fs');
/*function copyfolder (params) {
    exists(params.dst, function(params) {
        // 读取目录中的所有文件/目录
        fs.readdir(params.src,function(err, paths){
            var finished_count = paths.length;
            function finishedCountDown () {
                finished_count--;
                if (finished_count == 0) {
                    if (typeof params.callback == 'function') {
                        params.callback();
                    }
                }
            }
            if( err ){
                throw err;
            } else {
                paths.forEach(function(path){
                    copyfile({
                        src: params.src,
                        dst: params.dst,
                        filename: path, 
                        callback: finishedCountDown
                    });
                });
            }
        });
    }, {
        src: params.src,
        dst: params.dst,
        callback: params.callback
    });
};*/
function copyfolder (src, dst) {
    return new Promise((resolve) => {
        exists(dst).then(() => {
            // 读取目录中的所有文件/目录
            fs.readdir(src,function(err, paths){
                var finished_count = paths.length;
                function finishedCountDown () {
                    finished_count--;
                    if (finished_count == 0) {
                        resolve();
                    }
                }
                if( err ){
                    throw err;
                } else {
                    paths.forEach(function(path){
                        copyfile(src, dst, path).then(() => {
                            finishedCountDown();
                        })
                    });
                }
            });
        })
    })
};
/*function copyfile (params) {
    exists(params.dst).then(() => {
        var _src = params.src + '/' + params.filename,
            _dst = params.dst + '/' + params.filename,
            readable, writable;       
        fs.stat( _src, function( err, st ){
            if( err ){
                throw err;
            }
            // 判断是否为文件
            if( st.isFile() ){
                // 创建读取流
                readable = fs.createReadStream( _src );
                // 创建写入流
                writable = fs.createWriteStream( _dst ); 
                // 通过管道来传输流
                readable.pipe( writable );
                writable.on('finish', function() {
                    if (typeof params.callback == 'function') {
                        params.callback();
                    }
                });
            }
            // 如果是目录则递归调用自身
            else if( st.isDirectory() ){
                exists(_dst, copyfolder, {
                    src: _src,
                    dst: _dst,
                    callback: params.callback
                });
            }
        });
    })
}*/
function copyfile (src, dst, filename) {
    console.log(src);
    console.log(dst);
    console.log(filename);
    return new Promise((resolve) => {
        exists(dst).then(() => {
            var _src = src + '/' + filename,
                _dst = dst + '/' + filename,
                readable, writable;       
            fs.stat( _src, function( err, st ){
                if( err ){
                    throw err;
                }
                // 判断是否为文件
                if( st.isFile() ){
                    // 创建读取流
                    readable = fs.createReadStream( _src );
                    // 创建写入流
                    writable = fs.createWriteStream( _dst ); 
                    // 通过管道来传输流
                    readable.pipe( writable );
                    writable.on('finish', function() {
                        resolve();
                    });
                }
                // 如果是目录则递归调用自身
                else if( st.isDirectory() ){
                    exists(_dst).then(() =>{
                        copyfolder(_src, _dst).then(() => {
                            resolve();
                        })
                    })
                }
            });
        })
    })
    
}
//判断该目录是否存在，不存在则创建目录
/*function exists (dst, callback, params) {
    fs.exists(dst, function(ifexists) {
        // 已存在
        if (ifexists) {
            callback(params);
        }
        // 不存在
        else{
            var d = dst.split('/');
            d.pop();
            exists(d.join('/'),function(){
                fs.mkdir(dst, function(){
                    callback(params);
                });
            });
        }
    });
};*/
var exists = function (dst) {
    return new Promise((resolve) => {
        fs.exists(dst, function(ifexists) {
            // 已存在
            if (ifexists) {
                resolve();
            }
            // 不存在
            else{
                var d = dst.split('/');
                d.pop();
                exists(d.join('/')).then(() => {
                    fs.mkdir(dst, function(){
                        resolve();
                    });
                })
            }
        });
    })
};
function getAllFilesPath (src,callback) {
    var pathArr = [];
    getPath(src, pathArr, function(){
        callback(pathArr);
    })
    function getPath (src, pathArr, callback) {
        fs.readdir(src, function(err, paths){
            if( err ){
                throw err;
            } else {
                var finished_count = paths.length;
                function finishedCountDown () {
                    finished_count--;
                    if (finished_count == 0) {
                        if (typeof callback == 'function') {
                            callback();
                        }
                    }
                }
                paths.forEach(function(path){

                    var _src = src + '/' + path;
                    fs.stat( _src, function(err, st){
                        if( err ){
                            throw err;
                        }
                        // 判断是否为文件
                        if(st.isFile()){
                            pathArr.push(_src);
                            finishedCountDown();
                        }
                        // 如果是目录则递归调用自身
                        else if (st.isDirectory() ) {
                            getPath(_src, pathArr, finishedCountDown);
                        }
                    });
                });
            }
        })
    }
};
exports.copyfolder = copyfolder;
exports.copyfile = copyfile;
exports.exists = exists;
exports.getAllFilesPath = getAllFilesPath;
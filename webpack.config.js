var webpack = require('webpack');
var path = require('path');
//var ExtractTextPlugin = require('extract-text-webpack-plugin');

var commonLoaders = [
    { test: /\.js$/, loader: "jsx-loader" },
    { test: /\.png$/, loader: "url-loader" },
    { test: /\.jpg$/, loader: "file-loader" },
];
var assetsPath = path.join(__dirname, "assets");
var publicPath = "assets/";

module.exports = {
    entry: {
        app: ['./static/component/test/index.js']
        /*app: [
            'webpack-dev-server/client?http://localhost:8000',//资源服务器地址
            'webpack/hot/only-dev-server',
            './static/component/entry.js'
        ],
        project:[
            'webpack-dev-server/client?http://localhost:8000',//资源服务器地址
            'webpack/hot/only-dev-server',
            "./app/entry-project.js"
        ],
        purchase:[
            'webpack-dev-server/client?http://localhost:8000',//资源服务器地址
            'webpack/hot/only-dev-server',
            "./app/entry-purchase.js"
        ],
        record:[
            'webpack-dev-server/client?http://localhost:8000',//资源服务器地址
            'webpack/hot/only-dev-server',
            "./app/entry-record.js"
        ],
        recordDetail:[
            'webpack-dev-server/client?http://localhost:8000',//资源服务器地址
            'webpack/hot/only-dev-server',
            "./app/entry-recordDetail.js"
        ],
        exit:[
            'webpack-dev-server/client?http://localhost:8000',//资源服务器地址
            'webpack/hot/only-dev-server',
            "./app/entry-exit.js"
        ],*/
        //vendor: ['react','react-dom']
    },
    output: {
        path: path.join(__dirname, '/static/assets/'),
        filename: "[name].js",
        publicPath: 'http://localhost:8000/assets/'
    },
    module: {
        loaders: [
            //{ test: /\.css$/, loader: "style!css" },
            //{ test: /\.scss$/, loader: ExtractTextPlugin.extract("style-loader", "css!autoprefixer!sass")},
            //{ test: /\.less$/, loader: ExtractTextPlugin.extract("style-loader", "css!less") },
            { test: /\.js[x]?$/, loader:"jsx-loader" },
            { test: /\.scss$/, loader:"style!css!autoprefixer!sass" },
            //{ test: /\.html$/, loader: "handlebars-loader" }, //模板打包
            //{ test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=50000&name=[path][name].[ext]'}
        ]
    },
    /*plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            React: 'react',
            ReactDOM: 'react-dom'
        }),//这个可以使jquery变成全局变量，妮不用在自己文件require('jquery')了
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),//这是妮第三方库打包生成的文件
        new ExtractTextPlugin("[name].css")
    ]*/
};
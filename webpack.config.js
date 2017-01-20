var debug = process.env.NODE_ENV !== 'production';
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var jsonLoader = require('json-loader');



module.exports = {
    context: path.join(__dirname, 'src'),
    devtool: debug ? 'inline-sourcemap' : null,
    entry: './js/client.js',
    module: {
        loaders: [
            {
                // Load all jsx react files and put into 1 source file
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']
                }
            },
            {
                // compile scss. NOTE: for dev, this is a virtual file in memory, not created as an actual file on file system
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css!sass')
            },
            {
                // test: /\.(woff2|woff|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                test: /\.(woff2|woff|ttf|eot|svg)(\?.*$|$)/,
                loader: 'file-loader?name=fonts/[name].[ext]',
                include: [
                    path.join(__dirname, 'src'),
                    path.join(__dirname, 'node_modules')
                ]
            },
            {
                // test: /\.(jpg|jpeg|gif|png|ico)$/,
                test: /\.(jpg|jpeg|gif|png|ico)(\?.*$|$)$/,
                loader: 'file-loader?name=img/[name].[ext]',
                include: [
                    path.join(__dirname, 'src'),
                    path.join(__dirname, 'node_modules')
                ]
            },
            {
             include: /\.json$/,
             loaders: [jsonLoader]
            }
        ]
    },
    output: {
        path: __dirname + '/src/',
        filename: 'client.min.js'
    },
    plugins: debug ? [
        // In dev, this is created as a virtual file to be loaded on the webpack dev server
        new ExtractTextPlugin('style.min.css', { allChunks:true })
    ] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
        new ExtractTextPlugin('style.min.css', { allChunks:true })
    ],
    devServer: {
        // needed so that all urls go to index
        historyApiFallback: true,
    }
};

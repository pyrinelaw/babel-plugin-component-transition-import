const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const fs= require("fs");
const util = require('../lib/util.js');
const libFile = '../lib/index.js'

const importOptionsList = [
    {
        // 组件库名称
        name: 'antd',
        // 文件转换规则，默认为'_',传空字符串则不转换
        splitChart: '-',
        // style 转换规则
        style: 'lib/{{name}}/style/index.less',
        // js 文件转换规则
        js: 'lib/{{name}}/index.js',
    },
];

module.exports = {
    devServer: {
        open: true,
        port: 6539,
        inline: true,
        publicPath: '/',
        contentBase: './dist',
    },
    entry: {
        index: path.join(__dirname, './index.js'),
    },
    output: {
        publicPath: '//localhost:6539/',
        path: path.join(__dirname, './dist'), // 打包后的文件存放的地方
        filename: 'index.js', // 打包后输出文件的文件名
        chunkFilename: 'index.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.vue', '.scss', '.css'],
        alias: {
            vue$: 'vue/dist/vue.js',
        },
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            compilerOptions: {
                                preserveWhitespace: false,
                            },
                            loaders: {
                                js: {
                                    loader: 'babel-loader',
                                    options: {
                                        cacheDirectory: true,
                                        presets: ['es2015', 'stage-2'],
                                        plugins: [
                                            [
                                                libFile,
                                                importOptionsList,
                                            ],
                                            'add-module-exports',
                                            'transform-es2015-modules-commonjs',
                                        ],
                                    },
                                },
                                css: ExtractTextPlugin.extract({
                                    use: ['css-loader'],
                                    fallback: 'vue-style-loader',
                                }),
                                sass: ExtractTextPlugin.extract({
                                    use: ['css-loader', 'sass-loader'],
                                    fallback: 'vue-style-loader',
                                }),
                                less: ExtractTextPlugin.extract({
                                    use: ['css-loader', 'less-loader'],
                                    fallback: 'vue-style-loader',
                                }),
                            }
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: ['es2015', 'stage-2'],
                            plugins: [
                                [
                                    libFile,
                                    importOptionsList,
                                ],
                                'add-module-exports',
                                'transform-es2015-modules-commonjs',
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.(css)$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader'],
                }),
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader'],
                }),
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'less-loader'],
                }),
            },
        ],
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss() {
                    return [precss, autoprefixer];
                },
            },
        }),
        new HtmlWebpackPlugin({
            alwaysWriteToDisk: true,
            chunks: ['index'],
            filename: 'index.html',
            template: path.join(__dirname, './index.html'),
        }),
        new ExtractTextPlugin({
            filename: 'index.css',
            // allChunks: true,
        }),
        new HtmlWebpackHarddiskPlugin(),
    ],
};

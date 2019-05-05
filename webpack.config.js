let path = require('path');
// 将 js 中的 css 进行拆分
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
// const StyleLess = new ExtractTextWebpackPlugin('css/style.less');
const StyleCss = new ExtractTextWebpackPlugin('css/style.css');

const webpack = require('webpack');
// 我们需要实现html打包功能，可以通过一个模板实现打包出引用好路径的html来
// 插件都是一个类，命名尽量大写
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 每次打包都清除已有内容 
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },              
    output: {   
        filename: 'js/[name].js',
        path: path.resolve('dist')
    }, 
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {   //第三方插件
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',     //打包后的名字
                    priority: 10
                },
                utils: {    // 抽离自己的
                    chunks: 'initial',
                    name: 'utils',
                    minSize: 0      // 只要超出0字节就能生成一个新包                    
                }
            }
        }
    },         
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                // use: [
                //     { loader: 'style-loader' },
                //     { loader: 'css-loader' }
                // ]

                // use: ExtractTextWebpackPlugin.extract({
                //     // 将 css 以外链的形式引入则不需要 style-loader
                //     use: 'css-loader'
                // })

                use: StyleCss.extract({
                    use: [
                        'css-loader',
                        'postcss-loader'
                    ],
                    // css 中引入图片，需要指定相对路径
                    publicPath: '../'
                })
            },
            {
                test: /\.less$/,
                // use: [
                //     { loader: 'style-loader' },
                //     { loader: 'css-loader' }
                // ]

                // use: ExtractTextWebpackPlugin.extract({
                //     // 将 css 以外链的形式引入则不需要 style-loader
                //     use: 'css-loader'
                // })

                // use: StyleLess.extract({
                //     use: [{
                //         loader:'css-loader'
                //     },{
                //         loader:'less-loader'
                //     }],
                //     fallback:'style-loader'
                // })

                use: ExtractTextWebpackPlugin.extract({
                    use:[{
                            loader:'css-loader'
                        },{
                            loader: 'postcss-loader'
                        },{
                            loader:'less-loader'
                        }],
                    publicPath: '../',
                    fallback:'style-loader'
                })
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // 小于8K的图片自动转为base64
                            limit: 8000,
                            outputPath: 'images/'
                        }
                    }
                ]
            },
            {
                // img引用的图片地址也需要一个loader来帮我们处理好
                test: /\.(htm|html)/,
                use: 'html-withimg-loader'
            },
            {
                test: /\.(eot|ttf|woff|svg)$/,
                use: 'file-loader'
            }
        ]
    },             
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            filename: 'index.html',
            chunks: ['vendor', 'index']
        }),
        new HtmlWebpackPlugin({
            template: 'login.html',
            filename: 'login.html',
            chunks: ['utils', 'login']
        }),
        new ExtractTextWebpackPlugin('css/main.css'),
        StyleCss,
        // StyleLess
        new CleanWebpackPlugin(),
        // 热更新
        new webpack.HotModuleReplacementPlugin()
    ],            
    devServer: {
        // contentBase: './dist',
        host: 'localhost',
        port: 3000,
        hot: true,
        open: true
    },
    resolve: {
        // alias: {
        //     '$': path.join(__dirname, './js'),
        // },
        extensions: ['.js', 'json', 'css']
    },
    mode: 'development'     // 模式配置
}
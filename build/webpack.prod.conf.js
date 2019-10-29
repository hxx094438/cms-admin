'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {importLoaders: 1}
          },
          'postcss-loader'
        ]
      }
    ],
  },

  optimization: {
    //管理是否需要分包的清单
    runtimeChunk: {
      name: 'manifest'
    },
    usedExports: true,
    //取代 new webpack.optimize.ModuleConcatenationPlugin()
    concatenateModules: true,
    //识别package.json中的sideEffects以剔除无用的模块，用来做tree-shake
    sideEffects: true,
    // 编译错误时不打印输出资源
    noEmitOnErrors: true,
    splitChunks: {
      chunks: 'all', //同步异步全部打包
      minSize: 30000, // 打包文件大于这个字节才会被拆分
      minChunks: 1, // 文件最低被引用多少次才会被分包
      maxAsyncRequests: 5,  //用来限制异步模块内部的并行最大请求数
      maxInitialRequests: 5, // 用来限制入口的拆分数量
      automaticNameDelimiter: '-', // 连接符
      name: true,
      cacheGroups: {
        libs: {
          name: "chunk-libs",
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: "initial" // 只打包初始时依赖的第三方
        },
        vendor: {
          test: /(vue|vuex|vue-router)/,
          priority: 40,
          name: 'vue-vendor'
        },
        elementUI: {
          name: "elementUI", // 单独将 elementUI 拆包
          priority: 50, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
          test: /(element-ui)/
        },
        markdown: {
          name: "markdown",
          minChunks: 1,
          priority: 30,
          test: /(highlight)|(simplemde)|(codemirror)|(marked)/,
          // enforce: true  //强制分包，忽略minchunks,maxInitialRequests等限制条件
        },
        styles: {
          name: 'styles',
          test: /\.(scss|css)$/,
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
      }),
      new OptimizeCSSPlugin({}),
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]', // 生成资源的名字 [path].gz[query] 是默认名字
        algorithm: 'gzip', // 压缩算法
        test: /\.(js|css|html|svg)$/, // 匹配的资源
        compressionOptions: { level: 8 }, // 压缩等级 默认9级
        threshold: 10240, // 多大资源使用才压缩 10kb
        minRatio: 0.8,
        //仅处理压缩比此比率更好的资源（minRatio =压缩尺寸/原始尺寸）。
        //示例：您拥有1024b大小的image.png文件，压缩版本的文件大小为768b，
        //因此minRatio等于0.75。换句话说，当压缩大小/原始大小值小于minRatio值时，
        //将处理资源。默认 0.8 。
        deleteOriginalAssets: false, // 是否删除原始资产。
      }),
      new TerserPlugin({
        parallel: true,
      }),
    ]
  },
  // devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    // filename: utils.assetsPath('js/[name].[chunkhash].js'),
    // chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      chunkFilename: utils.assetsPath('css/[id].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    // new OptimizeCSSPlugin({
    //   cssProcessorOptions: config.build.productionSourceMap
    //     ? {safe: true, map: {inline: false}}
    //     : {safe: true}
    // }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),

    // split vendor js into its own file

    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated

    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk


    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),

  ]
})

// if (config.build.productionGzip) {
//   const CompressionWebpackPlugin = require('compression-webpack-plugin')

//   webpackConfig.plugins.push(
    
//   )
// }

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig

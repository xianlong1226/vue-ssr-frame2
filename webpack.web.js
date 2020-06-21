const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const glob = require('glob')
const { publicPath } = require('./config.json')

let config = {
  entry: {},
  context: path.resolve(__dirname, "entries"),
  target: 'web',
  output: {
    filename: '[name].[chunkhash].web.js',
    chunkFilename: '[name].[chunkhash].web.js',
    path: path.resolve(__dirname, 'dist/'),
    sourceMapFilename: '[file].map',
    publicPath: publicPath
  },
  module: {
    noParse: /jquery/,
    rules: [{
      // 它会应用到普通的 `.js` 文件
      // 以及 `.vue` 文件中的 `<script>` 块
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    },
    {
      // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      test: /\.css$/,
      use: [
      // 'vue-style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            // 开启 CSS Modules
            // modules: true,
            // 自定义生成的类名
            // localIdentName: '[local]_[hash:base64:8]'
          }
        },
        'postcss-loader'
      ]
    }, {
      // 普通的 `.postcss` 文件和 `*.vue` 文件中的
      // `<style lang="postcss">` 块都应用它
      test: /\.postcss$/,
      use: [
        // 'vue-style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: "css-loader", // translates CSS into CommonJS
          options: {
            importLoaders: 1,
            // 开启 CSS Modules
            // modules: true,
            // 自定义生成的类名
            // localIdentName: '[local]_[hash:base64:8]'
          }
        },
        {
          loader: "postcss-loader" // compiles postcss to CSS
        }
      ]
    }, {
      test: /\.(png|svg|jpg|jpeg|gif)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 1000
        }
      }]
    }, {
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
      use: [{
        loader: "file-loader?name=assets/fonts/[name].[hash].[ext]"
      }]
    }, {
      test: /\.vue$/,
      loader: 'vue-loader'
    }]
  },
  plugins: [
    // 使用vue-loader时必须要引入该插件
    // 这个插件是必须的！ 它的职责是将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块。
    // 例如，如果你有一条匹配 /\.js$/ 的规则，那么它会应用到 .vue 文件里的 <script> 块。
    new VueLoaderPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.DefinePlugin({
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].css'
    })
  ],
  resolve: {
    // 将 `.ts` 添加为一个可解析的扩展名。
    extensions: ['.ts', '.js'],
    alias: {
      'components': path.join(__dirname, 'components'),
      'fonts': path.join(__dirname, 'fonts')
    }
  },
  devtool: 'cheap-module-source-map',
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "common",
          chunks: "all",
          minChunks: 2
        }
      }
    }
  }
}

//业务入口文件所在的目录
const chunknames = []
const entries = []
const entryDir = path.join(__dirname, 'entries/')
glob.sync(entryDir + '*').forEach(function (entry) {
	const basename = path.basename(entry)
	chunknames.push(basename);
		entries.push({
    name: basename,
    path: entry
  })
})

entries.forEach(function (entry) {
	//添加entry
	config.entry[entry.name] = path.join(entry.path, 'index.js')
})

module.exports = config
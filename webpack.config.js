const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const autoprefixer = require('autoprefixer');

const srcFolder = path.resolve(__dirname, 'src');
const publicFolder = path.resolve(__dirname, 'public');

/**
 * Apply plugins.
 *
 * HtmlWebpackPlugin:
 * https://github.com/jantimon/html-webpack-plugin
 *
 * CleanWebpackPlugin:
 * https://github.com/johnagan/clean-webpack-plugin
 *
 * webpack.ContextReplacementPlugin:
 * https://webpack.js.org/plugins/context-replacement-plugin/
 *
 * webpack.HotModuleReplacementPlugin:
 * https://webpack.js.org/plugins/hot-module-replacement-plugin/
 *
 * Dotenv:
 * https://github.com/mrsteele/dotenv-webpack#readme
 *
 * MiniCssExtractPlugin:
 * https://github.com/webpack-contrib/mini-css-extract-plugin
 */
let plugins = [
  new HtmlWebpackPlugin({
    inject: true,
    template: path.resolve(srcFolder, 'index.html'),
  }),

  new CleanWebpackPlugin({
    root: __dirname,
    verbose: true,
  }),

  new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ru|fr|en/),

  new webpack.HotModuleReplacementPlugin(),

  new Dotenv(),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new MiniCssExtractPlugin({
      filename: '[contenthash].bundle.css',
    })
  );
}

/**
 * Config
 */
const config = {
  /**
   * Entry application point
   * https://webpack.js.org/concepts/entry-points/
   */
  entry: [
    path.resolve(srcFolder, 'index.js'),
  ],

  /**
   * Output options
   * https://webpack.js.org/configuration/output/
   */
  output: {
    publicPath: '/',
    path: publicFolder,
    filename: process.env.NODE_ENV !== 'production' ? '[hash].bundle.js' : '[hash].bundle.min.js',
  },

  /**
   * Define configuration mode
   * https://webpack.js.org/concepts/mode/
   */
  mode: process.env.NODE_ENV,

  /**
   * Source maps
   * https://webpack.js.org/configuration/devtool/
   */
  devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : false,

  /**
   * Options affecting the resolving of modules
   * https://webpack.js.org/configuration/resolve/
   */
  resolve: {
    modules: [srcFolder, 'node_modules'],
    extensions: ['.js', '.jsx', '.json','.scss', '.css'],
  },

  /**
   * Webpack dev server configuration
   * https://webpack.js.org/configuration/dev-server/
   */
  devServer: {
    port: 3000,
    contentBase: publicFolder,
    historyApiFallback: true,
    hot: true,
  },

  /**
   * Loaders
   */
  module: {
    /**
     * List of loaders
     *
     * babel-loader: transpile code (ES6/ES7) into ES5
     * https://github.com/babel/babel-loader
     *
     * file-loader:
     * https://github.com/webpack-contrib/file-loader
     *
     * style-loader:
     * https://github.com/webpack-contrib/style-loader
     *
     * css-loader:
     * https://github.com/webpack-contrib/css-loader
     *
     * extract css:
     * https://github.com/webpack-contrib/mini-css-extract-plugin
     *
     * sass-loader:
     * https://github.com/webpack-contrib/sass-loader
     *
     * postcss-loader:
     * https://github.com/postcss/postcss-loader
     */
    rules: [
      /**
       * Handling js/jsx files
       */
      {
        test: /\.jsx?$/,
        include: [srcFolder],
        exclude: /node_modules/,
        loader: 'babel-loader',
      },

      /**
       * Handling images and fonts
       */
      {
        test: /\.(ttf|eot|otf|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader: 'file-loader?name=fonts/[folder]/[name].[ext]',
      },

      {
        test: /\.(png|jpeg|jpg|svg|gif)$/,
        loader: 'file-loader?name=images/[name].[ext]',
      },

      /**
       * Handling all possible plain css
       */
      {
        test: /\.css$/,
        use: [
          {
            loader: process.env.NODE_ENV === 'production' ?
              MiniCssExtractPlugin.loader :
              'style-loader',
          },
          'css-loader',
        ],
      },

      /**
       * Handling scss of modules
       */
      {
        test: /\.scss$/,
        include: [path.resolve(srcFolder, 'components')],
        use: [
          {
            loader: process.env.NODE_ENV === 'production' ?
              MiniCssExtractPlugin.loader :
              'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer(),
              ],
            },
          },
          'sass-loader',
        ],
      },

      /**
       * Handling other scss
       */
      {
        test: /\.scss$/,
        exclude: [path.resolve(srcFolder, 'components')],
        use: [
          {
            loader: process.env.NODE_ENV === 'production' ?
              MiniCssExtractPlugin.loader :
              'style-loader',
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer(),
              ],
            },
          },
          'sass-loader',
        ],
      },

    ],
  },

  /**
   * Plugins
   */
  plugins,

  /**
   * Optimization
   * https://webpack.js.org/configuration/optimization/#optimization-minimizer
   *
   * Minify js:
   * https://webpack.js.org/plugins/terser-webpack-plugin/
   *
   * Minify styles:
   * https://github.com/NMFR/optimize-css-assets-webpack-plugin
   */
  optimization: {
    minimizer: [
      new TerserPlugin({}),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
};

module.exports = config;

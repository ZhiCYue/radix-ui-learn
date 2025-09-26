const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  devtool: 'eval-source-map', // 更好的调试体验，保持原始代码结构
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    // 保持更好的调试信息
    pathinfo: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                [
                  '@babel/preset-react',
                  {
                    runtime: 'automatic',
                    development: true, // 开发模式，保持更好的调试信息
                  }
                ],
                '@babel/preset-typescript',
              ],
              // 保持源码映射
              sourceMaps: true,
              inputSourceMap: true,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              // 生成源码映射
              compilerOptions: {
                sourceMap: true,
                inlineSourceMap: false,
                inlineSources: false,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true, // CSS 源码映射
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3000,
    hot: true,
    historyApiFallback: true,
    // 开发服务器优化
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  // 优化构建性能和调试体验
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
        },
      },
    },
  },
  // 性能提示
  performance: {
    hints: false, // 开发环境关闭性能提示
  },
};
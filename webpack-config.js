const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');
const isDevelopment = process.env.NODE_ENV !== 'production';
const path = require('path');


module.exports = {
  entry: [path.resolve(__dirname, "./src/index.tsx")],
  devServer: {
    compress: true,
    hot: true,
    port: 9000,
    static: {
      directory: path.join(__dirname, 'publicstatic'),
    }
  },
  mode: isDevelopment ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader?{configFile: \"tsconfig.json\"}",
            options: {
              getCustomTransformers: () => ({
                before: [isDevelopment && ReactRefreshTypeScript()].filter(Boolean),
              }),
              transpileOnly: isDevelopment,
            },
          },
        ],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'publicstatic')
  },
  plugins: [isDevelopment && new ReactRefreshWebpackPlugin()].filter(Boolean),
  resolve: {
      extensions: ['.ts', '.js', '.tsx', '.jsx'],
  },
};